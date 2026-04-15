import { useState } from 'react';
import faviconUrl from '../../assets/main-favicon.svg';
import type { Project, ProjectStatus } from '../types';
import { PHASE_COLORS } from '../data';
import { formatDate } from '../storage';

type StatusFilter = 'all' | ProjectStatus;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
};

const STATUS_DOT_COLOR: Record<ProjectStatus, string> = {
  active:     '#16a34a',
  'on-hold':  '#d97706',
  completed:  '#0c62fb',
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
  const [showOnboarding, setShowOnboarding] = useState(true);

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
      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <h2 className="dashboard-view-title">Projects</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowOnboarding(v => !v)}>
            {showOnboarding ? 'Hide guide' : 'Show guide'}
          </button>
          <button className="btn-primary" onClick={() => { setDraft(EMPTY_DRAFT); setShowForm(true); }}>
            New project
          </button>
        </div>
      </div>

      {/* Onboarding banner */}
      {showOnboarding && (
        <div className="onboarding-banner">
          <button className="onboarding-dismiss" onClick={() => setShowOnboarding(false)} aria-label="Hide guide">✕</button>
          <div className="onboarding-intro">
            <img src={faviconUrl} alt="" className="onboarding-icon" />
            <p className="onboarding-headline">Welcome to Slalom mosAIc</p>
            <p className="onboarding-body">
              Track every design engagement end-to-end — from first stakeholder conversation to live UX review.
              Each project follows a structured 7-stage process with built-in AI prompts to accelerate your work.
            </p>
          </div>
          <div className="onboarding-steps">
            <div className="onboarding-step">
              <span className="onboarding-step-icon">⬡</span>
              <div>
                <div className="onboarding-step-title">Create a project</div>
                <div className="onboarding-step-body">Set up a client engagement and track progress across all design phases.</div>
              </div>
            </div>
            <div className="onboarding-step">
              <span className="onboarding-step-icon">◈</span>
              <div>
                <div className="onboarding-step-title">Use the Prompt Library</div>
                <div className="onboarding-step-body">Browse 39 ready-made AI prompts organised by stage — copy and paste into any AI tool.</div>
              </div>
            </div>
            <div className="onboarding-step">
              <span className="onboarding-step-icon">◑</span>
              <div>
                <div className="onboarding-step-title">Capture context checkpoints</div>
                <div className="onboarding-step-body">Log key decisions, research insights, and AI outputs as reusable context for your team.</div>
              </div>
            </div>
            <div className="onboarding-step">
              <span className="onboarding-step-icon">↗</span>
              <div>
                <div className="onboarding-step-title">Stay aligned</div>
                <div className="onboarding-step-body">Get nudges when stakeholder or engineering alignment is needed before moving forward.</div>
              </div>
            </div>
          </div>
          <div className="onboarding-actions">
            <button className="btn-primary" onClick={() => { setShowOnboarding(false); setShowForm(true); }}>
              Create your first project
            </button>
          </div>
        </div>
      )}

      {/* New project form */}
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

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No projects yet</p>
          <p className="empty-state-body">Create your first project to start tracking design context and deliverables.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>New project</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No {filter} projects</p>
        </div>
      ) : (
        <div className="project-list">
          <div className="project-list-header">
            <span />
            <span className="project-list-header-cell">Project</span>
            <span className="project-list-header-cell">Progress</span>
            <span className="project-list-header-cell" style={{ textAlign: 'right' }}>Updated</span>
          </div>
          {filtered.map(project => (
            <ProjectRow
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

function ProjectRow({ project, onOpen }: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <div
      className="project-row"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      {/* Status dot */}
      <span
        className="project-row-dot"
        title={STATUS_LABELS[project.status]}
        style={{ background: STATUS_DOT_COLOR[project.status] }}
      />

      {/* Name + client */}
      <div className="project-row-main">
        <span className="project-row-name">{project.name}</span>
        {project.client && (
          <span className="project-row-client">{project.client}</span>
        )}
      </div>

      {/* Phase progress dots */}
      <div className="project-row-phases">
        {project.phases.map(phase => {
          const color = PHASE_COLORS[phase.code];
          const isDone = phase.status === 'completed';
          const isActive = phase.status === 'in-progress';
          return (
            <div
              key={phase.id}
              className="project-row-phase-dot"
              title={`${phase.label}: ${phase.status}`}
              style={{
                background: isDone ? color.text : isActive ? color.bg : '#e5e7eb',
                border: isActive ? `1.5px solid ${color.text}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Updated date */}
      <span className="project-row-date">{formatDate(project.updatedAt)}</span>
    </div>
  );
}
