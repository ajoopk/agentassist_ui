/**
 * Fixtures. Mirrors the data shown in the Figma Rewamp frames so the prototype
 * reads identically to the designs. Replace with real responses via api.ts.
 */
import type {
  Agent, CallSummary, CallDetail, CallExpansion, AgentPerformanceRow, AgentDetail,
  GuidelinePerformanceRow, GuidelineReview, Checklist, Guideline, DateRange,
} from './types';

export const DATE_RANGE: DateRange = {
  from: '2026-08-26', to: '2026-09-01', label: 'Aug 26 – Sep 1, 2026',
};

export const AGENTS: Agent[] = [
  { id: 'AVM0001', name: 'Ramana Avisanigari', email: 'ramana+deaconess@avaamo.com', status: 'active' },
  { id: 'AVM0002', name: 'Vignesh Shanbhag', email: 'vignesh+deaconess@avaamo.com', status: 'active', supervisor: 'Madhav', extension: 'x-2041' },
  { id: 'AVM0003', name: 'Dheeraj Samala', email: 'dheeraj+deaconess@avaamo.com', status: 'active' },
  { id: 'AVM0004', name: 'Nithin Gowda', email: 'nithin+deaconess@avaamo.com', status: 'invited' },
];

export const CHECKLISTS: Checklist[] = [
  { id: 'acrfs', name: 'Access Center Red Flag Symptoms', guidelineCount: 6 },
  { id: 'cts', name: 'CTS Triage QA', guidelineCount: 17 },
  { id: 'aidet', name: 'AIDET Competency Checklist', guidelineCount: 15 },
];

export const CALLS: CallSummary[] = [
  { id: 'c1', callerName: 'Unknown caller', agentId: 'AVM0001', agentName: 'Ramana Avisanigari', startedAt: '2026-09-01T09:38:00', durationSec: 51, autoFail: true, criticalMissed: 4, guidelinesMissed: 14, guidelinesTotal: 32, score: 0 },
  { id: 'c2', callerName: 'Unknown caller', agentId: 'AVM0002', agentName: 'Vignesh Shanbhag', startedAt: '2026-09-01T09:31:00', durationSec: 72, autoFail: true, criticalMissed: 3, guidelinesMissed: 9, guidelinesTotal: 32, score: 0 },
  { id: 'c3', callerName: 'Unknown caller', agentId: 'AVM0002', agentName: 'Vignesh Shanbhag', startedAt: '2026-09-01T09:20:00', durationSec: 184, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 75 },
  { id: 'c4', callerName: 'Unknown caller', agentId: 'AVM0001', agentName: 'Ramana Avisanigari', startedAt: '2026-08-31T23:24:00', durationSec: 280, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 68 },
  { id: 'c5', callerName: 'Unknown caller', agentId: 'AVM0002', agentName: 'Vignesh Shanbhag', startedAt: '2026-08-28T22:22:00', durationSec: 67, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 88 },
  { id: 'c6', callerName: 'Unknown caller', agentId: 'AVM0003', agentName: 'Dheeraj Samala', startedAt: '2026-08-28T21:22:00', durationSec: 93, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 69 },
  { id: 'c7', callerName: 'Unknown caller', agentId: 'AVM0004', agentName: 'Nithin Gowda', startedAt: '2026-08-28T21:05:00', durationSec: 131, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 88 },
  { id: 'c8', callerName: 'Unknown caller', agentId: 'AVM0003', agentName: 'Dheeraj Samala', startedAt: '2026-08-28T20:47:00', durationSec: 112, autoFail: false, criticalMissed: 0, guidelinesMissed: 0, guidelinesTotal: 32, score: 74 },
];

