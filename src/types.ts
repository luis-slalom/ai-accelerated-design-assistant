export type ProjectStatus = 'active' | 'on-hold' | 'completed';
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';
export type DeliverableType = 'figma' | 'doc' | 'slides' | 'notion' | 'video' | 'link' | 'other';

export interface Deliverable {
  id: string;
  title: string;
  type: DeliverableType;
  url: string;
  description?: string;
  addedAt: string;
}

export interface Checkpoint {
  id: string;
  title: string;
  content: string;
  promptId?: string;
  promptTitle?: string;
  createdAt: string;
  tags: string[];
}

export interface Phase {
  id: string;
  code: string;
  label: string;
  description: string;
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  deliverables: Deliverable[];
  checkpoints: Checkpoint[];
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  phases: Phase[];
  tags: string[];
}

export interface Prompt {
  id: string;
  level: string;
  code: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
  custom?: boolean;
}
