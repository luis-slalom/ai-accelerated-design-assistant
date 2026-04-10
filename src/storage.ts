import type { Project, ActivityStatus, ActivityState, CustomActivity, EngagementEntry } from './types';
import { ACTIVITY_DEFS } from './data';

const PROMPTS_KEY = 'design-tracker-prompts';

// Migrate phase activities: preserve matching states, add new defs as empty, drop obsolete ones
function migratePhaseActivities(ph: any): ActivityState[] {
  const currentDefs = ACTIVITY_DEFS.filter(d => d.phaseCode === ph.code);
  const existing: ActivityState[] = ph.activities ?? [];
  return currentDefs.map(d => {
    const found = existing.find((a: ActivityState) => a.defId === d.id);
    if (!found) return { defId: d.id, status: 'empty' as ActivityStatus, content: '', informed: [] };
    // Migrate old string[] informed → EngagementEntry[]
    const raw = found.informed ?? [];
    const informed: EngagementEntry[] = raw.map((e: any) =>
      typeof e === 'string' ? { key: e } : e
    );
    return { ...found, informed };
  });
}

const PHASE_ORDER = ['00', '01', '02', '03', '04', '05', '06'];

export function migrateProject(p: any): Project {
  const phases = (p.phases || []).map((ph: any) => {
    const code = ph.code === 'U' ? '00' : ph.code;
    return {
      ...ph,
      code,
      activities: migratePhaseActivities({ ...ph, code }),
      checkpoints: ph.checkpoints ?? [],
      deliverables: ph.deliverables ?? [],
      customActivities: (ph.customActivities ?? []) as CustomActivity[],
      notes: ph.notes ?? '',
    };
  });

  // Ensure phases are in canonical order (handles old projects where Utility was last)
  phases.sort((a: any, b: any) => {
    const ai = PHASE_ORDER.indexOf(a.code);
    const bi = PHASE_ORDER.indexOf(b.code);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return {
    ...p,
    team: p.team ?? [],
    alignmentLog: p.alignmentLog ?? [],
    phases,
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
