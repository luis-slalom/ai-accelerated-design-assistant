import { useState, useRef, useEffect } from 'react';
import type { Phase, Checkpoint, Deliverable, DeliverableType, PhaseStatus, Prompt, Project } from '../types';
import { PHASE_COLORS } from '../data';
import { formatDateShort } from '../storage';

const PHASE_STATUS_OPTIONS: { value: PhaseStatus; label: string }[] = [
  { value: 'not-started', label: '○ Not started' },
  { value: 'in-progress', label: '◑ In progress' },
  { value: 'completed', label: '● Completed' },
  { value: 'skipped', label: '— Skipped' },
];

const DELIVERABLE_TYPES: { value: DeliverableType; label: string; icon: string }[] = [
  { value: 'figma', label: 'Figma', icon: '◈' },
  { value: 'doc', label: 'Document', icon: '☰' },
  { value: 'slides', label: 'Slides', icon: '▤' },
  { value: 'notion', label: 'Notion', icon: '◻' },
  { value: 'video', label: 'Video', icon: '▶' },
  { value: 'link', label: 'Link', icon: '⊞' },
  { value: 'other', label: 'Other', icon: '○' },
];

interface CheckpointDraft {
  title: string;
  content: string;
  promptId: string;
  promptTitle: string;
  tags: string;
}

interface DeliverableDraft {
  title: string;
  type: DeliverableType;
  url: string;
  description: string;
}

const EMPTY_CHECKPOINT: CheckpointDraft = { title: '', content: '', promptId: '', promptTitle: '', tags: '' };
const EMPTY_DELIVERABLE: DeliverableDraft = { title: '', type: 'link', url: '', description: '' };

interface Props {
  project: Project;
  phase: Phase;
  prompts: Prompt[];
  onBack: () => void;
  onUpdatePhase: (changes: Partial<Phase>) => void;
  onAddCheckpoint: (data: Omit<Checkpoint, 'id' | 'createdAt'>) => void;
  onUpdateCheckpoint: (id: string, changes: Partial<Omit<Checkpoint, 'id' | 'createdAt'>>) => void;
  onDeleteCheckpoint: (id: string) => void;
  onAddDeliverable: (data: Omit<Deliverable, 'id' | 'addedAt'>) => void;
  onDeleteDeliverable: (id: string) => void;
}

