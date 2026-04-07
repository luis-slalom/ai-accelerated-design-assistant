import { useState } from 'react';
import type { Project, Phase, PhaseStatus, ProjectStatus } from '../types';
import { PHASE_COLORS } from '../data';
import { formatDate, formatDateShort } from '../storage';

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
}

export function ProjectView({ project, onBack, onOpenPhase, onEditProject, onDeleteProject, onUpdatePhase }: Props) {
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
    if (project.description) {
      lines.push(project.description, ``);
    }
    if (project.tags.length) {
      lines.push(`**Tags:** ${project.tags.map(t => `#${t}`).join(' ')}`, ``);
    }
    lines.push(`---`, ``, `## Project summary`, ``);
    lines.push(`- ${completedCount}/${project.phases.length} phases completed`);
    lines.push(`- ${totalValidated}/${totalActivities} activities validated`);
    lines.push(`- ${totalDeliverables} deliverable${totalDeliverables !== 1 ? 's' : ''}`, ``);

    for (const phase of project.phases) {
      const phaseLabel = phase.code === 'U' ? 'Utility' : `${phase.code} ${phase.label}`;
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
              <button onClick={exportMarkdown} title="Export full project context as Markdown">
                Export context
              </button>
              <button onClick={() => {
                setEditDraft({ name: project.name, client: project.client, description: project.description, status: project.status, tags: project.tags.join(', ') });
                setShowEdit(true);
              }}>
                Edit
              </button>
              <button className="btn-danger-outline" onClick={() => {
                if (confirm(`Delete "${project.name}"? This cannot be undone.`)) onDeleteProject();
              }}>
                Delete
              </button>
            </div>
          </div>

          {/* Project stats */}
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
          </div>
        </div>
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
      {/* Phase badge */}
      <div
        className="phase-row-badge"
        style={{ background: color.bg, color: color.text }}
      >
        {phase.code === 'U' ? 'U' : `0${phase.code}`}
      </div>

      {/* Phase info */}
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
            <>
              <span className="stat-dot">·</span>
              <span>Completed {formatDateShort(phase.completedAt)}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
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
        <button className="btn-open-phase" onClick={onOpen}>
          Open →
        </button>
      </div>
    </div>
  );
}