export const CALL_EXPANSIONS: Record<string, CallExpansion> = {
  c1: {
    callId: 'c1', criticalMissed: 4,
    checklists: [
      { checklistId: 'acrfs', checklistName: 'Access Center Red Flag Symptoms', missed: 4, total: 5, criticalMissed: 3 },
      { checklistId: 'cts', checklistName: 'CTS Triage QA', missed: 4, total: 17, criticalMissed: 1 },
      { checklistId: 'aidet', checklistName: 'AIDET Competency Checklist', missed: 4, total: 26, criticalMissed: 0 },
    ],
    topMiss: 'Red Flag Symptom Recognized — caller reported a 103.4°F fever at 00:14 and it was not triaged or escalated.',
  },
  c2: {
    callId: 'c2', criticalMissed: 3,
    checklists: [
      { checklistId: 'acrfs', checklistName: 'Access Center Red Flag Symptoms', missed: 3, total: 5, criticalMissed: 2 },
      { checklistId: 'cts', checklistName: 'CTS Triage QA', missed: 3, total: 17, criticalMissed: 1 },
    ],
    topMiss: 'Patient Identity Verified — date of birth was never confirmed before clinical discussion.',
  },
};

export const CALL_DETAIL: CallDetail = {
  ...CALLS[0],
  segmentScores: { opening: { met: 3, total: 5 }, body: { met: 4, total: 5 }, closing: { met: 0, total: 4 } },
  checklists: [
    {
      id: 'acrfs', name: 'Access Center Red Flag Symptoms', met: 1, total: 5,
      guidelines: [
        { id: 'g1', name: 'Red Flag Symptom Recognized', verdict: 'fail', atSec: 14 },
        { id: 'g2', name: 'Escalated to RN / Triaged as Red Flag', verdict: 'fail', atSec: 31 },
        { id: 'g3', name: 'Correct Priority Assigned', verdict: 'fail', atSec: 38 },
        { id: 'g4', name: 'Correct Specialist / Special-Path Routing', verdict: 'na' },
        { id: 'g5', name: 'Correct Protocol Selected', verdict: 'pass', atSec: 38 },
      ],
    },
    {
      id: 'cts', name: 'CTS Triage QA', met: 4, total: 8,
      guidelines: [
        { id: 'g6', name: 'Clinical Thresholds Gathered', verdict: 'fail', atSec: 22 },
        { id: 'g7', name: 'Patient Identity Verified (Name + DOB)', verdict: 'fail', atSec: 2 },
        { id: 'g8', name: 'Phone / Callback Verified', verdict: 'fail', atSec: 2 },
        { id: 'g9', name: 'Care Advice Recorded', verdict: 'fail', atSec: 47 },
        { id: 'g10', name: 'Reason for Call Captured', verdict: 'pass' },
      ],
    },
  ],
  transcript: [
    { id: 't1', atSec: 2, speaker: 'agent', text: 'Thank you for calling Deaconess Access Center, this is Ramana. How can I help you today?' },
    { id: 't2', atSec: 9, speaker: 'caller', text: "Hi — I've had a fever since last night. It's about 103." },
    { id: 't3', atSec: 14, speaker: 'caller', text: "It went up to 103.4 this morning and I'm feeling really weak and dizzy.", flag: 'Red flag symptom missed' },
    { id: 't4', atSec: 22, speaker: 'agent', text: 'Okay. Let me pull up your account — are you having trouble logging in as well?' },
    { id: 't5', atSec: 31, speaker: 'caller', text: 'No, I just want to know what to do about the fever.' },
    { id: 't6', atSec: 38, speaker: 'agent', text: "Right, I'll get that account unlocked for you. Give me one moment." },
    { id: 't7', atSec: 47, speaker: 'agent', text: "Alright, you're all set. Have a good day." },
  ],
  coaching: {
    overall: 'Ramana Avisanigari was polite, professional, and gathered the basic administrative details — patient name, callback number, PCP, and the reason for the MRI request. The call showed a clinical handling gap when the caller introduced a potentially urgent symptom, marked leg swelling with difficulty walking, and it was not escalated or triaged. The interaction stayed on routine follow-up, with limited clinical probing and no clear disposition guidance.',
    gaps: [
      'The red-flag symptom of severe swelling was acknowledged but not escalated to RN or handled with urgent triage language.',
      'Identity verification was incomplete before clinical discussion because DOB was not confirmed.',
      'No specific care advice or safety guidance was documented for the swelling complaint.',
    ],
    recommendations: [
      { title: 'Escalation and triage', detail: 'Treat new or worsening swelling with mobility impact as a potential red flag and escalate using the clinic’s RN or urgent triage pathway.' },
      { title: 'Identity verification', detail: 'Confirm two identifiers before discussing clinical details, unless the workflow has already verified identity for you.' },
      { title: 'Clinical assessment', detail: 'Ask focused follow-up questions and give clear next-step guidance when symptoms suggest acuity, instead of routing as a routine callback.' },
    ],
  },
};

