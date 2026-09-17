/** Figma: Rewamp / 12 — Agents */
import { useEffect, useMemo, useState } from 'react';
import * as api from '../data/api';
import type { Agent } from '../data/types';
import { Avatar, Badge, EmptyState, SearchInput } from '../components/ui';
import { TableShell, TD, TH, THead, TR } from '../components/ui/table';
import { Dots } from '../components/ui/icons';
import { Page, PageHeader } from '../components/app/AppLayout';

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getAgents().then((a) => { setAgents(a); setLoading(false); }); }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return agents;
    return agents.filter((a) =>
      a.name.toLowerCase().includes(term) || a.id.toLowerCase().includes(term) || a.email.toLowerCase().includes(term));
  }, [agents, search]);

  return (
    <Page>
      <PageHeader title="Agents" />
      <div className="mb-5">
        <SearchInput className="w-[320px]" placeholder="Search agents" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <TableShell>
        <THead tinted>
          <TH width={400}>Agent name</TH>
          <TH width={200}>Agent ID</TH>
          <TH width={420}>Email</TH>
          <TH width={200}>Status</TH>
          <TH width={59} />
        </THead>
        <tbody>
          {loading && <tr><td colSpan={5}><EmptyState message="Loading agents…" /></td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan={5}><EmptyState message="No agents match that search." /></td></tr>}
          {!loading && rows.map((a, i) => (
            <TR key={a.id} last={i === rows.length - 1}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={a.name} />
                  <span className="font-medium">{a.name}</span>
                </div>
              </TD>
              <TD>{a.id}</TD>
              <TD className="text-muted">{a.email}</TD>
              <TD><Badge variant={a.status === 'invited' ? 'outline' : 'secondary'}>{a.status === 'invited' ? 'Invited' : 'Active'}</Badge></TD>
              <TD align="right"><Dots className="text-muted" /></TD>
            </TR>
          ))}
        </tbody>
      </TableShell>
    </Page>
  );
}
