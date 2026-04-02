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
  const [showPromptPicker, setShowPromptPicker] = useState(false);
  const [expandedCheckpointId, setExpandedCheckpointId] = useState<string | null>(null);
  const [editingCheckpointId, setEditingCheckpointId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CheckpointDraft>(EMPTY_CHECKPOINT);
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverableDraft, setDeliverableDraft] = useState<DeliverableDraft>(EMPTY_DELIVERABLE);
  const [notesValue, setNotesValue] = useState(phase.notes);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const notesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phaseColor = PHASE_COLORS[phase.code];
  const phaseLevel = phase.code === 'U' ? 'Utility' : `0${phase.code} ${phase.label}`;
  const phasePrompts = prompts.filter(p => p.level === phaseLevel);

  // Sync notes to state when phase changes
  useEffect(() => {
    setNotesValue(phase.notes);
  }, [phase.id]);

  function handleNotesChange(value: string) {
    setNotesValue(value);
    if (notesTimeout.current) clearTimeout(notesTimeout.current);
    notesTimeout.current = setTimeout(() => {
      onUpdatePhase({ notes: value });
    }, 600);
  }

  function handleStatusChange(status: PhaseStatus) {
    onUpdatePhase({
      status,
      startedAt: status === 'in-progress' && !phase.startedAt ? new Date().toISOString() : phase.startedAt,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    });
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
    setShowPromptPicker(false);
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

  function usePromptAsScaffold(prompt: Prompt) {
    setCheckpointDraft(d => ({
      ...d,
      promptId: prompt.id,
      promptTitle: `${prompt.code} ${prompt.title}`,
      content: d.content ? d.content : prompt.body,
    }));
    setShowPromptPicker(false);
    if (!showCheckpointForm) setShowCheckpointForm(true);
  }

  function copyPromptToClipboard(prompt: Prompt) {
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

  return (
    <div className="phase-view">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button className="breadcrumb-link" onClick={onBack}>
          ← {project.name}
        </button>
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
        </div>
        <p className="phase-view-description">{phase.description}</p>
      </div>

      {/* Two-column layout */}
      <div className="phase-columns">

        {/* ── Left: Checkpoints ───────────────────────────────────────────── */}
        <div className="phase-main">
          <div className="section-header">
            <h3 className="section-title">Context checkpoints</h3>
            <button
              className="btn-primary"
              onClick={() => { setShowCheckpointForm(v => !v); setShowPromptPicker(false); }}
            >
              {showCheckpointForm ? 'Cancel' : '+ Add checkpoint'}
            </button>
          </div>
          <p className="section-subtitle">
            Capture decisions, insights, and AI-generated outputs as reference points.
          </p>

          {/* Checkpoint form */}
          {showCheckpointForm && (
            <form className="checkpoint-form" onSubmit={handleCheckpointSubmit}>
              {/* Prompt scaffold picker */}
              <div className="scaffold-section">
                <button
                  type="button"
                  className="scaffold-toggle"
                  onClick={() => setShowPromptPicker(v => !v)}
                >
                  {checkpointDraft.promptTitle
                    ? `Scaffold: ${checkpointDraft.promptTitle}`
                    : '◈ Use a prompt as scaffold (optional)'}
                </button>
                {checkpointDraft.promptTitle && (
                  <button type="button" className="scaffold-clear" onClick={() => setCheckpointDraft(d => ({ ...d, promptId: '', promptTitle: '' }))}>
                    ✕ Clear
                  </button>
                )}
              </div>

              {showPromptPicker && (
                <div className="prompt-picker">
                  <p className="prompt-picker-hint">
                    Select a prompt — its body will pre-fill the content below.
                  </p>
                  {phasePrompts.length === 0 ? (
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>No prompts for this phase.</p>
                  ) : (
                    phasePrompts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`prompt-picker-item ${checkpointDraft.promptId === p.id ? 'prompt-picker-item-active' : ''}`}
                        onClick={() => usePromptAsScaffold(p)}
                      >
                        <span className="prompt-picker-code">{p.code}</span>
                        <span className="prompt-picker-title">{p.title}</span>
                        <span className="prompt-picker-desc">{p.description}</span>
                      </button>
                    ))
                  )}
                  {/* Show utility prompts too */}
                  {phase.code !== 'U' && (
                    <>
                      <p className="prompt-picker-group-label">Utility prompts</p>
                      {prompts.filter(p => p.level === 'Utility').map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className={`prompt-picker-item ${checkpointDraft.promptId === p.id ? 'prompt-picker-item-active' : ''}`}
                          onClick={() => usePromptAsScaffold(p)}
                        >
                          <span className="prompt-picker-code">{p.code}</span>
                          <span className="prompt-picker-title">{p.title}</span>
                          <span className="prompt-picker-desc">{p.description}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}

              <div className="form-field">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Project brief confirmed with stakeholders"
                  value={checkpointDraft.title}
                  onChange={e => setCheckpointDraft(d => ({ ...d, title: e.target.value }))}
                  autoFocus={!showPromptPicker}
                />
              </div>
              <div className="form-field">
                <label>Content</label>
                <textarea
                  className="checkpoint-textarea"
                  placeholder="Paste AI output, key decisions, research findings, or any context worth preserving..."
                  value={checkpointDraft.content}
                  onChange={e => setCheckpointDraft(d => ({ ...d, content: e.target.value }))}
                  rows={8}
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
                <button type="button" onClick={() => { setShowCheckpointForm(false); setCheckpointDraft(EMPTY_CHECKPOINT); setShowPromptPicker(false); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save checkpoint
                </button>
              </div>
            </form>
          )}

          {/* Checkpoint list */}
          {phase.checkpoints.length === 0 && !showCheckpointForm && (
            <div className="empty-state-inline">
              No checkpoints yet. Add one to start building your project memory.
            </div>
          )}

          <div className="checkpoint-list">
            {phase.checkpoints.map(checkpoint => (
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
                  onDelete={() => {
                    if (confirm('Delete this checkpoint?')) onDeleteCheckpoint(checkpoint.id);
                  }}
                />
              )
            ))}
          </div>
        </div>

        {/* ── Right: Deliverables + Prompt Library ─────────────────────────── */}
        <div className="phase-sidebar">

          {/* Deliverables */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">Deliverables</h3>
              <button onClick={() => setShowDeliverableForm(v => !v)}>
                {showDeliverableForm ? 'Cancel' : '+ Add'}
              </button>
            </div>

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
                    placeholder="Brief note about this deliverable"
                    value={deliverableDraft.description}
                    onChange={e => setDeliverableDraft(d => ({ ...d, description: e.target.value }))}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowDeliverableForm(false); setDeliverableDraft(EMPTY_DELIVERABLE); }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={!deliverableDraft.title.trim() || !deliverableDraft.url.trim()}>
                    Add deliverable
                  </button>
                </div>
              </form>
            )}

            {phase.deliverables.length === 0 && !showDeliverableForm ? (
              <div className="empty-state-inline">Link Figma files, docs, and other outputs here.</div>
            ) : (
              <div className="deliverable-list">
                {phase.deliverables.map(d => (
                  <DeliverableCard
                    key={d.id}
                    deliverable={d}
                    onDelete={() => {
                      if (confirm('Remove this deliverable?')) onDeleteDeliverable(d.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Prompt library for this phase */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">Prompt scaffolding</h3>
              <button onClick={() => setShowPromptLibrary(v => !v)}>
                {showPromptLibrary ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="section-subtitle">Prompts for this phase. Use as scaffold when adding checkpoints.</p>

            {showPromptLibrary && (
              <div className="prompt-library-list">
                {phasePrompts.length === 0 ? (
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>No prompts for this phase.</p>
                ) : (
                  phasePrompts.map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      isCopied={copiedPromptId === prompt.id}
                      onCopy={() => copyPromptToClipboard(prompt)}
                      onUseAsScaffold={() => {
                        usePromptAsScaffold(prompt);
                        setShowCheckpointForm(true);
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Phase notes */}
          <div className="sidebar-section">
            <h3 className="section-title">Phase notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="General notes for this phase — context, blockers, open questions..."
              value={notesValue}
              onChange={e => handleNotesChange(e.target.value)}
              rows={5}
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
  const preview = checkpoint.content.slice(0, 120) + (checkpoint.content.length > 120 ? '…' : '');

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
        {deliverable.description && (
          <p className="deliverable-description">{deliverable.description}</p>
        )}
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

function PromptCard({ prompt, isCopied, onCopy, onUseAsScaffold }: {
  prompt: Prompt;
  isCopied: boolean;
  onCopy: () => void;
  onUseAsScaffold: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="prompt-library-card">
      <div className="prompt-library-card-header" onClick={() => setExpanded(v => !v)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}>
        <div>
          <span className="prompt-code">{prompt.code}</span>
          <span className="prompt-title">{prompt.title}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {!expanded && <p className="prompt-desc">{prompt.description}</p>}
      {expanded && (
        <pre className="prompt-body-preview">{prompt.body}</pre>
      )}
      <div className="prompt-card-actions" onClick={e => e.stopPropagation()}>
        <button onClick={onUseAsScaffold}>Use as scaffold</button>
        <button onClick={onCopy}>{isCopied ? '✓ Copied' : 'Copy prompt'}</button>
      </div>
    </div>
  );
}
