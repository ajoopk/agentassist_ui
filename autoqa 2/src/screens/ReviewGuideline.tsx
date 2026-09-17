/** Figma: Rewamp / 09 — Review guideline detail */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../data/api';
import type { GuidelineReview } from '../data/types';
import { Badge, Button, Card, SectionHeading, Textarea, cn } from '../components/ui';
import { ChevronLeft } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';
import { shortDate } from '../lib/format';

export default function ReviewGuideline() {
  const { guidelineId = 'gp1' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<GuidelineReview | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [outcome, setOutcome] = useState<'open' | 'applied' | 'dismissed'>('open');

  useEffect(() => {
    api.getGuidelineReview(guidelineId).then((d) => { setData(d); setDraft(d?.proposedInstruction ?? ''); });
  }, [guidelineId]);

  if (!data) return <Page><p className="text-sm text-muted">Loading guideline…</p></Page>;
  const g = data.guideline;

  return (
    <Page>
      <PageHeader
        breadcrumb={<><button onClick={() => navigate('/guideline-performance')} className="hover:text-ink hover:underline">Guideline Performance</button><span>/</span><span className="font-medium text-ink">Review guideline</span></>}
        title="Review guideline"
        back={<Button size="md" onClick={() => navigate('/guideline-performance')}><ChevronLeft />Back</Button>}
        right={<Button size="md">View affected calls</Button>}
      />

      <div className="flex flex-wrap items-center gap-6 rounded-card bg-subtle p-5 shadow-card">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-card border border-line bg-white text-muted">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M6.5 7.5h7M6.5 10.5h7M6.5 13.5h4" /></svg>
          </span>
          <div>
            <div className="text-2xl font-semibold text-ink">{g.name}</div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{g.checklistName}</span><span>·</span>
              <span>{data.critical ? 'Critical guideline' : 'Standard guideline'}</span><span>·</span>
              <span>{g.calls} calls in range</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-medium text-muted">Critical misses</div>
            <div className="text-3xl font-semibold text-destructive">{data.criticalMisses}</div>
            <div className="text-xs text-muted">In {g.calls} calls evaluated</div>
          </div>
          <div className="border-l border-line pl-6 text-right">
            <div className="text-sm font-medium text-muted">Adherence</div>
            <div className="text-3xl font-semibold text-ink">{g.adherence}%</div>
            <div className="text-xs text-muted">Checklist average {data.checklistAvgAdherence}%</div>
          </div>
        </div>
      </div>

      {outcome !== 'open' && (
        <div className="mt-4 rounded border border-line bg-subtle px-4 py-3 text-sm text-ink" role="status">
          {outcome === 'applied'
            ? 'Revision applied. The updated wording takes effect on the next evaluation run.'
            : 'Review dismissed. This guideline stays as it is and will be re-evaluated next period.'}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="min-w-[560px] flex-1 space-y-4">
          <Card className="p-5">
            <SectionHeading>Why review is recommended</SectionHeading>
            <p className="mt-1 text-sm text-muted">
              Two patterns explain {data.patterns.reduce((n, p) => n + p.calls, 0)} of the {data.criticalMisses} critical misses on this guideline.
            </p>
            {data.patterns.map((p, i) => (
              <div key={p.id} className={cn('mt-4 space-y-2.5', i > 0 && 'border-t border-line pt-4')}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-ink">{i + 1}. {p.title}</span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-ink">{p.calls} calls</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{Math.round(p.shareOfMisses * 100)}% of misses</span>
                  </span>
                </div>
                <div className="rounded bg-subtle px-4 py-3.5">
                  <p className="text-sm text-ink">{p.quote}</p>
                  <p className="mt-1 text-xs text-muted">{p.quoteAttribution}</p>
                </div>
                <button className="text-sm font-medium text-ink underline underline-offset-2">View {p.calls} calls</button>
              </div>
            ))}
          </Card>

          <Card className="p-5">
            <SectionHeading>Suggested revision</SectionHeading>
            <p className="mt-1 text-sm text-muted">Rewritten to close both patterns above. Nothing is applied until you confirm.</p>

            <div className="mt-4 rounded bg-subtle px-4 py-3.5">
              <div className="text-xs font-medium uppercase tracking-wide text-muted">Current instruction</div>
              <p className="mt-2 text-sm text-ink">{data.currentInstruction}</p>
            </div>

            <div className="mt-4 rounded border border-ink px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wide text-muted">Proposed instruction</div>
                <button onClick={() => setEditing((v) => !v)} className="text-[13px] font-medium text-ink underline underline-offset-2">
                  {editing ? 'Done' : 'Edit'}
                </button>
              </div>
              {editing
                ? <Textarea className="mt-2" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
                : <p className="mt-2 text-sm text-ink">{draft}</p>}
            </div>

            <div className="mt-4 text-sm font-medium text-ink">What changes</div>
            <div className="mt-2 space-y-2">
              {data.whatChanges.map((c, i) => (
                <div key={i} className="flex gap-2.5 text-sm text-muted"><span>•</span><p>{c}</p></div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button onClick={() => { api.dismissGuidelineReview(g.id); setOutcome('dismissed'); }} disabled={outcome !== 'open'}>Dismiss</Button>
              <Button onClick={() => setEditing(true)} disabled={outcome !== 'open'}>Edit revision</Button>
              <Button variant="primary" onClick={() => { api.applyGuidelineRevision(g.id); setOutcome('applied'); }} disabled={outcome !== 'open'}>
                Apply revision
              </Button>
            </div>
          </Card>
        </div>

        <Card className="w-[320px] shrink-0 p-5">
          <SectionHeading>Guideline details</SectionHeading>
          <dl className="mt-3 space-y-3.5">
            <Field label="Checklist" value={g.checklistName} />
            <Field label="Segment" value={{ opening: 'Call Opening', body: 'Call Body', closing: 'Call Closing' }[data.segment]} />
            <Field label="Critical" value={data.critical ? 'Yes' : 'No'} emphasis={data.critical} />
            <Field label="Status" value={data.enabled ? 'Enabled' : 'Disabled'} />
            <Field label="Created by" value={data.createdBy} />
            <Field label="Last updated" value={shortDate(data.updatedAt)} />
          </dl>
          <div className="mt-4 border-t border-line pt-4">
            <div className="text-xs text-muted">Affected calls</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="destructive">{data.criticalMisses} critical</Badge>
              <span className="text-sm text-muted">of {g.calls} evaluated</span>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}

function Field({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn('text-sm font-medium', emphasis ? 'text-destructive' : 'text-ink')}>{value}</dd>
    </div>
  );
}
