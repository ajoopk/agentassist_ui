/**
 * Figma: Rewamp / 09 — Create and Manage Guidelines, plus the
 * 10 — New checklist and 11 — New guideline dialogs.
 */
import { useEffect, useState } from 'react';
import * as api from '../data/api';
import type { CallSegment, Checklist, Guideline } from '../data/types';
import {
  Badge, Button, Checkbox, Dialog, EmptyState, Input, SectionHeading, Select, Textarea, Toggle, cn,
} from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { Dots } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';
import { shortDate } from '../lib/format';

export default function Guidelines() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [activeId, setActiveId] = useState('aidet');
  const [rows, setRows] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<null | 'checklist' | 'guideline'>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { api.getChecklists().then(setChecklists); }, []);
  useEffect(() => {
    setLoading(true);
    api.getGuidelines(activeId).then((g) => { setRows(g); setLoading(false); });
  }, [activeId]);

  const active = checklists.find((c) => c.id === activeId);

  return (
    <Page>
      <PageHeader
        title="Create and Manage Guidelines"
        right={<>
          <Button size="md">Import guidelines</Button>
          <Button size="md">Evaluate guidelines</Button>
          <Button size="md" onClick={() => setDialog('guideline')}>Create new guideline</Button>
        </>}
      />

      {toast && (
        <div className="mb-4 rounded border border-line bg-subtle px-4 py-3 text-sm text-ink" role="status">{toast}</div>
      )}

      <div className="flex flex-wrap items-start gap-4">
        <div className="w-[300px] shrink-0 rounded-card border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading>Checklists</SectionHeading>
            <Button size="sm" onClick={() => setDialog('checklist')}>Create</Button>
          </div>
          <div className="space-y-0.5">
            {checklists.map((c) => (
              <button
                key={c.id} onClick={() => setActiveId(c.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded px-2.5 py-2.5 text-left',
                  c.id === activeId ? 'bg-subtle' : 'hover:bg-subtle/60',
                )}
              >
                <span className={cn('flex-1 text-sm text-ink', c.id === activeId && 'font-medium')}>{c.name}</span>
                <span className="text-sm text-muted">{c.guidelineCount}</span>
                <Dots className="text-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-[640px] flex-1">
          <div className="mb-3 flex items-center gap-2.5">
            <SectionHeading>{active?.name ?? 'Checklist'}</SectionHeading>
            <span className="text-sm text-muted">{rows.length} guidelines</span>
          </div>
          <TableShell>
            <THead tinted>
              <TH width={120}>Segment</TH>
              <TH width={400}>Guideline</TH>
              <TH width={180}>Created by</TH>
              <TH width={100}>Critical</TH>
              <TH width={120}>Status</TH>
              <TH width={140}>Updated on</TH>
              <TH width={50} />
            </THead>
            <tbody>
              {loading && <tr><td colSpan={7}><EmptyState message="Loading guidelines…" /></td></tr>}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={7}><EmptyState message="This checklist has no guidelines yet." /></td></tr>
              )}
              {!loading && rows.map((g, i) => (
                <TR key={g.id} last={i === rows.length - 1}>
                  <TD className="text-[13px] text-muted">{g.segmentLabel}</TD>
                  <TD className="font-medium">{g.name}</TD>
                  <TD>{g.createdBy}</TD>
                  <TD className="text-muted">{g.critical ? 'Yes' : 'No'}</TD>
                  <TD><Badge>{g.enabled ? 'Enabled' : 'Disabled'}</Badge></TD>
                  <TD className="text-muted">{shortDate(g.updatedAt)}</TD>
                  <TD align="right"><Dots className="text-muted" /></TD>
                </TR>
              ))}
            </tbody>
          </TableShell>
        </div>
      </div>

      <NewChecklistDialog
        open={dialog === 'checklist'} onClose={() => setDialog(null)}
        onCreated={(name) => {
          setChecklists((cs) => [...cs, { id: 'new_' + cs.length, name, guidelineCount: 0 }]);
          setToast(`Checklist “${name}” created.`); setDialog(null);
        }}
      />
      <NewGuidelineDialog
        open={dialog === 'guideline'} onClose={() => setDialog(null)} checklists={checklists} defaultChecklist={activeId}
        onCreated={(g) => {
          setRows((r) => (g.checklistId === activeId ? [...r, g] : r));
          setToast(`Guideline “${g.name}” saved.`); setDialog(null);
        }}
      />
    </Page>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function NewChecklistDialog({
  open, onClose, onCreated,
}: { open: boolean; onClose: () => void; onCreated: (name: string) => void }) {
  const [name, setName] = useState('');
  const [critical, setCritical] = useState(false);
  const [alert, setAlert] = useState(false);

  return (
    <Dialog
      open={open} onClose={onClose} title="New checklist"
      footer={<>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!name.trim()}
          onClick={async () => { const c = await api.createChecklist({ name, callTypes: [], teams: [], description: '', evaluationCriteria: '', critical, generateAlert: alert }); onCreated(c.name); setName(''); }}>
          Create checklist
        </Button>
      </>}
    >
      <Field label="Checklist name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Post-discharge follow-up" />
      </Field>
      <div className="flex gap-4">
        <Field label="Call types"><Input placeholder="Add a call type…" /></Field>
        <Field label="Teams"><Input placeholder="Select a call type first…" /></Field>
      </div>
      <Field label="Description"><Textarea rows={2} placeholder="What this checklist covers and when it applies." /></Field>
      <Field label="Evaluation criteria"><Textarea rows={3} placeholder="How the evaluator should judge these guidelines." /></Field>
      <div className="flex gap-6">
        <Checkbox label="Critical" checked={critical} onChange={(e) => setCritical(e.target.checked)} />
        <Checkbox label="Generate alert" checked={alert} onChange={(e) => setAlert(e.target.checked)} />
      </div>
      {(critical || alert) && (
        <div className="rounded border border-destructive px-3.5 py-3 text-[13px] text-destructive">
          Critical and Generate alert apply to every guideline in this checklist and overwrite any per-guideline settings when saved.
        </div>
      )}
    </Dialog>
  );
}

function NewGuidelineDialog({
  open, onClose, onCreated, checklists, defaultChecklist,
}: {
  open: boolean; onClose: () => void; onCreated: (g: Guideline) => void;
  checklists: Checklist[]; defaultChecklist: string;
}) {
  const [name, setName] = useState('');
  const [checklistId, setChecklistId] = useState(defaultChecklist);
  const [segment, setSegment] = useState<CallSegment>('opening');
  const [weight, setWeight] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [critical, setCritical] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => setChecklistId(defaultChecklist), [defaultChecklist]);

  return (
    <Dialog
      open={open} onClose={onClose} title="New guideline"
      footer={<>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!name.trim()}
          onClick={async () => {
            const g = await api.createGuideline({ name, checklistId, segment, weight, enabled, instructions, critical, generateAlert: alert });
            onCreated(g); setName(''); setInstructions('');
          }}>
          Save guideline
        </Button>
      </>}
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Red Flag Symptom Recognized" />
      </Field>
      <div className="flex gap-4">
        <div className="flex-1"><Field label="Checklist">
          <Select value={checklistId} onChange={(e) => setChecklistId(e.target.value)}>
            {checklists.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field></div>
        <div className="flex-1"><Field label="Segment">
          <Select value={segment} onChange={(e) => setSegment(e.target.value as CallSegment)}>
            <option value="opening">Call Opening</option>
            <option value="body">Call Body</option>
            <option value="closing">Call Closing</option>
          </Select>
        </Field></div>
        <div className="w-[90px]"><Field label="Weight">
          <Input type="number" min={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        </Field></div>
      </div>
      <Toggle checked={enabled} onChange={setEnabled} label="Enabled" />
      <Field label="Instructions">
        <Textarea rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)}
          placeholder="Tell the evaluator exactly what counts as meeting this guideline, and what does not." />
      </Field>
      <div className="flex gap-6">
        <Checkbox label="Critical" checked={critical} onChange={(e) => setCritical(e.target.checked)} />
        <Checkbox label="Generate alert" checked={alert} onChange={(e) => setAlert(e.target.checked)} />
      </div>
    </Dialog>
  );
}
