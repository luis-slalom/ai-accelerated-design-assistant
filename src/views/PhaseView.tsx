import { useState, useRef, useEffect } from 'react';
import type { Phase, Checkpoint, Deliverable, DeliverableType, PhaseStatus, Prompt, Project, ActivityState, ActivityStatus, CustomActivity, EngagementEntry } from '../types';
import { PHASE_COLORS, ACTIVITY_DEFS, PHASE_DELIVERABLE_HINTS } from '../data';
import { formatDate, formatDateShort } from '../storage';
import { RichTextEditor } from '../components/RichTextEditor';
import { RichTextView } from '../components/RichTextView';
import { computeSuggestions, ROLE_LABELS } from '../alignment';

const PHASE_STATUS_OPTIONS: { value: PhaseStatus; label: string }[] = [
  { value: 'not-started', label: '○ Not started' },
  { value: 'in-progress', label: '◑ In progress' },
  { value: 'completed',   label: '● Completed' },
  { value: 'skipped',     label: '— Skipped' },
];

const DELIVERABLE_TYPES: { value: DeliverableType; label: string; icon: string }[] = [
  { value: 'figma',   label: 'Figma',     icon: '◈' },
  { value: 'doc',     label: 'Document',  icon: '☰' },
  { value: 'slides',  label: 'Slides',    icon: '▤' },
  { value: 'notion',  label: 'Notion',    icon: '◻' },
  { value: 'video',   label: 'Video',     icon: '▶' },
  { value: 'link',    label: 'Link',      icon: '⊞' },
  { value: 'other',   label: 'Other',     icon: '○' },
];

interface DeliverableDraft {
  mode: 'link' | 'upload';
  title: string;
  url: string;
  fileData: string;
  fileName: string;
  description: string;
}

const EMPTY_DELIVERABLE: DeliverableDraft = { mode: 'link', title: '', url: '', fileData: '', fileName: '', description: '' };

function typeFromUrl(url: string): DeliverableType {
  const u = url.toLowerCase();
  if (u.includes('figma.com')) return 'figma';
  if (u.includes('notion.so') || u.includes('notion.site')) return 'notion';
  if (u.includes('docs.google.com/presentation') || u.includes('slides.')) return 'slides';
  if (u.includes('docs.google.com') || u.includes('.doc') || u.includes('confluence')) return 'doc';
  if (u.includes('youtube.com') || u.includes('vimeo.com') || u.includes('loom.com')) return 'video';
  return 'link';
}

function typeFromFile(name: string): DeliverableType {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['mp4','mov','webm','avi'].includes(ext)) return 'video';
  if (['pdf','doc','docx','txt','md'].includes(ext)) return 'doc';
  if (['ppt','pptx','key'].includes(ext)) return 'slides';
  if (['fig'].includes(ext)) return 'figma';
  return 'other';
}

interface Props {
  project: Project;
  phase: Phase;
  prompts: Prompt[];
  onBack: () => void;
  onUpdatePhase: (changes: Partial<Phase>) => void;
  onUpdateActivity: (defId: string, changes: Partial<Omit<ActivityState, 'defId'>>) => void;
  onAddCheckpoint: (data: Omit<Checkpoint, 'id' | 'createdAt'>) => void;
  onDeleteCheckpoint: (id: string) => void;
  onAddDeliverable: (data: Omit<Deliverable, 'id' | 'addedAt'>) => void;
  onDeleteDeliverable: (id: string) => void;
  onAddCustomActivity: (data: Omit<CustomActivity, 'id' | 'createdAt'>) => void;
  onDeleteCustomActivity: (caId: string) => void;
  onLogAlignment: (ruleId: string, note: string) => void;
}

