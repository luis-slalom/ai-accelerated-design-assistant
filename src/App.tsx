import { useState } from 'react';
import type { Project, Phase, Checkpoint, Deliverable, Prompt, PhaseStatus } from './types';
import { loadProjects, saveProjects, loadPrompts, generateId } from './storage';
import { DEFAULT_PROMPTS, PHASE_TEMPLATES } from './data';
import { Dashboard } from './views/Dashboard';
import { ProjectView } from './views/ProjectView';
import { PhaseView } from './views/PhaseView';

type View = 'dashboard' | 'project' | 'phase';

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
    phases: PHASE_TEMPLATES.map(t => ({
      ...t,
      id: generateId(),
      status: 'not-started' as PhaseStatus,
      deliverables: [],
      checkpoints: [],
      notes: '',
    })),
  };
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [prompts] = useState<Prompt[]>(() => loadPrompts(DEFAULT_PROMPTS));
  const [view, setView] = useState<View>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);

  function update(updated: Project[]) {
    setProjects(updated);
    saveProjects(updated);
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

  // ── Phase CRUD ────────────────────────────────────────────────────────────

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

  function updateCheckpoint(projectId: string, phaseId: string, checkpointId: string, changes: Partial<Omit<Checkpoint, 'id' | 'createdAt'>>) {
    update(projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        updatedAt: new Date().toISOString(),
        phases: p.phases.map(ph => {
          if (ph.id !== phaseId) return ph;
          return { ...ph, checkpoints: ph.checkpoints.map(c => c.id === checkpointId ? { ...c, ...changes } : c) };
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

  // ── Navigation ────────────────────────────────────────────────────────────

  function openProject(id: string) {
    setActiveProjectId(id);
    setActivePhaseId(null);
    setView('project');
  }

  function openPhase(phaseId: string) {
    setActivePhaseId(phaseId);
    setView('phase');
  }

  const activeProject = projects.find(p => p.id === activeProjectId) ?? null;
  const activePhase = activeProject?.phases.find(ph => ph.id === activePhaseId) ?? null;

  return (
    <div className="app-wrapper">
      {view === 'dashboard' && (
        <Dashboard
          projects={projects}
          onOpenProject={openProject}
          onAddProject={addProject}
          onEditProject={editProject}
          onDeleteProject={deleteProject}
        />
      )}
      {view === 'project' && activeProject && (
        <ProjectView
          project={activeProject}
          onBack={() => { setView('dashboard'); setActiveProjectId(null); }}
          onOpenPhase={openPhase}
          onEditProject={(changes) => editProject(activeProject.id, changes)}
          onDeleteProject={() => deleteProject(activeProject.id)}
          onUpdatePhase={(phaseId, changes) => updatePhase(activeProject.id, phaseId, changes)}
        />
      )}
      {view === 'phase' && activeProject && activePhase && (
        <PhaseView
          project={activeProject}
          phase={activePhase}
          prompts={prompts}
          onBack={() => { setView('project'); setActivePhaseId(null); }}
          onUpdatePhase={(changes) => updatePhase(activeProject.id, activePhase.id, changes)}
          onAddCheckpoint={(data) => addCheckpoint(activeProject.id, activePhase.id, data)}
          onUpdateCheckpoint={(id, changes) => updateCheckpoint(activeProject.id, activePhase.id, id, changes)}
          onDeleteCheckpoint={(id) => deleteCheckpoint(activeProject.id, activePhase.id, id)}
          onAddDeliverable={(data) => addDeliverable(activeProject.id, activePhase.id, data)}
          onDeleteDeliverable={(id) => deleteDeliverable(activeProject.id, activePhase.id, id)}
        />
      )}
    </div>
  );
}
