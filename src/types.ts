export type ProjectStatus = 'active' | 'on-hold' | 'completed';
export type TeamMemberRole = 'designer' | 'engineer' | 'pm' | 'researcher' | 'business' | 'stakeholder';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
}

export interface AlignmentEvent {
  id: string;
  ruleId: string;
  note: string;
  alignedAt: string;
}
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';
export type DeliverableType = 'figma' | 'doc' | 'slides' | 'notion' | 'video' | 'link' | 'other';
export type ActivityStatus = 'empty' | 'in-progress' | 'validated';

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

export interface ActivityState {
  defId: string;
  status: ActivityStatus;
  content: string;
  source?: 'manual' | 'generated';
  validatedAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  validatedAt?: string;
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
  activities: ActivityState[];
  tasks: Task[];
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
  team: TeamMember[];
  alignmentLog: AlignmentEvent[];
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
