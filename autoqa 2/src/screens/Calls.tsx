/** Figma: Rewamp / 02 — Calls Expanded list */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../data/api';
import type { CallExpansion, CallsQuery, CallSummary, Checklist, DateRange } from '../data/types';
import { Badge, Button, EmptyState, MetricCard, Pagination, SearchInput, Select, cn } from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { ChevronDown, ChevronRight } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';
import { callTime, mmss, pct } from '../lib/format';

export default function Calls() {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | null>(null);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [query, setQuery] = useState<CallsQuery>({ search: '', risk: 'all', checklistId: 'all', score: 'any', page: 1, pageSize: 8 });
  const [rows, setRows] = useState<CallSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>('c1');
  const [expansion, setExpansion] = useState<CallExpansion | null>(null);

  useEffect(() => { api.getDateRange().then(setRange); api.getChecklists().then(setChecklists); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getCalls(query).then((res) => {
      if (cancelled) return;
      setRows(res.rows); setTotal(res.total); setLoading(false);
    });
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    if (!openId) { setExpansion(null); return; }
    api.getCallExpansion(openId).then(setExpansion);
  }, [openId]);

  const pageCount = Math.max(1, Math.ceil(total / (query.pageSize ?? 8)));
  const set = (patch: Partial<CallsQuery>) => setQuery((q) => ({ ...q, ...patch, page: patch.page ?? 1 }));

  const metrics = useMemo(() => ([
    { label: 'Calls Evaluated', value: '243', sub: '12 still queued' },
    { label: 'Auto-failed Calls', value: '6', sub: '2.5% of the calls', emphasis: true },
    { label: 'Critical Misses', value: '9', sub: 'Across 6 calls · 2 agents' },
    { label: 'Average Quality Score', value: '61%', sub: 'Excludes auto-failed calls' },
  ]), []);

  return (
    <Page>
      <PageHeader
        title="Calls"
        left={
          <Select className="w-[210px]" defaultValue="range" aria-label="Date range">
            <option value="range">{range?.label ?? 'Loading…'}</option>
            <option value="prev">Aug 19 – Aug 25, 2026</option>
          </Select>
        }
      />

      <div className="mb-5 flex gap-4">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          className="w-[420px]" placeholder="Search agent name or ID"
          value={query.search} onChange={(e) => set({ search: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <Select className="w-[150px]" value={query.risk} onChange={(e) => set({ risk: e.target.value as CallsQuery['risk'] })} aria-label="Risk">
            <option value="all">Risk: All</option>
            <option value="auto-fail">Auto-failed</option>
            <option value="critical">Has critical miss</option>
            <option value="passed">Passed</option>
          </Select>
          <Select className="w-[170px]" value={query.checklistId} onChange={(e) => set({ checklistId: e.target.value })} aria-label="Checklist">
            <option value="all">Checklist</option>
            {checklists.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select className="w-[150px]" value={query.score} onChange={(e) => set({ score: e.target.value as CallsQuery['score'] })} aria-label="Score">
            <option value="any">Any score</option>
            <option value="lt50">Below 50%</option>
            <option value="50-79">50–79%</option>
            <option value="gte80">80% and above</option>
          </Select>
        </div>
      </div>

      <TableShell>
        <THead>
          <TH width={300}>Call</TH>
          <TH width={195}>Agent</TH>
          <TH width={175}>Date and Time</TH>
          <TH width={130}>Critical</TH>
          <TH width={145}>Guidelines missed</TH>
          <TH width={100}>Score</TH>
          <TH width={100}>Duration</TH>
          <TH width={134} />
        </THead>
        <tbody>
          {loading && <tr><td colSpan={8}><EmptyState message="Loading calls…" /></td></tr>}
          {!loading && rows.length === 0 && (
            <tr><td colSpan={8}><EmptyState message="No calls match these filters." /></td></tr>
          )}
          {!loading && rows.map((c, i) => {
            const open = openId === c.id;
            return [
              <TR key={c.id} onClick={() => setOpenId(open ? null : c.id)} last={i === rows.length - 1 && !open}>
                <TD>
                  <div className="flex items-center gap-3">
                    {open ? <ChevronDown className="text-muted" /> : <ChevronRight className="text-muted" />}
                    <span className="font-medium">{c.callerName}</span>
                    {c.autoFail && <Badge variant="destructive">Auto fail</Badge>}
                  </div>
                </TD>
                <TD>{c.agentName}</TD>
                <TD>{callTime(c.startedAt)}</TD>
                <TD>
                  {c.criticalMissed > 0
                    ? <Badge variant="destructive">{c.criticalMissed} critical</Badge>
                    : <Badge>Passed</Badge>}
                </TD>
                <TD className={c.guidelinesMissed === 0 ? 'text-muted' : undefined}>
                  {c.guidelinesMissed === 0 ? '0' : `${c.guidelinesMissed} / ${c.guidelinesTotal}`}
                </TD>
                <TD className="font-medium">{pct(c.score, c.score % 1 === 0 && c.score !== 0 ? 1 : 0)}</TD>
                <TD className="text-muted">{mmss(c.durationSec)}</TD>
                <TD align="right">
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/calls/${c.id}`); }}>
                    Review
                  </Button>
                </TD>
              </TR>,
              open && expansion && (
                <tr key={c.id + '-detail'} className={cn(i === rows.length - 1 ? '' : 'border-b border-line')}>
                  <td colSpan={8} className="bg-subtle px-4 py-5 pl-12">
                    <div className="mb-3 flex items-center gap-2 text-sm">
                      <span className="font-medium text-ink">Checklists evaluated</span>
                      <span className="text-muted">·</span>
                      <span className="text-destructive">{expansion.criticalMissed} critical guidelines missed</span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {expansion.checklists.map((cl) => (
                        <div key={cl.checklistId} className="flex items-center gap-2 rounded border border-line bg-white px-3 py-1.5">
                          <span className="text-sm font-medium text-ink">{cl.checklistName}</span>
                          <span className="text-sm text-muted">{cl.missed} of {cl.total} missed</span>
                          {cl.criticalMissed > 0 && <Badge variant="destructive">{cl.criticalMissed} critical</Badge>}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted">Top miss: {expansion.topMiss}</p>
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </TableShell>

      <div className="mt-5">
        <Pagination page={query.page ?? 1} pageCount={Math.max(pageCount, 1)} onChange={(p) => setQuery((q) => ({ ...q, page: p }))} />
      </div>
    </Page>
  );
}
