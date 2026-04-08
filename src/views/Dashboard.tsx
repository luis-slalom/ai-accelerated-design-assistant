import { useState } from 'react';
import type { Project, ProjectStatus } from '../types';
import { PHASE_COLORS } from '../data';
import { formatDate } from '../storage';

type StatusFilter = 'all' | ProjectStatus;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
};

interface Props {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onAddProject: (name: string, client: string, description: string, tags: string[]) => void;
}

const EMPTY_DRAFT = { name: '', client: '', description: '', tags: '' };

export function Dashboard({ projects, onOpenProject, onAddProject }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    const tags = draft.tags.split(',').map(t => t.trim()).filter(Boolean);
    onAddProject(draft.name.trim(), draft.client.trim(), draft.description.trim(), tags);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  function cancelForm() {
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  const counts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="app-title">Slalom Design Delivery</h1>
          <p className="app-subtitle">CX & XD project tracker for client engagements</p>
        </div>
        <button className="btn-primary" onClick={() => { setDraft(EMPTY_DRAFT); setShowForm(true); }}>
          + New Project
        </button>
      </div>

      {/* New / Edit project form */}
      {showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <h3 className="form-title">New project</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Project name *</label>
              <input
                type="text"
                placeholder="e.g. Checkout Redesign"
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Client / Team</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={draft.client}
                onChange={e => setDraft(d => ({ ...d, client: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Description</label>
            <input
              type="text"
              placeholder="One-line project summary"
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. mobile, B2B, Q2-2026"
              value={draft.tags}
              onChange={e => setDraft(d => ({ ...d, tags: e.target.value }))}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={cancelForm}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!draft.name.trim()}>
              Create project
            </button>
          </div>
        </form>
      )}

      {/* Filter pills */}
      <div className="filter-bar">
        {(['all', 'active', 'on-hold', 'completed'] as StatusFilter[]).map(f => (
          <button
            key={f}
            className={`filter-pill ${filter === f ? 'filter-pill-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f as ProjectStatus]}
            <span className="filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          {projects.length === 0 ? (
            <>
              <p className="empty-state-title">No projects yet</p>
              <p className="empty-state-body">Create your first project to start tracking design context and deliverables.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Project</button>
            </>
          ) : (
            <p className="empty-state-title">No {filter} projects</p>
          )}
        </div>
      ) : (
        <div className="project-grid">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => onOpenProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onOpen }: {
  project: Project;
  onOpen: () => void;
}) {
  const completedPhases = project.phases.filter(p => p.status === 'completed').length;
  const totalCheckpoints = project.phases.reduce((n, p) => n + p.checkpoints.length, 0);
  const totalDeliverables = project.phases.reduce((n, p) => n + p.deliverables.length, 0);

  return (
    <div className="project-card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpen()}>
      <div className="project-card-header">
        <div className="project-card-meta">
          <h3 className="project-card-name">{project.name}</h3>
          {project.client && <span className="project-card-client">{project.client}</span>}
        </div>
        <div className="project-card-actions">
          <span className={`status-badge status-${project.status}`}>{STATUS_LABELS[project.status]}</span>
        </div>
      </div>

      {project.description && (
        <p className="project-card-description">{project.description}</p>
      )}

      {/* Phase progress dots */}
      <div className="phase-progress">
        {project.phases.map(phase => {
          const color = PHASE_COLORS[phase.code];
          const isDone = phase.status === 'completed';
          const isActive = phase.status === 'in-progress';
          return (
            <div
              key={phase.id}
              className="phase-dot"
              title={`${phase.code === 'U' ? 'Utility' : `0${phase.code}`} ${phase.label}: ${phase.status}`}
              style={{
                background: isDone ? color.text : isActive ? color.bg : '#e5e7eb',
                border: isActive ? `2px solid ${color.text}` : isDone ? 'none' : '2px solid #e5e7eb',
              }}
            />
          );
        })}
        <span className="phase-progress-label">{completedPhases}/{project.phases.length} phases</span>
      </div>

      {/* Stats */}
      <div className="project-card-stats">
        <span>{totalCheckpoints} checkpoint{totalCheckpoints !== 1 ? 's' : ''}</span>
        <span className="stat-dot">·</span>
        <span>{totalDeliverables} deliverable{totalDeliverables !== 1 ? 's' : ''}</span>
      </div>

      {project.tags.length > 0 && (
        <div className="tag-list">
          {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <div className="project-card-footer">
        <span className="project-card-date">Updated {formatDate(project.updatedAt)}</span>
        <span className="project-card-arrow">Open →</span>
      </div>
    </div>
  );
}
