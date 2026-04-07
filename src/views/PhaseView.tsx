import { useState, useRef, useEffect } from 'react';
import type { Phase, Checkpoint, Deliverable, DeliverableType, PhaseStatus, Prompt, Project, ActivityState, ActivityStatus, Task } from '../types';
import type { ActivityDef } from '../data';
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
  title: string;
  type: DeliverableType;
  url: string;
  description: string;
}

const EMPTY_DELIVERABLE: DeliverableDraft = { title: '', type: 'link', url: '', description: '' };

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
  onAddTask: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (taskId: string) => void;
  onLogAlignment: (ruleId: string, note: string) => void;
}

export function PhaseView({
  project, phase, prompts,
  onBack, onUpdatePhase, onUpdateActivity,
  onAddCheckpoint, onDeleteCheckpoint,
  onAddDeliverable, onDeleteDeliverable,
  onAddTask, onUpdateTask, onDeleteTask,
  onLogAlignment,
}: Props) {
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverableDraft, setDeliverableDraft] = useState<DeliverableDraft>(EMPTY_DELIVERABLE);
  const [notesValue, setNotesValue] = useState(phase.notes);
  const notesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUtility = phase.code === 'U';
  const phaseSuggestions = computeSuggestions(project).filter(
    s => !s.phaseContext || s.phaseContext === phase.code
  );
  const phaseColor = PHASE_COLORS[phase.code];
  const phaseDefs = ACTIVITY_DEFS.filter(d => d.phaseCode === phase.code);
  const validatedActivities = phase.activities.filter(a => a.status === 'validated').length;
  const validatedTasks = phase.tasks.filter(t => !!t.validatedAt).length;
  const totalTasks = phase.tasks.length;
  const validatedCount = validatedActivities + validatedTasks;
  const totalValidatable = phaseDefs.length + totalTasks;
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
            {phase.code === 'U' ? 'U' : `0${phase.code}`} {phase.label}
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
          {!isUtility && phaseDefs.length > 0 && (
            <div className="activity-list">
              {phaseDefs.map(def => {
                const state = phase.activities.find(a => a.defId === def.id)
                  ?? { defId: def.id, status: 'empty' as ActivityStatus, content: '' };
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
            </div>
          )}

          {/* Custom tasks */}
          <TasksSection
            tasks={phase.tasks}
            onAdd={onAddTask}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onMarkPhaseComplete={allValidated && phase.status !== 'completed'
              ? () => handleStatusChange('completed')
              : undefined}
          />

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
            {/* Expected deliverables hint */}
            {PHASE_DELIVERABLE_HINTS[phase.code]?.length > 0 && phase.deliverables.length === 0 && !showDeliverableForm && (
              <div className="deliverable-hints">
                <p className="deliverable-hints-label">Expected for this phase:</p>
                {PHASE_DELIVERABLE_HINTS[phase.code].map((hint, i) => (
                  <p key={i} className="deliverable-hint-item">→ {hint}</p>
                ))}
              </div>
            )}
            {PHASE_DELIVERABLE_HINTS[phase.code]?.length > 0 && phase.deliverables.length > 0 && (
              <p className="section-subtitle">Link Figma files, docs, and other outputs.</p>
            )}

            {showDeliverableForm && (
              <form className="deliverable-form" onSubmit={handleDeliverableSubmit}>
                <div className="form-field">
                  <label>Title *</label>
                  <input type="text" placeholder="e.g. Figma prototype v2" value={deliverableDraft.title}
                    onChange={e => setDeliverableDraft(d => ({ ...d, title: e.target.value }))} autoFocus />
                </div>
                <div className="form-field">
                  <label>Type</label>
                  <select value={deliverableDraft.type}
                    onChange={e => setDeliverableDraft(d => ({ ...d, type: e.target.value as DeliverableType }))}>
                    {DELIVERABLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>URL *</label>
                  <input type="url" placeholder="https://..." value={deliverableDraft.url}
                    onChange={e => setDeliverableDraft(d => ({ ...d, url: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Description (optional)</label>
                  <RichTextEditor
                    content={deliverableDraft.description}
                    onChange={html => setDeliverableDraft(d => ({ ...d, description: html }))}
                    placeholder="Brief note"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowDeliverableForm(false); setDeliverableDraft(EMPTY_DELIVERABLE); }}>Cancel</button>
                  <button type="submit" className="btn-primary"
                    disabled={!deliverableDraft.title.trim() || !deliverableDraft.url.trim()}>Add</button>
                </div>
              </form>
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

// ═══════════════════════════════════════════════════════════════════════════
//  TASKS SECTION
// ═══════════════════════════════════════════════════════════════════════════

function TasksSection({ tasks, onAdd, onUpdate, onDelete, onMarkPhaseComplete }: {
  tasks: Task[];
  onAdd: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate: (taskId: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDelete: (taskId: string) => void;
  onMarkPhaseComplete?: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '' });

  const allValidated = tasks.length > 0 && tasks.every(t => !!t.validatedAt);
  const validatedCount = tasks.filter(t => !!t.validatedAt).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onAdd({ title: draft.title.trim(), description: draft.description.trim() || undefined, informed: [] });
    setDraft({ title: '', description: '' });
    setShowForm(false);
  }

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h3 className="section-title">Tasks</h3>
        <button onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Add task'}
        </button>
      </div>

      {/* Validation banner */}
      {allValidated && (
        <div className="tasks-validated-banner">
          <span>✓ All {tasks.length} task{tasks.length !== 1 ? 's' : ''} validated</span>
          {onMarkPhaseComplete && (
            <button className="btn-primary" onClick={onMarkPhaseComplete}>
              Mark phase complete
            </button>
          )}
        </div>
      )}
      {!allValidated && tasks.length > 0 && (
        <div className="tasks-progress-bar">
          <div
            className="tasks-progress-fill"
            style={{ width: `${(validatedCount / tasks.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form className="task-add-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
          />
          <div className="form-actions">
            <button type="button" onClick={() => { setShowForm(false); setDraft({ title: '', description: '' }); }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!draft.title.trim()}>Add task</button>
          </div>
        </form>
      )}

      {/* Task list */}
      {tasks.length === 0 && !showForm && (
        <div className="empty-state-inline">No tasks yet. Add tasks to track work for this phase.</div>
      )}
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onValidate={() => onUpdate(task.id, {
              validatedAt: task.validatedAt ? undefined : new Date().toISOString(),
            })}
            onUpdateInformed={(informed) => onUpdate(task.id, { informed })}
            onDelete={() => { if (confirm('Delete this task?')) onDelete(task.id); }}
          />
        ))}
      </div>
    </div>
  );
}

const LOOP_IN_TEAMS: { key: string; label: string; abbr: string }[] = [
  { key: 'stakeholder', label: 'Stakeholders',   abbr: 'SH' },
  { key: 'delivery',    label: 'Delivery team',  abbr: 'DT' },
  { key: 'pm',          label: 'PM team',        abbr: 'PM' },
  { key: 'other',       label: 'Other',          abbr: '···' },
];

function TaskCard({ task, onValidate, onUpdateInformed, onDelete }: {
  task: Task;
  onValidate: () => void;
  onUpdateInformed: (informed: string[]) => void;
  onDelete: () => void;
}) {
  const validated = !!task.validatedAt;
  const [pulsing, setPulsing] = useState<string | null>(null);

  function toggleTeam(key: string) {
    const current = task.informed ?? [];
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
    if (!current.includes(key)) {
      setPulsing(key);
      setTimeout(() => setPulsing(null), 500);
    }
    onUpdateInformed(next);
  }

  return (
    <div className={`task-card ${validated ? 'task-card-validated' : ''}`}>
      <button
        className={`task-validate-btn ${validated ? 'task-validate-btn-done' : ''}`}
        onClick={onValidate}
        title={validated ? 'Mark as not validated' : 'Mark as validated'}
        aria-label={validated ? 'Validated' : 'Mark validated'}
      >
        {validated ? '✓' : ''}
      </button>
      <div className="task-card-body">
        <span className={`task-title ${validated ? 'task-title-validated' : ''}`}>{task.title}</span>
        {task.description && <span className="task-description">{task.description}</span>}
        {validated && task.validatedAt && (
          <span className="task-validated-at">Validated {formatDateShort(task.validatedAt)}</span>
        )}
        <div className="loop-in-row">
          <span className="loop-in-label">Looped in</span>
          {LOOP_IN_TEAMS.map(team => {
            const active = (task.informed ?? []).includes(team.key);
            return (
              <button
                key={team.key}
                type="button"
                className={`loop-in-chip loop-in-chip-${team.key} ${active ? 'loop-in-chip-active' : ''} ${pulsing === team.key ? 'loop-in-chip-pulse' : ''}`}
                onClick={() => toggleTeam(team.key)}
                title={active ? `${team.label} informed ✓` : `Mark ${team.label} as informed`}
              >
                {team.abbr}
                {active && <span className="loop-in-dot" />}
              </button>
            );
          })}
        </div>
      </div>
      <button className="task-delete-btn" onClick={onDelete} title="Delete task">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,4 12,4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
        </svg>
      </button>
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

function ActivityCard({ def, state, prompt, onUpdate }: {
  def: ActivityDef;
  state: ActivityState;
  prompt: Prompt | undefined;
  onUpdate: (changes: Partial<Omit<ActivityState, 'defId'>>) => void;
}) {
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
            <button className="btn-primary" style={{ fontSize: 12, padding: '4px 12px' }}
              onClick={() => { setIsEditing(true); setIsExpanded(true); }}>
              Get started
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
//  DELIVERABLE CARD
// ═══════════════════════════════════════════════════════════════════════════

function DeliverableCard({ deliverable, onDelete }: { deliverable: Deliverable; onDelete: () => void }) {
  const typeInfo = DELIVERABLE_TYPES.find(t => t.value === deliverable.type) ?? DELIVERABLE_TYPES[DELIVERABLE_TYPES.length - 1];
  return (
    <div className="deliverable-card">
      <div className="deliverable-icon">{typeInfo.icon}</div>
      <div className="deliverable-info">
        <a className="deliverable-title" href={deliverable.url} target="_blank" rel="noopener noreferrer">
          {deliverable.title}
        </a>
        {deliverable.description && <RichTextView html={deliverable.description} className="deliverable-description" />}
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