export function PhaseView({
  project,
  phase,
  prompts,
  onBack,
  onUpdatePhase,
  onAddCheckpoint,
  onUpdateCheckpoint,
  onDeleteCheckpoint,
  onAddDeliverable,
  onDeleteDeliverable,
}: Props) {
  const [showCheckpointForm, setShowCheckpointForm] = useState(false);
  const [checkpointDraft, setCheckpointDraft] = useState<CheckpointDraft>(EMPTY_CHECKPOINT);
  const [expandedCheckpointId, setExpandedCheckpointId] = useState<string | null>(null);
  const [editingCheckpointId, setEditingCheckpointId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CheckpointDraft>(EMPTY_CHECKPOINT);
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverableDraft, setDeliverableDraft] = useState<DeliverableDraft>(EMPTY_DELIVERABLE);
  const [notesValue, setNotesValue] = useState(phase.notes);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const notesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phaseColor = PHASE_COLORS[phase.code];
  const phaseLevel = phase.code === 'U' ? 'Utility' : `0${phase.code} ${phase.label}`;
  const phasePrompts = prompts.filter(p => p.level === phaseLevel);
  // For Utility phase, also show U-00 global contract
  const allPhasePrompts = phase.code === 'U'
    ? prompts.filter(p => p.level === 'Utility')
    : phasePrompts;

  useEffect(() => {
    setNotesValue(phase.notes);
  }, [phase.id]);

  function handleNotesChange(value: string) {
    setNotesValue(value);
    if (notesTimeout.current) clearTimeout(notesTimeout.current);
    notesTimeout.current = setTimeout(() => onUpdatePhase({ notes: value }), 600);
  }

  function handleStatusChange(status: PhaseStatus) {
    onUpdatePhase({
      status,
      startedAt: status === 'in-progress' && !phase.startedAt ? new Date().toISOString() : phase.startedAt,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    });
  }

  function openCaptureForm(prompt?: Prompt) {
    const draft: CheckpointDraft = prompt
      ? {
          title: `${prompt.code} · ${prompt.title}`,
          content: prompt.body,
          promptId: prompt.id,
          promptTitle: `${prompt.code} ${prompt.title}`,
          tags: prompt.tags.join(', '),
        }
      : EMPTY_CHECKPOINT;
    setCheckpointDraft(draft);
    setShowCheckpointForm(true);
    // scroll to form
    setTimeout(() => {
      document.querySelector('.checkpoint-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleCheckpointSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkpointDraft.title.trim() && !checkpointDraft.content.trim()) return;
    onAddCheckpoint({
      title: checkpointDraft.title.trim() || 'Untitled checkpoint',
      content: checkpointDraft.content.trim(),
      promptId: checkpointDraft.promptId || undefined,
      promptTitle: checkpointDraft.promptTitle || undefined,
      tags: checkpointDraft.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setCheckpointDraft(EMPTY_CHECKPOINT);
    setShowCheckpointForm(false);
  }

  function handleDeliverableSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!deliverableDraft.title.trim() || !deliverableDraft.url.trim()) return;
    onAddDeliverable({
      title: deliverableDraft.title.trim(),
      type: deliverableDraft.type,
      url: deliverableDraft.url.trim(),
      description: deliverableDraft.description.trim() || undefined,
    });
    setDeliverableDraft(EMPTY_DELIVERABLE);
    setShowDeliverableForm(false);
  }

  function copyPrompt(prompt: Prompt) {
    navigator.clipboard.writeText(prompt.body).then(() => {
      setCopiedPromptId(prompt.id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    });
  }

  function startEditCheckpoint(c: Checkpoint) {
    setEditDraft({ title: c.title, content: c.content, promptId: c.promptId || '', promptTitle: c.promptTitle || '', tags: c.tags.join(', ') });
    setEditingCheckpointId(c.id);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCheckpointId) return;
    onUpdateCheckpoint(editingCheckpointId, {
      title: editDraft.title.trim() || 'Untitled checkpoint',
      content: editDraft.content.trim(),
      tags: editDraft.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setEditingCheckpointId(null);
  }

  // Which prompts have an associated captured checkpoint?
  const capturedPromptIds = new Set(phase.checkpoints.map(c => c.promptId).filter(Boolean) as string[]);
  const capturedCount = allPhasePrompts.filter(p => capturedPromptIds.has(p.id)).length;

  return (
    <div className="phase-view">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button className="breadcrumb-link" onClick={onBack}>← {project.name}</button>
      </div>

      {/* Phase header */}
      <div className="phase-view-header">
        <div className="phase-view-title-row">
          <div className="phase-view-badge" style={{ background: phaseColor.bg, color: phaseColor.text }}>
            {phase.code === 'U' ? 'U' : `0${phase.code}`} {phase.label}
          </div>
          <select
            className={`phase-status-select phase-status-select-${phase.status}`}
            value={phase.status}
            onChange={e => handleStatusChange(e.target.value as PhaseStatus)}
          >
            {PHASE_STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {allPhasePrompts.length > 0 && (
            <span className="phase-completion-badge">
              {capturedCount}/{allPhasePrompts.length} captured
            </span>
          )}
        </div>
        <p className="phase-view-description">{phase.description}</p>
      </div>

      {/* Two-column layout */}
      <div className="phase-columns">

        {/* ── Left: Process steps + Captured context ──────────────────── */}
        <div className="phase-main">

          {/* ── Process steps (prompt-based checkpoints) ── */}
          {allPhasePrompts.length > 0 && (
            <div className="process-steps-section">
              <div className="section-header">
                <h3 className="section-title">Process steps</h3>
                <span className="section-subtitle" style={{ marginBottom: 0 }}>
                  Capture AI output for each step as a checkpoint
                </span>
              </div>

              <div className="process-steps-list">
                {allPhasePrompts.map(prompt => {
                  const captured = phase.checkpoints.find(c => c.promptId === prompt.id);
                  const isExpanded = expandedPromptId === prompt.id;
                  return (
                    <div
                      key={prompt.id}
                      className={`process-step ${captured ? 'process-step-captured' : ''}`}
                    >
                      <div className="process-step-header">
                        <div className="process-step-left">
                          <span className="process-step-code">{prompt.code}</span>
                          <div className="process-step-info">
                            <span className="process-step-title">{prompt.title}</span>
                            <span className="process-step-desc">{prompt.description}</span>
                          </div>
                        </div>
                        <div className="process-step-actions">
                          {captured ? (
                            <span className="step-captured-badge">✓ Captured</span>
                          ) : (
                            <button
                              className="btn-capture"
                              onClick={() => openCaptureForm(prompt)}
                            >
                              Capture →
                            </button>
                          )}
                          <button
                            className="icon-btn"
                            title={isExpanded ? 'Hide prompt' : 'View prompt'}
                            onClick={() => setExpandedPromptId(id => id === prompt.id ? null : prompt.id)}
                          >
                            {isExpanded ? '▲' : '▼'}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="process-step-body">
                          <pre className="prompt-body-preview">{prompt.body}</pre>
                          <div className="prompt-card-actions">
                            <button onClick={() => copyPrompt(prompt)}>
                              {copiedPromptId === prompt.id ? '✓ Copied' : 'Copy prompt'}
                            </button>
                            <button className="btn-primary" onClick={() => openCaptureForm(prompt)}>
                              Capture output →
                            </button>
                          </div>
                        </div>
                      )}

                      {captured && (
                        <div className="process-step-captured-preview">
                          <span className="captured-date">{formatDateShort(captured.createdAt)}</span>
                          <span className="captured-title">{captured.title}</span>
                          <button
                            className="captured-expand-link"
                            onClick={() => setExpandedCheckpointId(id => id === captured.id ? null : captured.id)}
                          >
                            {expandedCheckpointId === captured.id ? 'Collapse' : 'View'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Checkpoint capture form ── */}
          {showCheckpointForm && (
            <form className="checkpoint-form" onSubmit={handleCheckpointSubmit}>
              <div className="checkpoint-form-header">
                <span className="form-title">
                  {checkpointDraft.promptTitle
                    ? `Capturing: ${checkpointDraft.promptTitle}`
                    : 'New checkpoint'}
                </span>
                {checkpointDraft.promptTitle && (
                  <button
                    type="button"
                    className="scaffold-clear"
                    onClick={() => setCheckpointDraft(EMPTY_CHECKPOINT)}
                  >
                    ✕ Clear scaffold
                  </button>
                )}
              </div>
              <div className="form-field">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Brief confirmed with stakeholders"
                  value={checkpointDraft.title}
                  onChange={e => setCheckpointDraft(d => ({ ...d, title: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label>
                  Content
                  {checkpointDraft.promptTitle && (
                    <span className="label-hint"> — edit the prompt below with your actual AI output</span>
                  )}
                </label>
                <textarea
                  className="checkpoint-textarea"
                  placeholder="Paste AI output, decisions, research findings, or any context to preserve..."
                  value={checkpointDraft.content}
                  onChange={e => setCheckpointDraft(d => ({ ...d, content: e.target.value }))}
                  rows={10}
                />
              </div>
              <div className="form-field">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. decision, risk, stakeholder"
                  value={checkpointDraft.tags}
                  onChange={e => setCheckpointDraft(d => ({ ...d, tags: e.target.value }))}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowCheckpointForm(false); setCheckpointDraft(EMPTY_CHECKPOINT); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save checkpoint
                </button>
              </div>
            </form>
          )}

          {/* ── Captured context ── */}
          <div className="captured-section">
            <div className="section-header">
              <h3 className="section-title">Captured context</h3>
              {!showCheckpointForm && (
                <button onClick={() => openCaptureForm()}>+ Add</button>
              )}
            </div>
            {allPhasePrompts.length === 0 && (
              <p className="section-subtitle">Free-form context notes for this phase.</p>
            )}

            {phase.checkpoints.length === 0 ? (
              <div className="empty-state-inline">
                No context captured yet. Use the process steps above to get started.
              </div>
            ) : (
              <div className="checkpoint-list">
                {phase.checkpoints.map(checkpoint =>
                  editingCheckpointId === checkpoint.id ? (
                    <form key={checkpoint.id} className="checkpoint-form checkpoint-edit-form" onSubmit={handleEditSubmit}>
                      <div className="form-field">
                        <label>Title</label>
                        <input type="text" value={editDraft.title} onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))} autoFocus />
                      </div>
                      <div className="form-field">
                        <label>Content</label>
                        <textarea className="checkpoint-textarea" value={editDraft.content} onChange={e => setEditDraft(d => ({ ...d, content: e.target.value }))} rows={8} />
                      </div>
                      <div className="form-field">
                        <label>Tags</label>
                        <input type="text" value={editDraft.tags} onChange={e => setEditDraft(d => ({ ...d, tags: e.target.value }))} />
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={() => setEditingCheckpointId(null)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save</button>
                      </div>
                    </form>
                  ) : (
                    <CheckpointCard
                      key={checkpoint.id}
                      checkpoint={checkpoint}
                      isExpanded={expandedCheckpointId === checkpoint.id}
                      onToggle={() => setExpandedCheckpointId(id => id === checkpoint.id ? null : checkpoint.id)}
                      onEdit={() => startEditCheckpoint(checkpoint)}
                      onDelete={() => { if (confirm('Delete this checkpoint?')) onDeleteCheckpoint(checkpoint.id); }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Deliverables + Notes ─────────────────────────────── */}
        <div className="phase-sidebar">

          {/* Deliverables */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">Deliverables</h3>
              <button onClick={() => setShowDeliverableForm(v => !v)}>
                {showDeliverableForm ? 'Cancel' : '+ Add'}
              </button>
            </div>
            <p className="section-subtitle">Link Figma files, docs, and other outputs.</p>

            {showDeliverableForm && (
              <form className="deliverable-form" onSubmit={handleDeliverableSubmit}>
                <div className="form-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Figma prototype v2"
                    value={deliverableDraft.title}
                    onChange={e => setDeliverableDraft(d => ({ ...d, title: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="form-field">
                  <label>Type</label>
                  <select value={deliverableDraft.type} onChange={e => setDeliverableDraft(d => ({ ...d, type: e.target.value as DeliverableType }))}>
                    {DELIVERABLE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>URL *</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={deliverableDraft.url}
                    onChange={e => setDeliverableDraft(d => ({ ...d, url: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Brief note"
                    value={deliverableDraft.description}
                    onChange={e => setDeliverableDraft(d => ({ ...d, description: e.target.value }))}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowDeliverableForm(false); setDeliverableDraft(EMPTY_DELIVERABLE); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={!deliverableDraft.title.trim() || !deliverableDraft.url.trim()}>
                    Add
                  </button>
                </div>
              </form>
            )}

            {phase.deliverables.length === 0 && !showDeliverableForm ? (
              <div className="empty-state-inline">No deliverables linked yet.</div>
            ) : (
              <div className="deliverable-list">
                {phase.deliverables.map(d => (
                  <DeliverableCard
                    key={d.id}
                    deliverable={d}
                    onDelete={() => { if (confirm('Remove this deliverable?')) onDeleteDeliverable(d.id); }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Phase notes */}
          <div className="sidebar-section">
            <h3 className="section-title">Phase notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Blockers, open questions, general context..."
              value={notesValue}
              onChange={e => handleNotesChange(e.target.value)}
              rows={6}
            />
            <p className="notes-hint">Auto-saved</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CheckpointCard({ checkpoint, isExpanded, onToggle, onEdit, onDelete }: {
  checkpoint: Checkpoint;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const preview = checkpoint.content.slice(0, 140) + (checkpoint.content.length > 140 ? '…' : '');

  return (
    <div className={`checkpoint-card ${isExpanded ? 'checkpoint-card-expanded' : ''}`}>
      <div className="checkpoint-card-header" onClick={onToggle} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        <div className="checkpoint-card-main">
          <div className="checkpoint-card-title">{checkpoint.title}</div>
          <div className="checkpoint-card-meta">
            <span className="checkpoint-date">{formatDateShort(checkpoint.createdAt)}</span>
            {checkpoint.promptTitle && (
              <span className="checkpoint-scaffold-badge">◈ {checkpoint.promptTitle}</span>
            )}
          </div>
          {checkpoint.tags.length > 0 && (
            <div className="tag-list" style={{ marginTop: 4 }}>
              {checkpoint.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
          {!isExpanded && checkpoint.content && (
            <p className="checkpoint-preview">{preview}</p>
          )}
        </div>
        <div className="checkpoint-card-actions" onClick={e => e.stopPropagation()}>
          <button className="icon-btn" title="Edit" onClick={onEdit}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2L12 4L5 11H3V9L10 2Z"/>
            </svg>
          </button>
          <button className="icon-btn icon-btn-danger" title="Delete" onClick={onDelete}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
            </svg>
          </button>
          <span className="checkpoint-toggle-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="checkpoint-content">
          <pre className="checkpoint-body">{checkpoint.content}</pre>
        </div>
      )}
    </div>
  );
}

function DeliverableCard({ deliverable, onDelete }: { deliverable: Deliverable; onDelete: () => void }) {
  const typeInfo = DELIVERABLE_TYPES.find(t => t.value === deliverable.type) || DELIVERABLE_TYPES[DELIVERABLE_TYPES.length - 1];
  return (
    <div className="deliverable-card">
      <div className="deliverable-icon" title={typeInfo.label}>{typeInfo.icon}</div>
      <div className="deliverable-info">
        <a className="deliverable-title" href={deliverable.url} target="_blank" rel="noopener noreferrer">
          {deliverable.title}
        </a>
        {deliverable.description && <p className="deliverable-description">{deliverable.description}</p>}
        <span className="deliverable-meta">{typeInfo.label} · {formatDateShort(deliverable.addedAt)}</span>
      </div>
      <button className="icon-btn icon-btn-danger" title="Remove" onClick={onDelete}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
        </svg>
      </button>
    </div>
  );
}
