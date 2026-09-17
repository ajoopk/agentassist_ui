/** Figma: Rewamp / 07 and 08 — Guideline Performance (collapsed and expanded row) */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../data/api';
import type { DateRange, GuidelineHealth, GuidelinePerformanceRow, GuidelineReview } from '../data/types';
import { Badge, Button, EmptyState, MetricCard, SearchInput, Select } from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { ChevronDown, ChevronRight } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';

const HEALTH: Record<GuidelineHealth, { label: string; variant: 'secondary' | 'destructive' | 'outline' }> = {
  positive: { label: 'Positive', variant: 'secondary' },
  'needs-attention': { label: 'Needs attention', variant: 'destructive' },
  'insufficient-data': { label: 'Insufficient data', variant: 'outline' },
};

export default function GuidelinePerformance() {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | null>(null);
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<GuidelinePerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>('gp1');
  const [review, setReview] = useState<GuidelineReview | null>(null);

  useEffect(() => { api.getDateRange().then(setRange); }, []);
  useEffect(() => {
    setLoading(true);
    api.getGuidelinePerformance(search).then((r) => { setRows(r); setLoading(false); });
  }, [search]);
  useEffect(() => {
    if (!openId) { setReview(null); return; }
    api.getGuidelineReview(openId).then(setReview);
  }, [openId]);

  return (
    <Page>
      <PageHeader
        title="Guideline Performance"
        left={<Select className="w-[210px]" aria-label="Date range"><option>{range?.label ?? 'Loading…'}</option></Select>}
      />

      <div className="mb-5 flex gap-4">
        <MetricCard label="Guidelines evaluated" value="38" sub="Across 3 checklists" />
        <MetricCard label="Review recommended" value="3" sub="Strong evidence" emphasis />
        <MetricCard label="Insufficient data" value="4" sub="More evidence needed" />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchInput className="w-[420px]" placeholder="Search guideline" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select className="w-[170px]" aria-label="Checklist"><option>All checklists</option></Select>
          <Select className="w-[150px]" aria-label="Type"><option>All types</option></Select>
          <Select className="w-[200px]" aria-label="Recommendation"><option>All recommendations</option></Select>
        </div>
      </div>

      <TableShell>
        <THead>
          <TH width={640}>Guideline</TH>
          <TH width={180}>Adherence</TH>
          <TH width={200}>Status</TH>
          <TH width={259} />
        </THead>
        <tbody>
          {loading && <tr><td colSpan={4}><EmptyState message="Loading guidelines…" /></td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan={4}><EmptyState message="No guidelines match that search." /></td></tr>}
          {!loading && rows.map((g, i) => {
            const open = openId === g.id;
            const showPanel = open && review && review.guideline.id === g.id;
            return [
              <TR key={g.id} onClick={() => setOpenId(open ? null : g.id)} last={i === rows.length - 1 && !showPanel}>
                <TD>
                  <div className="flex items-center gap-3">
                    {open ? <ChevronDown className="text-muted" /> : <ChevronRight className="text-muted" />}
                    <div>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-xs text-muted">{g.checklistName}</div>
                    </div>
                  </div>
                </TD>
                <TD>
                  <div className="font-medium">{g.adherence}%</div>
                  <div className="text-xs text-muted">{g.calls} calls</div>
                </TD>
                <TD><Badge variant={HEALTH[g.health].variant}>{HEALTH[g.health].label}</Badge></TD>
                <TD align="right">
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/guideline-performance/${g.id}`); }}>Review</Button>
                </TD>
              </TR>,
              showPanel && (
                <tr key={g.id + '-panel'} className={i === rows.length - 1 ? '' : 'border-b border-line'}>
                  <td colSpan={4} className="bg-subtle px-4 py-5 pl-12">
                    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-ink">Guideline evaluated</span><span className="text-muted">·</span>
                        <span className="text-destructive">{review!.criticalMisses} critical misses</span><span className="text-muted">·</span>
                        <span className="text-muted">{g.adherence}% adherence</span><span className="text-muted">·</span>
                        <span className="text-muted">{g.calls} calls</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={(e) => e.stopPropagation()}>Open guideline</Button>
                        <Button size="sm" onClick={(e) => e.stopPropagation()}>View affected calls</Button>
                      </div>
                    </div>
                    <div className="mb-2.5 text-sm font-medium text-ink">Why review is recommended</div>
                    <div className="mb-3.5 flex flex-wrap gap-2">
                      {review!.patterns.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 rounded border border-line bg-white px-3 py-1.5">
                          <span className="text-sm font-medium text-ink">{p.title}</span>
                          <span className="text-sm text-muted">{p.calls} calls</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-1.5 text-sm font-medium text-ink">Suggested improvement</div>
                    <p className="text-sm text-muted">Clarify what qualifies as a red-flag symptom and define explicit escalation criteria.</p>
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </TableShell>
    </Page>
  );
}
