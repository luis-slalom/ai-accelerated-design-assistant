import type { Project, TeamMember, TeamMemberRole } from './types';

export interface AlignmentSuggestion {
  ruleId: string;
  title: string;
  message: string;
  involvedMembers: TeamMember[];
  isNonNegotiable: boolean;
  phaseContext?: string; // phase code this suggestion is most relevant to
}

// ── helpers ──────────────────────────────────────────────────────────────────

function membersForRoles(team: TeamMember[], roles: TeamMemberRole[]): TeamMember[] {
  return team.filter(m => roles.includes(m.role));
}

function nameList(members: TeamMember[]): string {
  if (members.length === 0) return '';
  if (members.length === 1) return members[0].name;
  return members.slice(0, -1).map(m => m.name).join(', ') + ' and ' + members.slice(-1)[0].name;
}

function phaseActive(project: Project, code: string): boolean {
  return project.phases.find(p => p.code === code)
    ?.activities.some(a => a.status !== 'empty') ?? false;
}

function phaseHasValidated(project: Project, code: string): boolean {
  return project.phases.find(p => p.code === code)
    ?.activities.some(a => a.status === 'validated') ?? false;
}

// ── rules ─────────────────────────────────────────────────────────────────────

const BUSINESS_ROLES: TeamMemberRole[] = ['pm', 'business', 'stakeholder'];
const TECH_ROLES: TeamMemberRole[] = ['engineer'];
const ALL_ROLES: TeamMemberRole[] = ['designer', 'engineer', 'pm', 'researcher', 'business', 'stakeholder'];

export function computeSuggestions(project: Project): AlignmentSuggestion[] {
  const { team, alignmentLog } = project;
  const logged = new Set(alignmentLog.map(e => e.ruleId));
  const suggestions: AlignmentSuggestion[] = [];

  // ── Rule 1: Capabilities defined → validate with business ─────────────────
  if (!logged.has('capabilities-business') && phaseActive(project, '02')) {
    const involved = membersForRoles(team, BUSINESS_ROLES);
    const names = nameList(involved);
    suggestions.push({
      ruleId: 'capabilities-business',
      title: 'Validate outcomes with the business',
      message: names
        ? `You're shaping what users need to achieve. Loop in ${names} to confirm these outcomes align with business goals — before the solution takes any specific form.`
        : `You're shaping user outcomes and capabilities. Someone from the business or product side should validate this direction before the solution takes form.`,
      involvedMembers: involved,
      isNonNegotiable: true,
      phaseContext: '02',
    });
  }

  // ── Rule 2: Objects defined → engineering feasibility ────────────────────
  if (!logged.has('objects-feasibility') && phaseActive(project, '03')) {
    const involved = membersForRoles(team, TECH_ROLES);
    const names = nameList(involved);
    suggestions.push({
      ruleId: 'objects-feasibility',
      title: 'Feasibility check on the data model',
      message: names
        ? `You're mapping entities and relationships. ${names} should weigh in on technical feasibility — data model complexity tends to surface build constraints early.`
        : `Your data model is taking shape. An engineer should validate feasibility before it gets too detailed.`,
      involvedMembers: involved,
      isNonNegotiable: true,
      phaseContext: '03',
    });
  }

  // ── Rule 3: Interactions defined → engineering complexity ─────────────────
  if (!logged.has('interactions-complexity') && phaseActive(project, '04')) {
    const involved = membersForRoles(team, TECH_ROLES);
    const names = nameList(involved);
    suggestions.push({
      ruleId: 'interactions-complexity',
      title: 'Align on interaction complexity',
      message: names
        ? `Interaction flows are emerging. Share this with ${names} to surface build complexity early — before the design gets locked in.`
        : `Interaction flows are emerging. An engineer should see this before the design is locked in.`,
      involvedMembers: involved,
      isNonNegotiable: false,
      phaseContext: '04',
    });
  }

  // ── Rule 4: Moving to build → full cross-team sign-off ───────────────────
  if (!logged.has('pre-build-signoff') && (phaseActive(project, '06') || phaseHasValidated(project, '05'))) {
    const involved = membersForRoles(team, ALL_ROLES);
    const names = nameList(involved);
    suggestions.push({
      ruleId: 'pre-build-signoff',
      title: 'Pre-build alignment — everyone needs to be in',
      message: names
        ? `You're moving toward build. ${names} should all be aligned on the design direction before implementation starts. This is the non-negotiable before code gets written.`
        : `You're approaching build. Make sure the full cross-functional team has signed off on the design direction before implementation starts.`,
      involvedMembers: involved,
      isNonNegotiable: true,
      phaseContext: '06',
    });
  }

  // ── Rule 5: Several decisions logged → stakeholder sync ──────────────────
  const totalCheckpoints = project.phases.reduce((n, ph) => n + ph.checkpoints.length, 0);
  if (!logged.has('decisions-stakeholder-sync') && totalCheckpoints >= 3) {
    const involved = membersForRoles(team, BUSINESS_ROLES);
    const names = nameList(involved);
    suggestions.push({
      ruleId: 'decisions-stakeholder-sync',
      title: 'Stakeholder sync — decisions are accumulating',
      message: names
        ? `You've logged ${totalCheckpoints} decisions and research notes. A quick sync with ${names} would surface any blockers before they compound.`
        : `You've logged significant decisions. Consider a stakeholder sync to keep everyone informed and surface blockers early.`,
      involvedMembers: involved,
      isNonNegotiable: false,
    });
  }

  return suggestions;
}

// ── labels and colours ───────────────────────────────────────────────────────

export const ROLE_LABELS: Record<TeamMemberRole, string> = {
  designer: 'Designer',
  engineer: 'Engineer',
  pm: 'Product Manager',
  researcher: 'Researcher',
  business: 'Business Lead',
  stakeholder: 'Stakeholder',
};

export const TEAM_ROLES: { value: TeamMemberRole; label: string }[] = [
  { value: 'designer', label: 'Designer' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'pm', label: 'Product Manager' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'business', label: 'Business Lead' },
  { value: 'stakeholder', label: 'Stakeholder' },
];