export function PhaseView({
  project, phase, prompts,
  onBack, onUpdatePhase, onUpdateActivity,
  onAddCheckpoint, onDeleteCheckpoint,
  onAddDeliverable, onDeleteDeliverable,
  onAddCustomActivity, onDeleteCustomActivity,
  onLogAlignment,
}: Props) {
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverableDraft, setDeliverableDraft] = useState<DeliverableDraft>(EMPTY_DELIVERABLE);
  const [notesValue, setNotesValue] = useState(phase.notes);
  const notesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUtility = phase.code === '00';
  const phaseSuggestions = computeSuggestions(project).filter(
    s => !s.phaseContext || s.phaseContext === phase.code
  );
  const phaseColor = PHASE_COLORS[phase.code];
  const phaseDefs = ACTIVITY_DEFS.filter(d => d.phaseCode === phase.code);
  const validatedCount = phase.activities.filter(a => a.status === 'validated').length;
  const totalValidatable = phaseDefs.length + (phase.customActivities?.length ?? 0);
  const allValidated = totalValidatable > 0 && validatedCount === totalValidatable;

  useEffect(() => { setNotesValue(phase.notes); }, [phase.id]);

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

  function handleDeliverableSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { mode, title, url, fileData, fileName, description } = deliverableDraft;
    if (!title.trim()) return;
    if (mode === 'link' && !url.trim()) return;
    if (mode === 'upload' && !fileData) return;
    onAddDeliverable({
      title: title.trim(),
      type: mode === 'upload' ? typeFromFile(fileName) : typeFromUrl(url),
      url: mode === 'link' ? url.trim() : undefined,
      fileData: mode === 'upload' ? fileData : undefined,
      fileName: mode === 'upload' ? fileName : undefined,
      description: description.trim() || undefined,
    });
    setDeliverableDraft(EMPTY_DELIVERABLE);
    setShowDeliverableForm(false);
  }

  // Utility phase: treat prompts as a reference library with checkpoint capture
  const utilityPrompts = isUtility ? prompts.filter(p => p.level === 'Utility') : [];

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
            {`0${phase.code}`} {phase.label}
          </div>
          <select
            className={`phase-status-select phase-status-select-${phase.status}`}
            value={phase.status}
            onChange={e => handleStatusChange(e.target.value as PhaseStatus)}
          >
            {PHASE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {totalValidatable > 0 && (
            <span className={`phase-completion-badge ${allValidated ? 'phase-completion-badge-done' : ''}`}>
              {allValidated ? '✓ All validated' : `${validatedCount}/${totalValidatable} validated`}
            </span>
          )}
        </div>
        <p className="phase-view-description">{phase.description}</p>
      </div>

      {/* All validated prompt */}
      {allValidated && (
        <div className="all-validated-banner">
          <span>✓ All activities validated.</span>
          {phase.status !== 'completed' && (
            <button className="btn-primary" style={{ fontSize: 12, padding: '4px 12px' }}
              onClick={() => handleStatusChange('completed')}>
              Mark phase complete
            </button>
          )}
        </div>
      )}

      {/* Two-column layout */}
      <div className="phase-columns">

        {/* ── Left: Activities ─────────────────────────────────────────── */}
        <div className="phase-main">
          {!isUtility && (
            <div className="activity-list">
              {phaseDefs.map(def => {
                const state = phase.activities.find(a => a.defId === def.id)
                  ?? { defId: def.id, status: 'empty' as ActivityStatus, content: '', informed: [] };
                const prompt = prompts.find(p => p.id === def.promptId);
                return (
                  <ActivityCard
                    key={def.id}
                    def={def}
                    state={state}
                    prompt={prompt}
                    onUpdate={(changes) => onUpdateActivity(def.id, changes)}
                  />
                );
              })}
              {(phase.customActivities ?? []).map(ca => {
                const state = phase.activities.find(a => a.defId === ca.id)
                  ?? { defId: ca.id, status: 'empty' as ActivityStatus, content: '', informed: [] };
                return (
                  <ActivityCard
                    key={ca.id}
                    def={{ id: ca.id, phaseCode: phase.code, code: '', title: ca.title, description: ca.description }}
                    state={state}
                    prompt={undefined}
                    onUpdate={(changes) => onUpdateActivity(ca.id, changes)}
                    onDelete={() => { if (confirm('Remove this activity?')) onDeleteCustomActivity(ca.id); }}
                  />
                );
              })}
              <AddActivityForm onAdd={onAddCustomActivity} />
            </div>
          )}

          {/* Utility: prompt library + checkpoints */}
          {isUtility && (
            <UtilityPanel
              prompts={utilityPrompts}
              checkpoints={phase.checkpoints}
              onAddCheckpoint={onAddCheckpoint}
              onDeleteCheckpoint={onDeleteCheckpoint}
            />
          )}
        </div>

        {/* ── Right: Sidebar ──────────────────────────────────────────── */}
        <div className="phase-sidebar">

          {/* Deliverables */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">Deliverables</h3>
              <button onClick={() => setShowDeliverableForm(v => !v)}>
                {showDeliverableForm ? 'Cancel' : '+ Add'}
              </button>
            </div>
            {/* Expected deliverables hint — simple chips */}
            {PHASE_DELIVERABLE_HINTS[phase.code]?.length > 0 && !showDeliverableForm && (
              <div className="deliverable-hints-chips">
                {PHASE_DELIVERABLE_HINTS[phase.code].map((hint, i) => {
                  const done = phase.deliverables.some(d =>
                    d.title.toLowerCase().includes(hint.toLowerCase().split(' ')[0])
                  );
                  return <span key={i} className={`deliverable-hint-chip ${done ? 'deliverable-hint-chip-done' : ''}`}>{hint}</span>;
                })}
              </div>
            )}

            {showDeliverableForm && (
              <DeliverableForm
                draft={deliverableDraft}
                onChange={setDeliverableDraft}
                onSubmit={handleDeliverableSubmit}
                onCancel={() => { setShowDeliverableForm(false); setDeliverableDraft(EMPTY_DELIVERABLE); }}
              />
            )}

            {phase.deliverables.length === 0 && !showDeliverableForm
              ? <div className="empty-state-inline">No deliverables linked yet.</div>
              : (
                <div className="deliverable-list">
                  {phase.deliverables.map(d => (
                    <DeliverableCard key={d.id} deliverable={d}
                      onDelete={() => { if (confirm('Remove this deliverable?')) onDeleteDeliverable(d.id); }} />
                  ))}
                </div>
              )}
          </div>

          {/* Phase notes */}
          <div className="sidebar-section">
            <h3 className="section-title">Phase notes</h3>
            <RichTextEditor
              content={notesValue}
              onChange={handleNotesChange}
              placeholder="Blockers, open questions, general context..."
            />
            <p className="notes-hint">Auto-saved</p>
          </div>

          {/* Alignment suggestions for this phase */}
          {phaseSuggestions.length > 0 && (
            <div className="sidebar-section">
              <h3 className="section-title">Alignment</h3>
              <div className="alignment-sidebar-list">
                {phaseSuggestions.map(s => (
                  <PhaseAlignmentCard key={s.ruleId} suggestion={s} onLog={onLogAlignment} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ENGAGEMENT_TEAMS: { key: string; label: string }[] = [
  { key: 'stakeholder', label: 'Stakeholders' },
  { key: 'delivery',    label: 'Delivery team' },
  { key: 'pm',          label: 'PM team' },
  { key: 'other',       label: 'Other' },
];

// ── Add custom activity form ──────────────────────────────────────────────────

function AddActivityForm({ onAdd }: { onAdd: (data: Omit<CustomActivity, 'id' | 'createdAt'>) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onAdd({ title: draft.title.trim(), description: draft.description.trim() });
    setDraft({ title: '', description: '' });
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-activity-btn" onClick={() => setOpen(true)}>
        + Add activity
      </button>
    );
  }

  return (
    <form className="add-activity-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Activity name"
        value={draft.title}
        onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
        autoFocus
      />
      <input
        type="text"
        placeholder="Short description (optional)"
        value={draft.description}
        onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
      />
      <div className="form-actions">
        <button type="button" onClick={() => { setOpen(false); setDraft({ title: '', description: '' }); }}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={!draft.title.trim()}>Add</button>
      </div>
    </form>
  );
}

// ── Engagement components ─────────────────────────────────────────────────────

function EngagementRow({ entries, onEngage, onDisengage, onSetDate }: {
  entries: EngagementEntry[];
  onEngage: (key: string) => void;
  onDisengage: (key: string) => void;
  onSetDate: (key: string, date: string | undefined) => void;
}) {
  return (
    <div className="engagement-row">
      <span className="engagement-label">Engaged with</span>
      <div className="engagement-chips">
        {ENGAGEMENT_TEAMS.map(team => {
          const entry = entries.find(e => e.key === team.key);
          return (
            <EngagementChip
              key={team.key}
              teamKey={team.key}
              label={team.label}
              entry={entry}
              onEngage={() => onEngage(team.key)}
              onDisengage={() => onDisengage(team.key)}
              onSetDate={(d) => onSetDate(team.key, d)}
            />
          );
        })}
      </div>
    </div>
  );
}

function EngagementChip({ teamKey, label, entry, onEngage, onDisengage, onSetDate }: {
  teamKey: string;
  label: string;
  entry: EngagementEntry | undefined;
  onEngage: () => void;
  onDisengage: () => void;
  onSetDate: (date: string | undefined) => void;
}) {
  const [editingDate, setEditingDate] = useState(false);
  const active = !!entry;

  // Format ISO → YYYY-MM-DD for <input type="date">
  function toDateValue(iso?: string) {
    if (!iso) return '';
    return iso.slice(0, 10);
  }

  if (!active) {
    return (
      <button
        type="button"
        className={`engagement-chip engagement-chip-${teamKey}`}
        onClick={onEngage}
        title={`Mark ${label} as engaged`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={`engagement-chip engagement-chip-${teamKey} engagement-chip-active`}>
      <span className="engagement-chip-name">✓ {label}</span>
      {editingDate ? (
        <input
          type="date"
          className="engagement-date-input"
          value={toDateValue(entry.engagedAt)}
          onChange={e => {
            onSetDate(e.target.value ? new Date(e.target.value + 'T12:00:00').toISOString() : undefined);
            setEditingDate(false);
          }}
          onBlur={() => setEditingDate(false)}
          autoFocus
        />
      ) : (
        <button
          type="button"
          className="engagement-chip-date"
          onClick={() => setEditingDate(true)}
          title="Edit date"
        >
          {entry.engagedAt ? formatDateShort(entry.engagedAt) : '+ date'}
        </button>
      )}
      <button
        type="button"
        className="engagement-chip-remove"
        onClick={onDisengage}
        title={`Remove ${label}`}
      >×</button>
    </div>
  );
}

// ── Alignment card (sidebar variant) ─────────────────────────────────────────

function PhaseAlignmentCard({ suggestion, onLog }: {
  suggestion: import('../alignment').AlignmentSuggestion;
  onLog: (ruleId: string, note: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className={`alignment-sidebar-card ${suggestion.isNonNegotiable ? 'alignment-sidebar-card-required' : ''}`}>
      <div className="alignment-sidebar-label">
        {suggestion.isNonNegotiable ? '⚠ Required' : '↗ Consider'}
      </div>
      <div className="alignment-sidebar-title">{suggestion.title}</div>
      <p className="alignment-sidebar-message">{suggestion.message}</p>
      {suggestion.involvedMembers.length > 0 && (
        <div className="alignment-members" style={{ marginTop: 6 }}>
          {suggestion.involvedMembers.map(m => (
            <span key={m.id} className={`role-chip role-chip-${m.role}`}>{m.name} · {ROLE_LABELS[m.role]}</span>
          ))}
        </div>
      )}
      {confirming ? (
        <div className="alignment-confirm-form">
          <input
            type="text"
            className="alignment-note-input"
            placeholder="What was agreed? (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            autoFocus
          />
          <div className="form-actions" style={{ marginTop: 6 }}>
            <button type="button" onClick={() => { setConfirming(false); setNote(''); }}>Cancel</button>
            <button type="button" className="btn-primary" onClick={() => {
              onLog(suggestion.ruleId, note.trim());
              setConfirming(false);
              setNote('');
            }}>Confirm</button>
          </div>
        </div>
      ) : (
        <button className="alignment-mark-btn" style={{ marginTop: 8 }} onClick={() => setConfirming(true)}>
          Mark as aligned →
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  ACTIVITY CARD
// ═══════════════════════════════════════════════════════════════════════════

type ActivityDefLike = { id: string; phaseCode: string; code: string; title: string; description: string; promptId?: string };

function ActivityCard({ def, state, prompt, onUpdate, onDelete }: {
  def: ActivityDefLike;
  state: ActivityState;
  prompt: Prompt | undefined;
  onUpdate: (changes: Partial<Omit<ActivityState, 'defId'>>) => void;
  onDelete?: () => void;
}) {
  function engage(key: string) {
    const current = state.informed ?? [];
    if (current.some(e => e.key === key)) return;
    onUpdate({ informed: [...current, { key, engagedAt: new Date().toISOString() }] });
  }

  function disengage(key: string) {
    onUpdate({ informed: (state.informed ?? []).filter(e => e.key !== key) });
  }

  function setEngagementDate(key: string, date: string | undefined) {
    onUpdate({
      informed: (state.informed ?? []).map(e =>
        e.key === key ? { ...e, engagedAt: date } : e
      ),
    });
  }
  const [isExpanded, setIsExpanded] = useState(state.status === 'empty' || state.status === 'in-progress');
  const [activeTab, setActiveTab] = useState<'write' | 'generate'>('write');
  const [draft, setDraft] = useState(state.content);
  const [isEditing, setIsEditing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const [showPromptBody, setShowPromptBody] = useState(false);
  const [generateOutput, setGenerateOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showValidateConfirm, setShowValidateConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync if parent updates (e.g. after save)
  useEffect(() => { setDraft(state.content); }, [state.content]);

  function startEdit() {
    setDraft(state.content);
    setIsEditing(true);
    setIsExpanded(true);
  }

  function cancelEdit() {
    setDraft(state.content);
    setIsEditing(false);
    setGenerateOutput('');
    setAttachedFile(null);
  }

  function saveContent(content: string, source: 'manual' | 'generated') {
    if (!content.trim()) return;
    onUpdate({ content: content.trim(), status: 'in-progress', source });
    setIsEditing(false);
    setGenerateOutput('');
    setAttachedFile(null);
  }

  function handleValidate() {
    onUpdate({ status: 'validated', validatedAt: new Date().toISOString() });
    setShowValidateConfirm(false);
    // keep expanded so user sees the validated result immediately
  }

  function handleUnvalidate() {
    onUpdate({ status: 'in-progress', validatedAt: undefined });
    setIsExpanded(true);
  }

  function handleFileAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAttachedFile({ name: file.name, content: ev.target?.result as string });
    reader.readAsText(file);
    // reset input so same file can be re-attached
    e.target.value = '';
  }

  function assemblePrompt(): string {
    const parts: string[] = [];
    if (attachedFile) {
      parts.push(`## Context from: ${attachedFile.name}\n\n${attachedFile.content}\n\n---`);
    }
    if (prompt?.body) parts.push(prompt.body);
    return parts.join('\n\n');
  }

  function copyPrompt() {
    const text = assemblePrompt();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const statusIcon = state.status === 'validated' ? '●' : state.status === 'in-progress' ? '◑' : '○';

  return (
    <div className={`activity-card activity-card-${state.status}`}>

      {/* ── Card header (always visible) ── */}
      <div
        className="activity-header"
        onClick={() => { if (!isEditing) setIsExpanded(v => !v); }}
        role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' && !isEditing) setIsExpanded(v => !v); }}
      >
        <div className="activity-header-left">
          <span className={`activity-status-icon activity-status-icon-${state.status}`}>{statusIcon}</span>
          <span className="activity-code">{def.code}</span>
          <div className="activity-title-group">
            <span className="activity-title">{def.title}</span>
            {!isExpanded && (
              <span className="activity-description">
                {state.status === 'validated'
                  ? `✓ Validated ${state.validatedAt ? formatDateShort(state.validatedAt) : ''}`
                  : def.description}
              </span>
            )}
          </div>
        </div>
        <div className="activity-header-right" onClick={e => e.stopPropagation()}>
          {state.status === 'validated' && (
            <button className="activity-unvalidate-btn" onClick={handleUnvalidate} title="Remove validation">
              Reopen
            </button>
          )}
          {!isEditing && state.content && (
            <button className="activity-edit-btn" onClick={startEdit}>Edit</button>
          )}
          {state.status === 'empty' && !isEditing && (
            <button className="btn-primary" style={{ fontSize: 12, padding: '6px 16px', fontWeight: 600 }}
              onClick={() => { setIsEditing(true); setIsExpanded(true); }}>
              Get started
            </button>
          )}
          {onDelete && (
            <button className="activity-delete-btn" onClick={onDelete} title="Remove activity">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
              </svg>
            </button>
          )}
          <span className="activity-chevron">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* ── Expanded body ── */}
      {isExpanded && (
        <div className="activity-body">
          {/* Description when expanded */}
          <p className="activity-description-expanded">{def.description}</p>

          {/* ── Read-only content (not editing, has content) ── */}
          {!isEditing && state.content && (
            <div className="activity-content-view">
              <RichTextView html={state.content} className="activity-content-text" />
              <div className="activity-provenance">
                <div className="provenance-row">
                  <span className="provenance-label">Source</span>
                  <span className="provenance-value">
                    {state.source === 'generated' ? '◈ Generated with AI' : state.source === 'manual' ? '✏ Written manually' : '—'}
                  </span>
                </div>
                {prompt && (
                  <div className="provenance-row">
                    <span className="provenance-label">Prompt scaffold</span>
                    <span className="provenance-value provenance-prompt">
                      <span className="provenance-prompt-code">{prompt.code}</span>
                      {prompt.title}
                    </span>
                  </div>
                )}
                {state.updatedAt && (
                  <div className="provenance-row">
                    <span className="provenance-label">Last updated</span>
                    <span className="provenance-value">{formatDate(state.updatedAt)}</span>
                  </div>
                )}
                {state.status === 'validated' && state.validatedAt && (
                  <div className="provenance-row provenance-row-validated">
                    <span className="provenance-label">Validated</span>
                    <span className="provenance-value">✓ {formatDate(state.validatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Edit mode ── */}
          {isEditing && (
            <div className="activity-edit-mode">
              {/* Tabs */}
              <div className="activity-tabs">
                <button
                  className={`activity-tab ${activeTab === 'write' ? 'activity-tab-active' : ''}`}
                  onClick={() => setActiveTab('write')}>
                  ✏ Write
                </button>
                <button
                  className={`activity-tab ${activeTab === 'generate' ? 'activity-tab-active' : ''}`}
                  onClick={() => setActiveTab('generate')}>
                  ◈ Generate with AI
                </button>
              </div>

              {/* Write tab */}
              {activeTab === 'write' && (
                <div className="activity-write-tab">
                  <RichTextEditor
                    content={draft}
                    onChange={setDraft}
                    placeholder={`Paste or write your ${def.title.toLowerCase()} here…`}
                  />
                  <div className="form-actions">
                    <button type="button" onClick={cancelEdit}>Cancel</button>
                    <button type="button" className="btn-primary"
                      onClick={() => saveContent(draft, 'manual')}
                      disabled={!draft.trim()}>
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Generate tab */}
              {activeTab === 'generate' && (
                <div className="activity-generate-tab">

                  {/* Prompt inspection */}
                  {prompt ? (
                    <div className="generate-prompt-section">
                      <div className="generate-prompt-header">
                        <div>
                          <span className="generate-prompt-label">Prompt scaffold</span>
                          <span className="generate-prompt-code">{prompt.code} · {prompt.title}</span>
                        </div>
                        <button
                          className="generate-inspect-toggle"
                          onClick={() => setShowPromptBody(v => !v)}
                        >
                          {showPromptBody ? 'Hide prompt ▲' : 'Inspect prompt ▼'}
                        </button>
                      </div>
                      {showPromptBody && (
                        <pre className="generate-prompt-body">{prompt.body}</pre>
                      )}
                    </div>
                  ) : (
                    <p className="generate-no-prompt">No prompt scaffold defined for this activity.</p>
                  )}

                  {/* File attachment */}
                  <div className="generate-file-section">
                    <span className="generate-file-label">Attach context file <span className="label-hint">(optional — .txt, .md, .csv, .json)</span></span>
                    {attachedFile ? (
                      <div className="generate-file-attached">
                        <span className="generate-file-name">📎 {attachedFile.name}</span>
                        <button className="scaffold-clear" onClick={() => { setAttachedFile(null); }}>✕ Remove</button>
                      </div>
                    ) : (
                      <button className="generate-file-btn" onClick={() => fileInputRef.current?.click()}>
                        📎 Choose file
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.csv,.json,.xml,.yaml,.yml"
                      style={{ display: 'none' }}
                      onChange={handleFileAttach}
                    />
                  </div>

                  {/* Copy assembled prompt */}
                  {prompt && (
                    <div className="generate-copy-section">
                      <button className={`generate-copy-btn ${copied ? 'generate-copy-btn-done' : ''}`} onClick={copyPrompt}>
                        {copied ? '✓ Copied! Paste into Claude or ChatGPT →' : '📋 Copy assembled prompt to clipboard'}
                      </button>
                      {attachedFile && !copied && (
                        <p className="generate-copy-hint">Includes your attached file as context.</p>
                      )}
                    </div>
                  )}

                  {/* Paste AI output */}
                  <div className="generate-output-section">
                    <label className="generate-output-label">Paste AI output here</label>
                    <RichTextEditor
                      content={generateOutput}
                      onChange={setGenerateOutput}
                      placeholder="Run the prompt above in your AI tool, then paste the response here…"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={cancelEdit}>Cancel</button>
                    <button type="button" className="btn-primary"
                      onClick={() => saveContent(generateOutput, 'generated')}
                      disabled={!generateOutput.trim()}>
                      Save AI output
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Empty state (no content yet, not editing) ── */}
          {!isEditing && !state.content && (
            <div className="activity-empty-state">
              <p>No content yet.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => { setActiveTab('write'); setIsEditing(true); }}>✏ Write</button>
                <button onClick={() => { setActiveTab('generate'); setIsEditing(true); }}>◈ Generate with AI</button>
              </div>
            </div>
          )}

          {/* ── Engaged with ── */}
          {!isEditing && (
            <EngagementRow
              entries={state.informed ?? []}
              onEngage={engage}
              onDisengage={disengage}
              onSetDate={setEngagementDate}
            />
          )}

          {/* ── Human validation ── */}
          {!isEditing && state.status !== 'validated' && state.content && (
            <div className="activity-validate-section">
              {showValidateConfirm ? (
                <div className="validate-confirm">
                  <span>Review complete?</span>
                  <button className="btn-validate" onClick={handleValidate}>✓ Yes, mark as validated</button>
                  <button onClick={() => setShowValidateConfirm(false)}>Cancel</button>
                </div>
              ) : (
                <button className="btn-validate-trigger" onClick={() => setShowValidateConfirm(true)}>
                  Human review — mark as validated ✓
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  UTILITY PANEL (prompt library + checkpoints)
// ═══════════════════════════════════════════════════════════════════════════

function UtilityPanel({ prompts, checkpoints, onAddCheckpoint, onDeleteCheckpoint }: {
  prompts: Prompt[];
  checkpoints: Checkpoint[];
  onAddCheckpoint: (data: Omit<Checkpoint, 'id' | 'createdAt'>) => void;
  onDeleteCheckpoint: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', tags: '', promptId: '', promptTitle: '' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAddCheckpoint({
      title: draft.title.trim() || 'Utility note',
      content: draft.content.trim(),
      promptId: draft.promptId || undefined,
      promptTitle: draft.promptTitle || undefined,
      tags: draft.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setDraft({ title: '', content: '', tags: '', promptId: '', promptTitle: '' });
    setShowForm(false);
  }

  function copyPrompt(p: Prompt) {
    navigator.clipboard.writeText(p.body).then(() => {
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div>
      {/* Prompt library */}
      <div className="section-header" style={{ marginBottom: 12 }}>
        <h3 className="section-title">Utility prompts</h3>
      </div>
      <p className="section-subtitle">Reference prompts for research synthesis, decisions, risks, and retrospectives.</p>

      <div className="utility-prompt-list">
        {prompts.map(p => (
          <div key={p.id} className="utility-prompt-card">
            <div className="utility-prompt-header"
              onClick={() => setExpandedId(id => id === p.id ? null : p.id)}
              role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpandedId(id => id === p.id ? null : p.id)}>
              <div>
                <span className="prompt-code">{p.code}</span>
                <span className="prompt-title">{p.title}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{expandedId === p.id ? '▲' : '▼'}</span>
            </div>
            {expandedId !== p.id && <p className="prompt-desc">{p.description}</p>}
            {expandedId === p.id && <pre className="prompt-body-preview">{p.body}</pre>}
            <div className="prompt-card-actions">
              <button onClick={() => {
                setDraft(d => ({ ...d, promptId: p.id, promptTitle: `${p.code} ${p.title}`, content: d.content || p.body }));
                setShowForm(true);
              }}>Use as scaffold</button>
              <button onClick={() => copyPrompt(p)}>{copiedId === p.id ? '✓ Copied' : 'Copy'}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Notes / checkpoints */}
      <div style={{ marginTop: '1.75rem' }}>
        <div className="section-header">
          <h3 className="section-title">Notes</h3>
          <button onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Add note'}</button>
        </div>

        {showForm && (
          <form className="checkpoint-form" onSubmit={handleSubmit} style={{ marginTop: 10 }}>
            {draft.promptTitle && (
              <div className="scaffold-section">
                <span className="scaffold-toggle">Scaffold: {draft.promptTitle}</span>
                <button type="button" className="scaffold-clear"
                  onClick={() => setDraft(d => ({ ...d, promptId: '', promptTitle: '' }))}>✕ Clear</button>
              </div>
            )}
            <div className="form-field">
              <label>Title</label>
              <input type="text" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Research synthesis — June sprint" autoFocus />
            </div>
            <div className="form-field">
              <label>Content</label>
              <RichTextEditor
                content={draft.content}
                onChange={html => setDraft(d => ({ ...d, content: html }))}
                placeholder="Paste output, decisions, or research findings…"
              />
            </div>
            <div className="form-field">
              <label>Tags</label>
              <input type="text" value={draft.tags} onChange={e => setDraft(d => ({ ...d, tags: e.target.value }))}
                placeholder="decision, risk, research" />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => { setShowForm(false); setDraft({ title: '', content: '', tags: '', promptId: '', promptTitle: '' }); }}>Cancel</button>
              <button type="submit" className="btn-primary">Save note</button>
            </div>
          </form>
        )}

        {checkpoints.length === 0 && !showForm && (
          <div className="empty-state-inline">No notes yet.</div>
        )}

        <div className="checkpoint-list" style={{ marginTop: 8 }}>
          {checkpoints.map(c => (
            <div key={c.id} className="checkpoint-card">
              <div className="checkpoint-card-header"
                onClick={() => setExpandedId(id => id === c.id ? null : c.id)}
                role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpandedId(id => id === c.id ? null : c.id)}>
                <div className="checkpoint-card-main">
                  <div className="checkpoint-card-title">{c.title}</div>
                  <div className="checkpoint-card-meta">
                    <span className="checkpoint-date">{formatDateShort(c.createdAt)}</span>
                    {c.promptTitle && <span className="checkpoint-scaffold-badge">◈ {c.promptTitle}</span>}
                  </div>
                  {c.tags.length > 0 && (
                    <div className="tag-list" style={{ marginTop: 4 }}>
                      {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="checkpoint-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="icon-btn icon-btn-danger" onClick={() => { if (confirm('Delete this note?')) onDeleteCheckpoint(c.id); }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
                    </svg>
                  </button>
                  <span className="checkpoint-toggle-icon">{expandedId === c.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === c.id && (
                <div className="checkpoint-content">
                  <RichTextView html={c.content} className="checkpoint-body" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  DELIVERABLE FORM
// ═══════════════════════════════════════════════════════════════════════════

function DeliverableForm({ draft, onChange, onSubmit, onCancel }: {
  draft: DeliverableDraft;
  onChange: (d: DeliverableDraft) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isLink = draft.mode === 'link';
  const canSubmit = draft.title.trim() && (isLink ? !!draft.url.trim() : !!draft.fileData);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target?.result as string;
      onChange({
        ...draft,
        fileName: file.name,
        fileData: data,
        title: draft.title || file.name.replace(/\.[^.]+$/, ''),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <form className="deliverable-form" onSubmit={onSubmit}>
      {/* Mode toggle */}
      <div className="deliverable-mode-toggle">
        <button
          type="button"
          className={`deliverable-mode-btn ${isLink ? 'active' : ''}`}
          onClick={() => onChange({ ...draft, mode: 'link' })}
        >⊞ Link</button>
        <button
          type="button"
          className={`deliverable-mode-btn ${!isLink ? 'active' : ''}`}
          onClick={() => onChange({ ...draft, mode: 'upload' })}
        >↑ Upload</button>
      </div>

      <div className="form-field">
        <label>Title *</label>
        <input
          type="text"
          placeholder="e.g. Figma prototype v2"
          value={draft.title}
          onChange={e => onChange({ ...draft, title: e.target.value })}
          autoFocus
        />
      </div>

      {isLink ? (
        <div className="form-field">
          <label>URL *</label>
          <input
            type="url"
            placeholder="https://..."
            value={draft.url}
            onChange={e => onChange({ ...draft, url: e.target.value })}
          />
        </div>
      ) : (
        <div className="form-field">
          <label>File *</label>
          {draft.fileData ? (
            <div className="deliverable-file-chosen">
              <span className="deliverable-file-name">📎 {draft.fileName}</span>
              <button type="button" className="scaffold-clear" onClick={() => onChange({ ...draft, fileData: '', fileName: '' })}>✕</button>
            </div>
          ) : (
            <>
              <button type="button" className="deliverable-upload-btn" onClick={() => fileRef.current?.click()}>
                Choose file
              </button>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} />
            </>
          )}
        </div>
      )}

      <div className="form-field">
        <label>Description (optional)</label>
        <RichTextEditor
          content={draft.description}
          onChange={html => onChange({ ...draft, description: html })}
          placeholder="Brief note"
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={!canSubmit}>Add</button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  DELIVERABLE CARD
// ═══════════════════════════════════════════════════════════════════════════

function DeliverableCard({ deliverable, onDelete }: { deliverable: Deliverable; onDelete: () => void }) {
  const typeInfo = DELIVERABLE_TYPES.find(t => t.value === deliverable.type) ?? DELIVERABLE_TYPES[DELIVERABLE_TYPES.length - 1];
  const isFile = !!deliverable.fileData;

  return (
    <div className="deliverable-card">
      <div className="deliverable-icon">{typeInfo.icon}</div>
      <div className="deliverable-info">
        {isFile ? (
          <a
            className="deliverable-title"
            href={deliverable.fileData}
            download={deliverable.fileName}
          >
            {deliverable.title}
          </a>
        ) : (
          <a className="deliverable-title" href={deliverable.url} target="_blank" rel="noopener noreferrer">
            {deliverable.title}
          </a>
        )}
        {deliverable.description && <RichTextView html={deliverable.description} className="deliverable-description" />}
        <span className="deliverable-meta">
          {isFile ? `File · ${deliverable.fileName}` : typeInfo.label} · {formatDateShort(deliverable.addedAt)}
        </span>
      </div>
      <button className="icon-btn icon-btn-danger" title="Remove" onClick={onDelete}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
        </svg>
      </button>
    </div>
  );
}
