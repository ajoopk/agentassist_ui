/**
 * Domain types for Agent Assist AutoQA.
 *
 * These double as the API contract for the backend. Every screen reads through
 * `src/data/api.ts`, which currently resolves fixtures — swapping in real
 * endpoints means changing that one file, not the screens.
 */

export type Verdict = 'pass' | 'fail' | 'na';
export type GuidelineHealth = 'positive' | 'needs-attention' | 'insufficient-data';
export type AgentStatus = 'active' | 'invited';
export type CallSegment = 'opening' | 'body' | 'closing';

export interface Agent {
  id: string;              // AVM0002
  name: string;
  email: string;
  status: AgentStatus;
  supervisor?: string;
  extension?: string;
}

export interface CallSummary {
  id: string;
  callerName: string;      // "Unknown caller" until identity is resolved
  agentId: string;
  agentName: string;
  startedAt: string;       // ISO 8601
  durationSec: number;
  autoFail: boolean;
  criticalMissed: number;
  guidelinesMissed: number;
  guidelinesTotal: number;
  score: number;           // 0-100
}

export interface ChecklistBreakdown {
  checklistId: string;
  checklistName: string;
  missed: number;
  total: number;
  criticalMissed: number;
}

/** The expanded row under a call in the Calls list. */
export interface CallExpansion {
  callId: string;
  criticalMissed: number;
  checklists: ChecklistBreakdown[];
  topMiss: string;
}

export interface TranscriptLine {
  id: string;
  atSec: number;
  speaker: 'agent' | 'caller';
  text: string;
  flag?: string;           // e.g. "Red flag symptom missed"
}

export interface GuidelineResult {
  id: string;
  name: string;
  verdict: Verdict;
  atSec?: number;
}

export interface ChecklistResult {
  id: string;
  name: string;
  met: number;
  total: number;
  guidelines: GuidelineResult[];
}

export interface CoachingSummary {
  overall: string;
  gaps: string[];
  recommendations: { title: string; detail: string }[];
}

export interface CallDetail extends CallSummary {
  segmentScores: Record<CallSegment, { met: number; total: number }>;
  checklists: ChecklistResult[];
  transcript: TranscriptLine[];
  coaching: CoachingSummary;
}

export interface AgentPerformanceRow {
  agentId: string;
  agentName: string;
  calls: number;
  autoFailCalls: number;
  criticalMissed: number;
  callsAffected: number;
  avgScore: number;        // 0-100
}

export interface AgentDetail {
  agent: Agent;
  criticalFailures: number;
  callsEvaluated: number;
  overallScore: number;
  teamAvgScore: number;
  summary: string;
  priorityAction: { title: string; detail: string };
  trend: { label: string; score: number }[];
  bySegment: { segment: CallSegment; label: string; score: number }[];
  coachingPriorities: { label: string; misses: number; shareOfCalls: number }[];
  calls: CallSummary[];
}

export interface EvidencePattern {
  id: string;
  title: string;
  calls: number;
  shareOfMisses: number;   // 0-1
  quote: string;
  quoteAttribution: string;
}

export interface GuidelinePerformanceRow {
  id: string;
  name: string;
  checklistName: string;
  adherence: number;       // 0-100
  calls: number;
  health: GuidelineHealth;
}

export interface GuidelineReview {
  guideline: GuidelinePerformanceRow;
  segment: CallSegment;
  critical: boolean;
  enabled: boolean;
  createdBy: string;
  updatedAt: string;
  criticalMisses: number;
  checklistAvgAdherence: number;
  patterns: EvidencePattern[];
  currentInstruction: string;
  proposedInstruction: string;
  whatChanges: string[];
}

export interface Guideline {
  id: string;
  checklistId: string;
  segment: CallSegment;
  segmentLabel: string;
  name: string;
  createdBy: string;
  critical: boolean;
  enabled: boolean;
  updatedAt: string;
}

export interface Checklist {
  id: string;
  name: string;
  guidelineCount: number;
}

/** Payload for the New checklist dialog. */
export interface NewChecklistInput {
  name: string;
  callTypes: string[];
  teams: string[];
  description: string;
  evaluationCriteria: string;
  critical: boolean;
  generateAlert: boolean;
}

/** Payload for the New guideline dialog. */
export interface NewGuidelineInput {
  name: string;
  checklistId: string;
  segment: CallSegment;
  weight: number;
  enabled: boolean;
  instructions: string;
  critical: boolean;
  generateAlert: boolean;
}

export interface DateRange {
  from: string;
  to: string;
  label: string;
}

export interface CallsQuery {
  search?: string;
  risk?: 'all' | 'auto-fail' | 'critical' | 'passed';
  checklistId?: string | 'all';
  score?: 'any' | 'lt50' | '50-79' | 'gte80';
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
