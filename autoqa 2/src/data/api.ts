/**
 * The seam between the UI and the backend.
 *
 * Every screen calls these functions and nothing else. They are async on
 * purpose: when the real API lands, replace the bodies with fetch calls and no
 * screen has to change. `LATENCY_MS` fakes a round trip so loading states get
 * exercised — set it to 0 to make the prototype feel instant.
 *
 * Suggested endpoint mapping is noted above each function.
 */
import * as fx from './fixtures';
import type {
  Agent, AgentDetail, AgentPerformanceRow, CallDetail, CallExpansion, CallsQuery,
  CallSummary, Checklist, DateRange, Guideline, GuidelinePerformanceRow,
  GuidelineReview, NewChecklistInput, NewGuidelineInput, Paged,
} from './types';

const LATENCY_MS = 180;

function resolve<T>(value: T): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), LATENCY_MS));
}

export function getDateRange(): Promise<DateRange> {
  return resolve(fx.DATE_RANGE);
}

/** GET /api/checklists */
export function getChecklists(): Promise<Checklist[]> {
  return resolve(fx.CHECKLISTS);
}

/** GET /api/calls?search=&risk=&checklistId=&score=&page=&pageSize= */
export function getCalls(q: CallsQuery = {}): Promise<Paged<CallSummary>> {
  const { search = '', risk = 'all', score = 'any', page = 1, pageSize = 8 } = q;
  let rows = fx.CALLS.slice();

  const term = search.trim().toLowerCase();
  if (term) {
    rows = rows.filter(
      (c) => c.agentName.toLowerCase().includes(term) || c.agentId.toLowerCase().includes(term),
    );
  }
  if (risk === 'auto-fail') rows = rows.filter((c) => c.autoFail);
  if (risk === 'critical') rows = rows.filter((c) => c.criticalMissed > 0);
  if (risk === 'passed') rows = rows.filter((c) => !c.autoFail && c.criticalMissed === 0);

  if (score === 'lt50') rows = rows.filter((c) => c.score < 50);
  if (score === '50-79') rows = rows.filter((c) => c.score >= 50 && c.score < 80);
  if (score === 'gte80') rows = rows.filter((c) => c.score >= 80);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  return resolve({ rows: rows.slice(start, start + pageSize), total, page, pageSize });
}

/** GET /api/calls/:id/expansion — the inline breakdown under a Calls row */
export function getCallExpansion(callId: string): Promise<CallExpansion | null> {
  return resolve(fx.CALL_EXPANSIONS[callId] ?? null);
}

/** GET /api/calls/:id */
export function getCallDetail(_callId: string): Promise<CallDetail> {
  return resolve(fx.CALL_DETAIL);
}

/** GET /api/agents */
export function getAgents(): Promise<Agent[]> {
  return resolve(fx.AGENTS);
}

/** GET /api/performance/agents */
export function getAgentPerformance(search = ''): Promise<AgentPerformanceRow[]> {
  const term = search.trim().toLowerCase();
  const rows = term
    ? fx.AGENT_PERFORMANCE.filter(
        (r) => r.agentName.toLowerCase().includes(term) || r.agentId.toLowerCase().includes(term),
      )
    : fx.AGENT_PERFORMANCE;
  return resolve(rows);
}

/** GET /api/performance/agents/:id */
export function getAgentDetail(_agentId: string): Promise<AgentDetail> {
  return resolve(fx.AGENT_DETAIL);
}

/** GET /api/performance/guidelines */
export function getGuidelinePerformance(search = ''): Promise<GuidelinePerformanceRow[]> {
  const term = search.trim().toLowerCase();
  const rows = term
    ? fx.GUIDELINE_PERFORMANCE.filter((r) => r.name.toLowerCase().includes(term))
    : fx.GUIDELINE_PERFORMANCE;
  return resolve(rows);
}

/** GET /api/performance/guidelines/:id/review */
export function getGuidelineReview(id: string): Promise<GuidelineReview | null> {
  return resolve(fx.GUIDELINE_REVIEWS[id] ?? fx.GUIDELINE_REVIEWS.gp1 ?? null);
}

/** POST /api/performance/guidelines/:id/review/apply */
export function applyGuidelineRevision(id: string): Promise<{ ok: true; id: string }> {
  return resolve({ ok: true as const, id });
}

/** POST /api/performance/guidelines/:id/review/dismiss */
export function dismissGuidelineReview(id: string): Promise<{ ok: true; id: string }> {
  return resolve({ ok: true as const, id });
}

/** GET /api/checklists/:id/guidelines */
export function getGuidelines(checklistId: string): Promise<Guideline[]> {
  return resolve(fx.GUIDELINES.filter((g) => g.checklistId === checklistId));
}

/** POST /api/checklists */
export function createChecklist(input: NewChecklistInput): Promise<Checklist> {
  return resolve({
    id: 'cl_' + Math.random().toString(36).slice(2, 8),
    name: input.name || 'Untitled checklist',
    guidelineCount: 0,
  });
}

/** POST /api/guidelines */
export function createGuideline(input: NewGuidelineInput): Promise<Guideline> {
  return resolve({
    id: 'gl_' + Math.random().toString(36).slice(2, 8),
    checklistId: input.checklistId,
    segment: input.segment,
    segmentLabel: { opening: 'Call Opening', body: 'Call Body', closing: 'Call Closing' }[input.segment],
    name: input.name || 'Untitled guideline',
    createdBy: 'Vignesh Shanbhag',
    critical: input.critical,
    enabled: input.enabled,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
}

/** POST /api/auth/request-code  and  POST /api/auth/verify */
export function requestLoginCode(email: string): Promise<{ ok: true; email: string }> {
  return resolve({ ok: true as const, email });
}
export function verifyLoginCode(code: string): Promise<{ ok: boolean }> {
  return resolve({ ok: code.replace(/\D/g, '').length === 6 });
}
