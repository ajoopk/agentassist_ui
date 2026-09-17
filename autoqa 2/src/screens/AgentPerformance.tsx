/** Figma: Rewamp / 05 — Agent Performance */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../data/api';
import type { AgentPerformanceRow, DateRange } from '../data/types';
import { Avatar, Badge, Button, EmptyState, MetricCard, SearchInput, Select } from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { Page, PageHeader } from '../components/app/AppLayout';

export default function AgentPerformance() {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | null>(null);
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<AgentPerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getDateRange().then(setRange); }, []);
  useEffect(() => {
    setLoading(true);
    api.getAgentPerformance(search).then((r) => { setRows(r); setLoading(false); });
  }, [search]);

  return (
    <Page>
      <PageHeader
        title="Agent Performance"
        left={<Select className="w-[210px]" aria-label="Date range"><option>{range?.label ?? 'Loading…'}</option></Select>}
      />

      <div className="mb-5 flex gap-4">
        <MetricCard label="Agents evaluated" value="8" sub="231 calls in range" />
        <MetricCard label="Agents with auto-fails" value="2" sub="of 8 agents" emphasis />
        <MetricCard label="Critical misses" value="9" sub="Ramana 6 · Vignesh 3" />
        <MetricCard label="Average quality score" value="61%" sub="Excludes auto-failed calls" />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchInput className="w-[420px]" placeholder="Search agent name or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select className="w-[150px]" aria-label="Risk"><option>Risk: All</option><option>Has auto-fails</option></Select>
          <Select className="w-[170px]" aria-label="Checklist"><option>Checklist</option></Select>
          <Select className="w-[150px]" aria-label="Score"><option>Any score</option></Select>
        </div>
      </div>

      <TableShell>
        <THead>
          <TH width={400}>Agent</TH>
          <TH width={130}>Calls</TH>
          <TH width={150}>Auto-fail calls</TH>
          <TH width={160}>Critical misses</TH>
          <TH width={170}>Calls affected</TH>
          <TH width={135}>Avg score</TH>
          <TH width={134} />
        </THead>
        <tbody>
          {loading && <tr><td colSpan={7}><EmptyState message="Loading agents…" /></td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan={7}><EmptyState message="No agents match that search." /></td></tr>}
          {!loading && rows.map((r, i) => (
            <TR key={r.agentId} last={i === rows.length - 1} onClick={() => navigate(`/agent-performance/${r.agentId}`)}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={r.agentName} />
                  <div>
                    <div className="font-medium">{r.agentName}</div>
                    <div className="text-xs text-muted">{r.agentId}</div>
                  </div>
                </div>
              </TD>
              <TD>{r.calls}</TD>
              <TD className={r.autoFailCalls === 0 ? 'text-muted' : undefined}>{r.autoFailCalls}</TD>
              <TD>
                {r.criticalMissed > 0
                  ? <Badge variant="destructive">{r.criticalMissed} missed</Badge>
                  : <Badge>None</Badge>}
              </TD>
              <TD className="text-muted">{r.callsAffected > 0 ? `${r.callsAffected} of ${r.calls} calls` : '—'}</TD>
              <TD className="font-medium">{r.avgScore}%</TD>
              <TD align="right">
                <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/agent-performance/${r.agentId}`); }}>Review</Button>
              </TD>
            </TR>
          ))}
        </tbody>
      </TableShell>
    </Page>
  );
}
