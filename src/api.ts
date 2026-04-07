import type { Project } from './types';
import { migrateProject } from './storage';

async function checkResponse(res: Response, label: string): Promise<void> {
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json() as { error?: string }).error ?? ''; } catch { /* ignore */ }
    throw new Error(detail ? `${label}: ${detail}` : `${label} (${res.status})`);
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  await checkResponse(res, 'Failed to fetch projects');
  const data = await res.json() as unknown[];
  return data.map(migrateProject);
}

export async function createProject(project: Project): Promise<void> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  await checkResponse(res, 'Failed to create project');
}

export async function updateProject(project: Project): Promise<void> {
  const res = await fetch(`/api/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  await checkResponse(res, 'Failed to update project');
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  await checkResponse(res, 'Failed to delete project');
}
