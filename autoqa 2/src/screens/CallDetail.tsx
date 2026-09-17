/**
 * Figma: Rewamp / 03 — Calls Details Transcript and 04 — Coaching summary.
 * One screen, two tab states. Call analysis leads on the left; the transcript
 * or coaching column supports it on the right.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../data/api';
import type { CallDetail as CallDetailT, CallSegment, Verdict } from '../data/types';
import { Badge, Button, Card, SectionHeading, Select, Tabs, cn } from '../components/ui';
import { ChevronLeft, ChevronRight, Pause, Play } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';
import { mmss, callTime } from '../lib/format';

const VERDICT: Record<Verdict, { label: string; variant: 'secondary' | 'destructive' | 'outline' }> = {
  pass: { label: 'Pass', variant: 'secondary' },
  fail: { label: 'Fail', variant: 'destructive' },
  na: { label: 'N/A', variant: 'outline' },
};

export default function CallDetail() {
  const { callId = 'c1' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CallDetailT | null>(null);
  const [tab, setTab] = useState<'coaching' | 'transcript'>('transcript');
  const [segment, setSegment] = useState<CallSegment>('body');
  const [openGuideline, setOpenGuideline] = useState<string | null>(null);

  useEffect(() => { api.getCallDetail(callId).then(setData); }, [callId]);

  if (!data) return <Page><p className="text-sm text-muted">Loading call…</p></Page>;

  return (
    <Page>
      <PageHeader
        breadcrumb={<><button onClick={() => navigate('/calls')} className="hover:text-ink hover:underline">Calls</button><span>/</span><span className="font-medium text-ink">Call Details</span></>}
        title="Call Details"
        back={<Button size="md" onClick={() => navigate('/calls')}><ChevronLeft />Back</Button>}
        right={<>
          <Button size="md">Re-evaluate</Button>
          <Button size="md">Export analysis</Button>
        </>}
      />

      <CallSummaryBar data={data} />
      <AudioPlayer durationSec={data.durationSec} />

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <section className="min-w-[520px] flex-1">
          <div className="mb-3 flex items-center justify-between gap-4">
            <SectionHeading>Call analysis</SectionHeading>
            <Select className="w-[180px]" aria-label="Checklist filter">
              <option>All checklists</option>
              {data.checklists.map((c) => <option key={c.id}>{c.name}</option>)}
            </Select>
          </div>

          <Tabs
            className="mb-3 flex w-full"
            value={segment} onChange={setSegment}
            options={(['opening', 'body', 'closing'] as CallSegment[]).map((s) => ({
              value: s,
              label: (
                <span className="flex items-center justify-center gap-2">
                  {{ opening: 'Opening of the call', body: 'Body of the call', closing: 'Call ending' }[s]}
                  <span className="font-normal text-muted">
                    {data.segmentScores[s].met} / {data.segmentScores[s].total}
                  </span>
                </span>
              ),
            }))}
          />

          <div className="space-y-3">
            {data.checklists.map((cl) => (
              <div key={cl.id} className="overflow-hidden rounded border border-line bg-white">
                <div className="flex h-10 items-center justify-between border-b border-line bg-subtle px-4">
                  <span className="text-sm font-medium text-ink">{cl.name}</span>
                  <span className="text-sm text-muted">{cl.met} of {cl.total} met</span>
                </div>
                {cl.guidelines.map((g, i) => {
                  const open = openGuideline === g.id;
                  return (
                    <div key={g.id} className={cn(i < cl.guidelines.length - 1 && 'border-b border-line')}>
                      <button
                        onClick={() => setOpenGuideline(open ? null : g.id)}
                        className="flex h-[46px] w-full items-center justify-between px-4 text-left hover:bg-subtle/60"
                      >
                        <span className="flex items-center gap-3">
                          <ChevronRight className={cn('text-muted transition-transform', open && 'rotate-90')} />
                          <span className="text-sm text-ink">{g.name}</span>
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="w-11 text-right text-[13px] text-muted">{g.atSec != null ? mmss(g.atSec) : ''}</span>
                          <span className="w-14 text-right">
                            <Badge variant={VERDICT[g.verdict].variant}>{VERDICT[g.verdict].label}</Badge>
                          </span>
                        </span>
                      </button>
                      {open && (
                        <div className="bg-subtle px-4 pb-4 pl-11 pt-1 text-sm text-muted">
                          {g.verdict === 'fail'
                            ? 'The evaluator did not find qualifying language for this guideline in the transcript.'
                            : g.verdict === 'na'
                              ? 'Not applicable to this call.'
                              : 'Met — qualifying language found in the transcript.'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="w-[600px] shrink-0">
          <Tabs
            className="mb-4"
            value={tab} onChange={setTab}
            options={[{ value: 'coaching', label: 'Coaching summary' }, { value: 'transcript', label: 'Transcript' }]}
          />
          {tab === 'transcript' ? <Transcript data={data} /> : <Coaching data={data} />}
        </section>
      </div>
    </Page>
  );
}

function CallSummaryBar({ data }: { data: CallDetailT }) {
  const metrics = [
    { label: 'Critical guidelines missed', value: String(data.criticalMissed), emphasis: true },
    { label: 'Total guidelines missed', value: `${data.guidelinesMissed} / ${data.guidelinesTotal}` },
    { label: 'Overall call score', value: `${data.score}%` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-card bg-subtle p-5 shadow-card">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-sm font-medium text-muted">UC</span>
        <div>
          <div className="text-2xl font-semibold text-ink">{data.callerName}</div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>Agent: {data.agentName}</span><span>·</span>
            <span>{callTime(data.startedAt)}</span><span>·</span>
            <span>Duration {mmss(data.durationSec)}</span>
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-6">
        {metrics.map((m, i) => (
          <div key={m.label} className={cn('text-right', i > 0 && 'border-l border-line pl-6')}>
            <div className="text-sm font-medium text-muted">{m.label}</div>
            <div className={cn('text-3xl font-semibold', m.emphasis ? 'text-destructive' : 'text-ink')}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Waveform is generated, not an asset — bars left of the playhead are inked. */
