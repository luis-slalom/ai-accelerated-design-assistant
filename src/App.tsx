import { useState, useEffect } from 'react';
import type { Project, Phase, Checkpoint, Deliverable, Prompt, PhaseStatus, ActivityState, AlignmentEvent, CustomActivity } from './types';
import { loadPrompts, generateId } from './storage';
import * as api from './api';
import { DEFAULT_PROMPTS, PHASE_TEMPLATES, ACTIVITY_DEFS, PHASE_COLORS } from './data';
import logoUrl from '../assets/main-logo-final.svg';
import { Dashboard } from './views/Dashboard';
import { ProjectView } from './views/ProjectView';
import { PhaseView } from './views/PhaseView';
import { PromptLibrary } from './views/PromptLibrary';

type View = 'dashboard' | 'project' | 'phase' | 'library';

function buildNewProject(name: string, client: string, description: string, tags: string[]): Project {
  return {
    id: generateId(),
    name,
    client,
    description,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
    team: [],
    alignmentLog: [],
    phases: PHASE_TEMPLATES.map(t => ({
      ...t,
      id: generateId(),
      status: 'not-started' as PhaseStatus,
      deliverables: [],
      checkpoints: [],
      customActivities: [],
      activities: ACTIVITY_DEFS
        .filter(d => d.phaseCode === t.code)
        .map(d => ({ defId: d.id, status: 'empty' as const, content: '', informed: [] })),
      notes: '',
    })),
  };
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [prompts] = useState<Prompt[]>(() => loadPrompts(DEFAULT_PROMPTS));
  const [view, setView] = useState<View>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);

  useEffect(() => {
    api.fetchProjects()
      .then(setProjects)
      .catch(err => setLoadError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  function update(updated: Project[]) {
    const prev = projects;
    setProjects(updated);

    const added = updated.filter(p => !prev.some(o => o.id === p.id));
    const changed = updated.filter(p => prev.some(o => o.id === p.id && o !== p));
    const removed = prev.filter(p => !updated.some(u => u.id === p.id));

    Promise.all([
      ...added.map(p => api.createProject(p)),
      ...changed.map(p => api.updateProject(p)),
      ...removed.map(p => api.deleteProject(p.id)),
    ]).catch(console.error);
  }

  // ── Project CRUD ──────────────────────────────────────────────────────────

  function addProject(name: string, client: string, description: string, tags: string[]) {
    update([...projects, buildNewProject(name, client, description, tags)]);
  }

  function editProject(id: string, changes: Partial<Pick<Project, 'name' | 'client' | 'description' | 'status' | 'tags'>>) {
    update(projects.map(p =>
      p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
    ));
  }

  function deleteProject(id: string) {
    update(projects.filter(p => p.id !== id));
    setView('dashboard');
    setActiveProjectId(null);
    setActivePhaseId(null);
  }

  function logAlignment(projectId: string, ruleId: string, note: string) {
    const event: AlignmentEvent = { id: generateId(), ruleId, note, alignedAt: new Date().toISOString() };
    update(projects.map(p => p.id !== projectId ? p : {
      ...p, alignmentLog: [...p.alignmentLog, event], updatedAt: new Date().toISOString(),
    }));
  }

  // ── Phase ─────────────────────────────────────────────────────────────────

  function updatePhase(projectId: string, phaseId: string, changes: Partial<Phase>) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => ph.id === phaseId ? { ...ph, ...changes } : ph),
      };
    }));
  }

  // ── Activities ────────────────────────────────────────────────────────────

  function updateActivity(projectId: string, phaseId: string, defId: string, changes: Partial<Omit<ActivityState, 'defId'>>) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          const exists = ph.activities.some(a => a.defId === defId);
          const updated = exists
            ? ph.activities.map(a => a.defId === defId ? { ...a, ...changes, updatedAt: new Date().toISOString() } : a)
            : [...ph.activities, { defId, status: 'empty' as const, content: '', ...changes, updatedAt: new Date().toISOString() }];
          return { ...ph, activities: updated };
        }),
      };
    }));
  }

  // ── Checkpoints ───────────────────────────────────────────────────────────

  function addCheckpoint(projectId: string, phaseId: string, data: Omit<Checkpoint, 'id' | 'createdAt'>) {
    const checkpoint: Checkpoint = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          return { ...ph, checkpoints: [checkpoint, ...ph.checkpoints] };
        }),
      };
    }));
  }

  function deleteCheckpoint(projectId: string, phaseId: string, checkpointId: string) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          return { ...ph, checkpoints: ph.checkpoints.filter(c => c.id !== checkpointId) };
        }),
      };
    }));
  }

  // ── Deliverables ──────────────────────────────────────────────────────────

  function addDeliverable(projectId: string, phaseId: string, data: Omit<Deliverable, 'id' | 'addedAt'>) {
    const deliverable: Deliverable = { ...data, id: generateId(), addedAt: new Date().toISOString() };
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          return { ...ph, deliverables: [...ph.deliverables, deliverable] };
        }),
      };
    }));
  }

  function deleteDeliverable(projectId: string, phaseId: string, deliverableId: string) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          return { ...ph, deliverables: ph.deliverables.filter(d => d.id !== deliverableId) };
        }),
      };
    }));
  }

  // ── Custom Activities ─────────────────────────────────────────────────────

  function addCustomActivity(projectId: string, phaseId: string, data: Omit<CustomActivity, 'id' | 'createdAt'>) {
    const ca: CustomActivity = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => ph.id !== phaseId ? ph : {
          ...ph,
          customActivities: [...ph.customActivities, ca],
          activities: [...ph.activities, { defId: ca.id, status: 'empty' as const, content: '', informed: [] }],
        }),
      };
    }));
  }

  function deleteCustomActivity(projectId: string, phaseId: string, caId: string) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => ph.id !== phaseId ? ph : {
          ...ph,
          customActivities: ph.customActivities.filter(ca => ca.id !== caId),
          activities: ph.activities.filter(a => a.defId !== caId),
        }),
      };
    }));
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function openProject(id: string) {
    setActiveProjectId(id);
    setActivePhaseId(null);
    setView('project');
    setSidebarOpen(false);
  }

  function openPhase(phaseId: string) {
    setActivePhaseId(phaseId);
    setView('phase');
    setSidebarOpen(false);
  }

  function goToDashboard() {
    setView('dashboard');
    setActiveProjectId(null);
    setActivePhaseId(null);
    setSidebarOpen(false);
  }

  function goToLibrary() {
    setView('library');
    setActiveProjectId(null);
    setActivePhaseId(null);
    setSidebarOpen(false);
  }

  function goToProject() {
    setActivePhaseId(null);
    setView('project');
    setSidebarOpen(false);
  }

  const activeProject = projects.find(p => p.id === activeProjectId) ?? null;
  const activePhase = activeProject?.phases.find(ph => ph.id === activePhaseId) ?? null;

  // ── Sidebar ───────────────────────────────────────────────────────────────

  const inProject = (view === 'project' || view === 'phase') && activeProject;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() { setSidebarOpen(false); }

  return (
    <>
      {/* ── Mobile overlay — outside app-shell to avoid overflow:hidden clipping ── */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className={`app-sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-content">
              <img src={logoUrl} alt="Slalom" className="sidebar-logo" />
              <div className="sidebar-brand-sub">Your AI-enabled CX project assistant</div>
            </div>
            <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">✕</button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {inProject ? (
            <>
              <button className="sidebar-back-btn" onClick={goToDashboard}>
                ← All projects
              </button>
              <div className="sidebar-project-name-block">
                <button
                  className={`sidebar-project-name-btn ${view === 'project' ? 'sidebar-project-name-btn-active' : ''}`}
                  onClick={goToProject}
                >
                  {activeProject.name}
                </button>
                {activeProject.client && (
                  <div className="sidebar-project-client">{activeProject.client}</div>
                )}
              </div>
              <div className="sidebar-section-label">Phases</div>
              {activeProject.phases.map(phase => {
                const isActive = phase.id === activePhaseId && view === 'phase';
                const color = PHASE_COLORS[phase.code];
                return (
                  <button
                    key={phase.id}
                    className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                    onClick={() => { setActivePhaseId(phase.id); setView('phase'); setSidebarOpen(false); }}
                  >
                    <span className="sidebar-phase-code" style={{ background: color.bg, color: color.text }}>
                      {`0${phase.code}`}
                    </span>
                    <span className="sidebar-nav-label">{phase.label}</span>
                    {phase.status === 'completed' && <span className="sidebar-phase-done">✓</span>}
                    {phase.status === 'in-progress' && <span className="sidebar-phase-progress">◑</span>}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <div className="sidebar-section-label">Workspace</div>
              <button
                className={`sidebar-nav-item ${view === 'dashboard' ? 'sidebar-nav-item-active' : ''}`}
                onClick={goToDashboard}
              >
                <span className="sidebar-nav-icon">⬡</span>
                <span className="sidebar-nav-label">Projects</span>
                <span className="sidebar-nav-count">{projects.length}</span>
              </button>
              <button
                className={`sidebar-nav-item ${view === 'library' ? 'sidebar-nav-item-active' : ''}`}
                onClick={goToLibrary}
              >
                <span className="sidebar-nav-icon">◈</span>
                <span className="sidebar-nav-label">Prompt Library</span>
                <span className="sidebar-nav-count">{prompts.length}</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* ── Content ── */}
      <main className="app-content">
        {/* Mobile top bar */}
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <img src={logoUrl} alt="Slalom" className="mobile-header-logo" />
        </div>
        {loading && (
          <div className="app-loading">Loading projects…</div>
        )}
        {!loading && loadError && (
          <div className="app-error">{loadError}</div>
        )}
        {!loading && !loadError && (
          <div className="app-wrapper">
            {view === 'library' && (
              <PromptLibrary prompts={prompts} />
            )}
            {view === 'dashboard' && (
              <Dashboard
                projects={projects}
                onOpenProject={openProject}
                onAddProject={addProject}
              />
            )}
            {view === 'project' && activeProject && (
              <ProjectView
                project={activeProject}
                onBack={goToDashboard}
                onOpenPhase={openPhase}
                onEditProject={(changes) => editProject(activeProject.id, changes)}
                onDeleteProject={() => deleteProject(activeProject.id)}
                onUpdatePhase={(phaseId, changes) => updatePhase(activeProject.id, phaseId, changes)}
                onLogAlignment={(ruleId, note) => logAlignment(activeProject.id, ruleId, note)}
              />
            )}
            {view === 'phase' && activeProject && activePhase && (
              <PhaseView
                project={activeProject}
                phase={activePhase}
                prompts={prompts}
                onBack={goToProject}
                onUpdatePhase={(changes) => updatePhase(activeProject.id, activePhase.id, changes)}
                onUpdateActivity={(defId, changes) => updateActivity(activeProject.id, activePhase.id, defId, changes)}
                onAddCheckpoint={(data) => addCheckpoint(activeProject.id, activePhase.id, data)}
                onDeleteCheckpoint={(id) => deleteCheckpoint(activeProject.id, activePhase.id, id)}
                onAddDeliverable={(data) => addDeliverable(activeProject.id, activePhase.id, data)}
                onDeleteDeliverable={(id) => deleteDeliverable(activeProject.id, activePhase.id, id)}
                onAddCustomActivity={(data) => addCustomActivity(activeProject.id, activePhase.id, data)}
                onDeleteCustomActivity={(caId) => deleteCustomActivity(activeProject.id, activePhase.id, caId)}
                onLogAlignment={(ruleId, note) => logAlignment(activeProject.id, ruleId, note)}
              />
            )}
          </div>
        )}
      </main>
    </div>
    </>
  );
}