export const AGENT_PERFORMANCE: AgentPerformanceRow[] = [
  { agentId: 'AVM0004', agentName: 'Nithin Gowda', calls: 42, autoFailCalls: 6, criticalMissed: 9, callsAffected: 6, avgScore: 38 },
  { agentId: 'AVM0003', agentName: 'Dheeraj Samala', calls: 51, autoFailCalls: 2, criticalMissed: 3, callsAffected: 3, avgScore: 54 },
  { agentId: 'AVM0002', agentName: 'Vignesh Shanbhag', calls: 39, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 74 },
  { agentId: 'AVM0001', agentName: 'Ramana Avisanigari', calls: 38, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 88 },
  { agentId: 'AVM0005', agentName: 'Ravi Kumar', calls: 47, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 92 },
  { agentId: 'AVM0006', agentName: 'Tanya Mehta', calls: 48, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 87 },
  { agentId: 'AVM0007', agentName: 'Suresh Patel', calls: 32, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 88 },
  { agentId: 'AVM0008', agentName: 'Priya Desai', calls: 78, autoFailCalls: 0, criticalMissed: 0, callsAffected: 0, avgScore: 89 },
];

export const AGENT_DETAIL: AgentDetail = {
  agent: AGENTS[1],
  criticalFailures: 3,
  callsEvaluated: 16,
  overallScore: 54,
  teamAvgScore: 72,
  summary: 'Performance is below team average, driven mainly by missed identity and callback verification during call openings. Body-of-call performance is comparatively strong.',
  priorityAction: { title: 'Improve the call opening workflow', detail: 'Identity and callback verification account for 11 of 16 misses.' },
  trend: [
    { label: 'Aug 26', score: 72 }, { label: 'Aug 27', score: 80 }, { label: 'Aug 28', score: 64 },
    { label: 'Aug 29', score: 58 }, { label: 'Aug 30', score: 49 }, { label: 'Sep 1', score: 40 },
  ],
  bySegment: [
    { segment: 'opening', label: 'Call opening', score: 37 },
    { segment: 'body', label: 'Body of the call', score: 75 },
    { segment: 'closing', label: 'Call closing', score: 46 },
  ],
  coachingPriorities: [
    { label: 'Identity verification', misses: 11, shareOfCalls: 0.69 },
    { label: 'Call closing', misses: 8, shareOfCalls: 0.50 },
    { label: 'Call opening', misses: 6, shareOfCalls: 0.38 },
  ],
  calls: CALLS,
};

export const GUIDELINE_PERFORMANCE: GuidelinePerformanceRow[] = [
  { id: 'gp1', name: 'Red Flag Symptom Recognized', checklistName: 'Access Center Red Flags', adherence: 61, calls: 243, health: 'needs-attention' },
  { id: 'gp2', name: 'Escalated to RN / Triaged', checklistName: 'Access Center Red Flags', adherence: 55, calls: 243, health: 'needs-attention' },
  { id: 'gp3', name: 'Clinical Thresholds Gathered', checklistName: 'CTS Triage QA', adherence: 58, calls: 180, health: 'needs-attention' },
  { id: 'gp4', name: 'Pharmacy Verified', checklistName: 'CTS Triage QA', adherence: 88, calls: 95, health: 'needs-attention' },
  { id: 'gp5', name: 'Manage Up — Self Expertise', checklistName: 'AIDET Competency', adherence: 17, calls: 231, health: 'insufficient-data' },
  { id: 'gp6', name: 'Commitment to Care (The Promise)', checklistName: 'AIDET Competency', adherence: 34, calls: 231, health: 'insufficient-data' },
  { id: 'gp7', name: 'Care Advice Recorded', checklistName: 'CTS Triage QA', adherence: 71, calls: 180, health: 'needs-attention' },
  { id: 'gp8', name: 'Patient Identity Verified (Name + DOB)', checklistName: 'CTS Triage QA', adherence: 91, calls: 220, health: 'positive' },
  { id: 'gp9', name: 'Phone / Callback Verified', checklistName: 'CTS Triage QA', adherence: 92, calls: 220, health: 'positive' },
];