function AudioPlayer({ durationSec }: { durationSec: number }) {
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(3);
  const timer = useRef<number>();

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setAt((t) => (t + 1 >= durationSec ? (setPlaying(false), durationSec) : t + 1));
    }, 1000);
    return () => window.clearInterval(timer.current);
  }, [playing, durationSec]);

  const bars = useMemo(
    () => Array.from({ length: 160 }, (_, i) => 6 + Math.abs(Math.sin(i * 1.7) * 24) + (i % 7) * 1.5),
    [],
  );
  const progress = at / durationSec;

  return (
    <div className="mt-4 flex items-center gap-4 rounded border border-line bg-white px-4 py-2.5">
      <button
        onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-fg"
      >{playing ? <Pause /> : <Play />}</button>
      <span className="w-10 shrink-0 text-[13px] tabular-nums text-muted">{mmss(at)}</span>
      <div
        className="flex h-9 flex-1 cursor-pointer items-center gap-[3px]"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setAt(Math.round(((e.clientX - r.left) / r.width) * durationSec));
        }}
      >
        {bars.map((h, i) => (
          <span key={i} style={{ height: h }} className={cn('w-[2px] shrink-0 rounded-full', i / bars.length <= progress ? 'bg-ink' : 'bg-line')} />
        ))}
      </div>
      <span className="w-10 shrink-0 text-[13px] tabular-nums text-muted">{mmss(durationSec)}</span>
      <span className="flex shrink-0 items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink" />Agent</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" />Caller</span>
      </span>
    </div>
  );
}

function Transcript({ data }: { data: CallDetailT }) {
  return (
    <div className="space-y-[18px]">
      {data.transcript.map((l) => (
        <div key={l.id} className="flex gap-4">
          <span className="w-11 shrink-0 pt-0.5 text-[13px] tabular-nums text-muted">{mmss(l.atSec)}</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className={cn('text-[13px] font-medium', l.speaker === 'agent' ? 'text-ink' : 'text-muted')}>
                {l.speaker === 'agent' ? 'Agent' : 'Caller'}
              </span>
              {l.flag && <Badge variant="destructive">{l.flag}</Badge>}
            </div>
            <p className={cn('text-sm text-ink', l.speaker === 'caller' && 'font-medium')}>{l.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Coaching({ data }: { data: CallDetailT }) {
  const { coaching } = data;
  return (
    <div className="space-y-5">
      <SectionHeading>Overall assessment</SectionHeading>
      <p className="text-sm text-ink">{coaching.overall}</p>
      <div className="space-y-2.5 rounded bg-subtle p-4">
        {coaching.gaps.map((g, i) => (
          <div key={i} className="flex gap-2.5 text-sm text-ink"><span className="text-muted">•</span><p>{g}</p></div>
        ))}
      </div>
      <SectionHeading>Recommendations</SectionHeading>
      <div className="space-y-3">
        {coaching.recommendations.map((r, i) => (
          <div key={r.title} className="flex gap-3">
            <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-subtle text-xs font-medium text-ink">{i + 1}</span>
            <div>
              <div className="text-sm font-medium text-ink">{r.title}</div>
              <p className="text-sm text-muted">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Card };
