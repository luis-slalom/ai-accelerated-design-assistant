import { useState } from 'react';
import type { Project, Phase, PhaseStatus, ProjectStatus } from '../types';
import { PHASE_COLORS } from '../data';
import { formatDate, formatDateShort } from '../storage';
import { computeSuggestions, ROLE_LABELS, type AlignmentSuggestion } from '../alignment';

const STATUS_LABELS: Record<ProjectStatus, string> = { active: 'Active', 'on-hold': 'On Hold', completed: 'Completed' };
const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
  skipped: 'Skipped',
};

interface Props {
  project: Project;
  onBack: () => void;
  onOpenPhase: (phaseId: string) => void;
  onEditProject: (changes: Partial<Pick<Project, 'name' | 'client' | 'description' | 'status' | 'tags'>>) => void;
  onDeleteProject: () => void;
  onUpdatePhase: (phaseId: string, changes: Partial<Phase>) => void;
  onLogAlignment: (ruleId: string, note: string) => void;
}

export function ProjectView({
  project, onBack, onOpenPhase, onEditProject, onDeleteProject,
  onUpdatePhase, onLogAlignment,
}: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [editDraft, setEditDraft] = useState({
    name: project.name,
    client: project.client,
    description: project.description,
    status: project.status as ProjectStatus,
    tags: project.tags.join(', '),
  });

  const completedCount = project.phases.filter(p => p.status === 'completed').length;
  const totalValidated = project.phases.reduce((n, p) => n + p.activities.filter(a => a.status === 'validated').length, 0);
  const totalActivities = project.phases.reduce((n, p) => n + p.activities.length, 0);
  const totalDeliverables = project.phases.reduce((n, p) => n + p.deliverables.length, 0);

  const suggestions = computeSuggestions(project);
  const nonNegotiableCount = suggestions.filter(s => s.isNonNegotiable).length;

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    onEditProject({
      name: editDraft.name.trim(),
      client: editDraft.client.trim(),
      description: editDraft.description.trim(),
      status: editDraft.status,
      tags: editDraft.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setShowEdit(false);
  }

  function exportMarkdown() {
    const lines: string[] = [
      `# ${project.name}`,
      ``,
      `**Client:** ${project.client || '—'}`,
      `**Status:** ${STATUS_LABELS[project.status]}`,
      `**Created:** ${formatDate(project.createdAt)}`,
      `**Last updated:** ${formatDate(project.updatedAt)}`,
      ``,
    ];
    if (project.description) lines.push(project.description, ``);
    if (project.tags.length) lines.push(`**Tags:** ${project.tags.map(t => `#${t}`).join(' ')}`, ``);
    lines.push(`---`, ``, `## Project summary`, ``);
    lines.push(`- ${completedCount}/${project.phases.length} phases completed`);
    lines.push(`- ${totalValidated}/${totalActivities} activities validated`);
    lines.push(`- ${totalDeliverables} deliverable${totalDeliverables !== 1 ? 's' : ''}`, ``);

    for (const phase of project.phases) {
      const phaseLabel = `0${phase.code} ${phase.label}`;
      lines.push(`---`, ``, `## Phase ${phaseLabel}`, ``);
      lines.push(`**Status:** ${PHASE_STATUS_LABELS[phase.status]}`);
      if (phase.startedAt) lines.push(`**Started:** ${formatDate(phase.startedAt)}`);
      if (phase.completedAt) lines.push(`**Completed:** ${formatDate(phase.completedAt)}`);
      lines.push(``);

      if (phase.deliverables.length > 0) {
        lines.push(`### Deliverables`, ``);
        for (const d of phase.deliverables) {
          const desc = d.description ? d.description.replace(/<[^>]*>/g, '').trim() : '';
          lines.push(`- **[${d.title}](${d.url})** (${d.type})${desc ? ` — ${desc}` : ''}`);
        }
        lines.push(``);
      }

      if (phase.checkpoints.length > 0) {
        lines.push(`### Context checkpoints`, ``);
        for (const c of phase.checkpoints) {
          lines.push(`#### ${c.title}`);
          lines.push(`*${formatDate(c.createdAt)}*${c.promptTitle ? ` · Scaffold: ${c.promptTitle}` : ''}`);
          if (c.tags.length) lines.push(c.tags.map(t => `#${t}`).join(' '));
          lines.push(``, c.content.replace(/<[^>]*>/g, '').trim(), ``);
        }
      }

      if (phase.notes) {
        lines.push(`### Phase notes`, ``, phase.notes.replace(/<[^>]*>/g, '').trim(), ``);
      }
    }

    if (project.alignmentLog.length > 0) {
      lines.push(`---`, ``, `## Alignment log`, ``);
      for (const e of project.alignmentLog) {
        lines.push(`- **${e.ruleId}** — ${formatDate(e.alignedAt)}${e.note ? `: ${e.note}` : ''}`);
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-context.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="project-view">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button className="breadcrumb-link" onClick={onBack}>← All projects</button>
      </div>

      {/* Project header */}
      {showEdit ? (
        <form className="project-form" onSubmit={handleEditSubmit}>
          <h3 className="form-title">Edit project</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Project name *</label>
              <input type="text" value={editDraft.name} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} autoFocus />
            </div>
            <div className="form-field">
              <label>Client / Team</label>
              <input type="text" value={editDraft.client} onChange={e => setEditDraft(d => ({ ...d, client: e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label>Description</label>
            <input type="text" value={editDraft.description} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select value={editDraft.status} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value as ProjectStatus }))}>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-field">
              <label>Tags (comma-separated)</label>
              <input type="text" value={editDraft.tags} onChange={e => setEditDraft(d => ({ ...d, tags: e.target.value }))} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowEdit(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        </form>
      ) : (
        <div className="project-header">
          <div className="project-header-main">
            <div>
              <div className="project-header-title-row">
                <h2 className="project-header-name">{project.name}</h2>
                <span className={`status-badge status-${project.status}`}>{STATUS_LABELS[project.status]}</span>
              </div>
              {project.client && <div className="project-header-client">{project.client}</div>}
              {project.description && <p className="project-header-description">{project.description}</p>}
              {project.tags.length > 0 && (
                <div className="tag-list" style={{ marginTop: 8 }}>
                  {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
            <div className="project-header-actions">
              <button onClick={exportMarkdown} title="Export full project context as Markdown">Export context</button>
              <button onClick={() => {
                setEditDraft({ name: project.name, client: project.client, description: project.description, status: project.status, tags: project.tags.join(', ') });
                setShowEdit(true);
              }}>Edit</button>
              <button className="btn-danger-outline" onClick={() => {
                if (confirm(`Delete "${project.name}"? This cannot be undone.`)) onDeleteProject();
              }}>Delete</button>
            </div>
          </div>

          <div className="project-stats">
            <div className="stat-item">
              <span className="stat-value">{completedCount}/{project.phases.length}</span>
              <span className="stat-label">phases</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{totalValidated}/{totalActivities}</span>
              <span className="stat-label">validated</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{totalDeliverables}</span>
              <span className="stat-label">deliverables</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{formatDateShort(project.updatedAt)}</span>
              <span className="stat-label">last activity</span>
            </div>
            {nonNegotiableCount > 0 && (
              <>
                <div className="stat-divider" />
                <div className="stat-item stat-item-alert">
                  <span className="stat-value">{nonNegotiableCount}</span>
                  <span className="stat-label">alignment{nonNegotiableCount !== 1 ? 's' : ''} needed</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Alignment suggestions */}
      {suggestions.length > 0 && (
        <AlignmentPanel suggestions={suggestions} onLog={onLogAlignment} />
      )}

      {/* Phase timeline */}
      <div className="phase-timeline">
        <h3 className="section-title">Phases</h3>
        <div className="phase-list">
          {project.phases.map((phase) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              onOpen={() => onOpenPhase(phase.id)}
              onStatusChange={(status) => onUpdatePhase(phase.id, {
                status,
                startedAt: status === 'in-progress' && !phase.startedAt ? new Date().toISOString() : phase.startedAt,
                completedAt: status === 'completed' ? new Date().toISOString() : undefined,
              })}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Alignment panel ───────────────────────────────────────────────────────────

function AlignmentPanel({ suggestions, onLog }: {
  suggestions: AlignmentSuggestion[];
  onLog: (ruleId: string, note: string) => void;
}) {
  const required = suggestions.filter(s => s.isNonNegotiable);
  const optional = suggestions.filter(s => !s.isNonNegotiable);

  return (
    <div className="alignment-panel">
      <div className="alignment-panel-header">
        <h3 className="section-title">Alignment</h3>
        {required.length > 0 && (
          <span className="alignment-required-badge">{required.length} required</span>
        )}
      </div>
      <div className="alignment-card-list">
        {required.map(s => <AlignmentCard key={s.ruleId} suggestion={s} onLog={onLog} />)}
        {optional.map(s => <AlignmentCard key={s.ruleId} suggestion={s} onLog={onLog} />)}
      </div>
    </div>
  );
}

function AlignmentCard({ suggestion, onLog }: {
  suggestion: AlignmentSuggestion;
  onLog: (ruleId: string, note: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className={`alignment-card ${suggestion.isNonNegotiable ? 'alignment-card-required' : 'alignment-card-optional'}`}>
      <div className="alignment-card-label">
        {suggestion.isNonNegotiable ? '⚠ Required' : '↗ Consider'}
      </div>
      <div className="alignment-card-title">{suggestion.title}</div>
      <p className="alignment-card-message">{suggestion.message}</p>
      {suggestion.involvedMembers.length > 0 && (
        <div className="alignment-members">
          {suggestion.involvedMembers.map(m => (
            <span key={m.id} className={`role-chip role-chip-${m.role}`}>
              {m.name} · {ROLE_LABELS[m.role]}
            </span>
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
          <div className="form-actions">
            <button type="button" onClick={() => { setConfirming(false); setNote(''); }}>Cancel</button>
            <button type="button" className="btn-primary" onClick={() => {
              onLog(suggestion.ruleId, note.trim());
              setConfirming(false);
              setNote('');
            }}>
              Confirm alignment
            </button>
          </div>
        </div>
      ) : (
        <button className="alignment-mark-btn" onClick={() => setConfirming(true)}>
          Mark as aligned →
        </button>
      )}
    </div>
  );
}


// ── Phase row ─────────────────────────────────────────────────────────────────

function PhaseRow({ phase, onOpen, onStatusChange }: {
  phase: Phase;
  onOpen: () => void;
  onStatusChange: (status: PhaseStatus) => void;
}) {
  const color = PHASE_COLORS[phase.code];
  const statusCycle: PhaseStatus[] = ['not-started', 'in-progress', 'completed'];
  const currentIdx = statusCycle.indexOf(phase.status);
  const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];

  return (
    <div className={`phase-row phase-row-${phase.status}`}>
      <div className="phase-row-badge" style={{ background: color.bg, color: color.text }}>
        {`0${phase.code}`}
      </div>
      <div className="phase-row-info">
        <div className="phase-row-name">{phase.label}</div>
        <div className="phase-row-desc">{phase.description}</div>
        <div className="phase-row-stats">
          {phase.activities.length > 0 && (() => {
            const validated = phase.activities.filter(a => a.status === 'validated').length;
            return <span className={validated === phase.activities.length ? 'stat-all-done' : ''}>{validated}/{phase.activities.length} validated</span>;
          })()}
          {phase.activities.length > 0 && phase.deliverables.length > 0 && <span className="stat-dot">·</span>}
          {phase.deliverables.length > 0 && (
            <span>{phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? 's' : ''}</span>
          )}
          {phase.completedAt && (
            <><span className="stat-dot">·</span><span>Completed {formatDateShort(phase.completedAt)}</span></>
          )}
        </div>
      </div>
      <div className="phase-row-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`phase-status-toggle phase-status-${phase.status}`}
          onClick={() => onStatusChange(nextStatus)}
          title={`Mark as ${nextStatus.replace('-', ' ')}`}
        >
          {phase.status === 'not-started' && <span>○ Not started</span>}
          {phase.status === 'in-progress' && <span>◑ In progress</span>}
          {phase.status === 'completed' && <span>● Completed</span>}
          {phase.status === 'skipped' && <span>— Skipped</span>}
        </button>
        <button className="btn-open-phase" onClick={onOpen}>Open →</button>
      </div>
    </div>
  );
}
