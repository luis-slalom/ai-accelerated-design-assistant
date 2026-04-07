import type { Project, ActivityStatus, ActivityState } from './types';
import { ACTIVITY_DEFS } from './data';

const PROMPTS_KEY = 'design-tracker-prompts';

// Migrate phase activities: preserve matching states, add new defs as empty, drop obsolete ones
function migratePhaseActivities(ph: any): ActivityState[] {
  const currentDefs = ACTIVITY_DEFS.filter(d => d.phaseCode === ph.code);
  const existing: ActivityState[] = ph.activities ?? [];
  return currentDefs.map(d => {
    const found = existing.find((a: ActivityState) => a.defId === d.id);
    return found ?? { defId: d.id, status: 'empty' as ActivityStatus, content: '' };
  });
}

export function migrateProject(p: any): Project {
  return {
    ...p,
    team: p.team ?? [],
    alignmentLog: p.alignmentLog ?? [],
    phases: (p.phases || []).map((ph: any) => ({
      ...ph,
      activities: migratePhaseActivities(ph),
      checkpoints: ph.checkpoints ?? [],
      deliverables: ph.deliverables ?? [],
      tasks: (ph.tasks ?? []).map((t: any) => ({ ...t, informed: t.informed ?? [] })),
      notes: ph.notes ?? '',
    })),
  };
}

export function loadPrompts<T>(defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(PROMPTS_KEY);
    if (raw) return JSON.parse(raw) as T[];
  } catch {}
  return defaults;
}

export function savePrompts<T>(prompts: T[]): void {
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
