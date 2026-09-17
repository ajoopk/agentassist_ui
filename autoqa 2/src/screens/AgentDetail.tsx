/** Figma: Rewamp / 06 — Agent Performance detail */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../data/api';
import type { AgentDetail as AgentDetailT, CallSummary } from '../data/types';
import { Badge, Button, Card, EmptyState, ProgressBar, SearchInput, SectionHeading, Select, cn } from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { ChevronLeft, ChevronRight } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';
import { callTime, mmss } from '../lib/format';

export default function AgentDetail() {
  const { agentId = 'AVM0002' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<AgentDetailT | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { api.getAgentDetail(agentId).then(setData); }, [agentId]);
  if (!data) return <Page><p className="text-sm text-muted">Loading agent…</p></Page>;

  const calls = data.calls.filter(
    (c) => !search.trim() || c.agentName.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const maxTrend = Math.max(...data.trend.map((t) => t.score), 100);

  return (
    <Page>
      <PageHeader
        breadcrumb={<><button onClick={() => navigate('/agent-performance')} className="hover:text-ink hover:underline">Agent Performance</button><span>/</span><span className="font-medium text-ink">Agent Details</span></>}
        title="Agent Details"
        back={<Button size="md" onClick={() => navigate('/agent-performance')}><ChevronLeft />Back</Button>}
      />

      <div className="flex flex-wrap items-center gap-6 rounded-card bg-subtle p-5 shadow-card">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-sm font-medium text-muted">
            {data.agent.name.split(' ').map((p) => p[0]).join('')}
          </span>
          <div>
            <div className="text-2xl font-semibold text-ink">{data.agent.name}</div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{data.agent.id}</span><span>·</span>
              <span>Supervisor: {data.agent.supervisor}</span><span>·</span>
              <span>Extension {data.agent.extension}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <Metric label="Critical failures" value={String(data.criticalFailures)} emphasis />
          <Metric label="Calls evaluated" value={String(data.callsEvaluated)} divider />
          <Metric label="Overall score" value={`${data.overallScore}%`} sub={`Team avg ${data.teamAvgScore}%`} divider />
        </div>
      </div>

      <Card className="mt-4 p-5">
        <SectionHeading>Performance summary</SectionHeading>
        <p className="mt-1.5 text-sm text-ink">{data.summary}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
          <Badge>Priority</Badge>
          <span className="text-sm font-medium text-ink">{data.priorityAction.title}</span>
          <span className="text-sm text-muted">{data.priorityAction.detail}</span>
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap items-stretch gap-4">
        <Card className="min-w-[320px] flex-1 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <SectionHeading>Performance trend</SectionHeading>
            <span className="text-[13px] text-muted">18 pts below previous period</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex h-44 flex-col justify-between pb-6 text-xs text-muted">
              {['100%', '80%', '60%', '40%', '20%', '0%'].map((l) => <span key={l}>{l}</span>)}
            </div>
            <div className="flex flex-1 items-end justify-between gap-3">
              {data.trend.map((t) => (
                <div key={t.label} className="flex flex-1 flex-col items-center gap-2">
                  <div style={{ height: (t.score / maxTrend) * 156 }} className="w-[30px] rounded-t bg-primary" title={`${t.score}%`} />
                  <span className="text-xs text-muted">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="min-w-[320px] flex-1 p-5">
          <SectionHeading>Performance by segment</SectionHeading>
          <div className="mt-4 space-y-3.5">
            {data.bySegment.map((s) => {
              const weak = s.score < 60;
              return (
                <div key={s.segment}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-ink">{s.label}</span>
                    <span className={cn('text-sm font-medium', weak ? 'text-destructive' : 'text-ink')}>{s.score}%</span>
                  </div>
                  <ProgressBar value={s.score} weak={weak} />
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[13px] text-muted">
            Call opening is the weakest segment. Identity and callback verification account for 11 of 16 misses.
          </p>
        </Card>

        <Card className="min-w-[320px] flex-1 p-5">
          <SectionHeading>Coaching priorities</SectionHeading>
          <div className="mt-2">
            {data.coachingPriorities.map((p, i) => (
              <div key={p.label} className={cn('flex items-center justify-between py-3', i < data.coachingPriorities.length - 1 && 'border-b border-line')}>
                <span className="flex items-center gap-2.5">
                  <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-subtle text-xs font-medium text-ink">{i + 1}</span>
                  <span className="text-sm text-ink">{p.label}</span>
                </span>
                <span className="text-right">
                  <span className={cn('block text-sm font-medium', i === 0 ? 'text-destructive' : 'text-ink')}>{p.misses} misses</span>
                  <span className="block text-xs text-muted">{Math.round(p.shareOfCalls * 100)}% of calls affected</span>
                </span>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={() => navigate('/guideline-performance')}>View guideline performance</Button>
        </Card>
      </div>

      <div className="mb-4 mt-6 flex flex-wrap items-center justify-between gap-3">
        <SectionHeading>Call details</SectionHeading>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput className="w-[240px]" placeholder="Search calls" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select className="w-[150px]" aria-label="Outcome"><option>Outcome: All</option></Select>
          <Select className="w-[150px]" aria-label="Critical"><option>Critical: All</option></Select>
          <Select className="w-[160px]" aria-label="Checklist"><option>Checklist: All</option></Select>
          <Select className="w-[140px]" aria-label="Score"><option>Score: Any</option></Select>
        </div>
      </div>

      <CallTable calls={calls} onOpen={(id) => navigate(`/calls/${id}`)} />
    </Page>
  );
}

function Metric({ label, value, sub, emphasis, divider }: { label: string; value: string; sub?: string; emphasis?: boolean; divider?: boolean }) {
  return (
    <div className={cn('text-right', divider && 'border-l border-line pl-6')}>
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className={cn('text-3xl font-semibold', emphasis ? 'text-destructive' : 'text-ink')}>{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

function CallTable({ calls, onOpen }: { calls: CallSummary[]; onOpen: (id: string) => void }) {
  return (
    <TableShell>
      <THead>
        <TH width={380}>Call</TH>
        <TH width={220}>Date and Time</TH>
        <TH width={160}>Critical</TH>
        <TH width={170}>Guidelines missed</TH>
        <TH width={120}>Score</TH>
        <TH width={120}>Duration</TH>
        <TH width={110} />
      </THead>
      <tbody>
        {calls.length === 0 && <tr><td colSpan={7}><EmptyState message="No calls match that search." /></td></tr>}
        {calls.map((c, i) => (
          <TR key={c.id} last={i === calls.length - 1} onClick={() => onOpen(c.id)}>
            <TD>
              <div className="flex items-center gap-3">
                <ChevronRight className="text-muted" />
                <span className="font-medium">{c.callerName}</span>
                {c.autoFail && <Badge variant="destructive">Auto fail</Badge>}
              </div>
            </TD>
            <TD>{callTime(c.startedAt)}</TD>
            <TD>{c.criticalMissed > 0 ? <Badge variant="destructive">{c.criticalMissed} critical</Badge> : <Badge>Passed</Badge>}</TD>
            <TD className={c.guidelinesMissed === 0 ? 'text-muted' : undefined}>
              {c.guidelinesMissed === 0 ? '0' : `${c.guidelinesMissed} / ${c.guidelinesTotal}`}
            </TD>
            <TD className="font-medium">{c.score}%</TD>
            <TD className="text-muted">{mmss(c.durationSec)}</TD>
            <TD align="right"><Button size="sm" onClick={(e) => { e.stopPropagation(); onOpen(c.id); }}>Review</Button></TD>
          </TR>
        ))}
      </tbody>
    </TableShell>
  );
}