export const GUIDELINE_REVIEWS: Record<string, GuidelineReview> = {
  gp1: {
    guideline: GUIDELINE_PERFORMANCE[0],
    segment: 'opening', critical: true, enabled: true,
    createdBy: 'Shreshtha Gupta', updatedAt: '2026-08-27',
    criticalMisses: 18, checklistAvgAdherence: 78,
    patterns: [
      { id: 'p1', title: 'Caller described the symptom indirectly', calls: 12, shareOfMisses: 0.67,
        quote: '“It went up to 103.4 this morning and I’m feeling really weak and dizzy.”',
        quoteAttribution: 'Caller · 00:14 · Unknown caller, Sep 1, 9:38 AM' },
      { id: 'p2', title: 'Escalation step was never stated', calls: 6, shareOfMisses: 0.33,
        quote: '“Okay, I’ll make a note of that and someone will get back to you.”',
        quoteAttribution: 'Agent · 02:41 · Unknown caller, Aug 31, 11:24 PM' },
    ],
    currentInstruction: 'Agent recognises red-flag symptoms described by the caller and escalates appropriately.',
    proposedInstruction: 'Agent identifies red-flag symptoms, including those described indirectly through severity, duration or worsening in the caller’s own words. Agent confirms the symptom back to the caller and states the escalation step out loud before the call ends.',
    whatChanges: [
      'Accepts indirect symptom descriptions as qualifying language, covering the 12 calls where the caller never used a clinical term.',
      'Requires the escalation step to be said out loud, covering the 6 calls where it was actioned but never stated.',
      'Leaves the critical flag and scoring weight unchanged.',
    ],
  },
};

const AIDET: [string, string, string, string][] = [
  ['opening', 'Call Opening', 'Positive Energy & Rapport', 'Shreshtha Gupta'],
  ['opening', 'Call Opening', 'Commitment to Care (The Promise)', 'Shreshtha Gupta'],
  ['opening', 'Call Opening', 'Clear Identification (Agent Name)', 'Shreshtha Gupta'],
  ['opening', 'Call Opening', 'Manage Up — Self Expertise', 'Shreshtha Gupta'],
  ['opening', 'Call Opening', 'Professional Greeting', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Manage Up — Team Expertise (on transfer)', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Transparency in Process', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Step-by-Step Guidance', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Respect Patient’s Time (Hold Protocol)', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Provide Communication Updates', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Patient Engagement & Input', 'Shreshtha Gupta'],
  ['body', 'Call Body', 'Called Office / Other Appropriately', 'Nithin Gowda'],
  ['closing', 'Call Closing', 'Appreciation (Thank the Patient)', 'Shreshtha Gupta'],
  ['closing', 'Call Closing', 'Final Offer of Assistance', 'Shreshtha Gupta'],
  ['closing', 'Call Closing', 'Verify Questions or Concerns', 'Shreshtha Gupta'],
];

export const GUIDELINES: Guideline[] = AIDET.map(([segment, segmentLabel, name, createdBy], i) => ({
  id: 'gl' + (i + 1),
  checklistId: 'aidet',
  segment: segment as Guideline['segment'],
  segmentLabel,
  name,
  createdBy,
  critical: false,
  enabled: true,
  updatedAt: createdBy === 'Nithin Gowda' ? '2026-08-28' : '2026-08-27',
}));
