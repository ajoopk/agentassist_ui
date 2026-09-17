/**
 * App shell: the navy rail from the DS `menu` pattern plus the content column.
 * The rail collapses to 69px, which is the DS "menu minimized" variant.
 */
import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../ui';
import {
  NavAgentPerf, NavAgents, NavCalls, NavDashboard, NavGuidelinePerf, NavGuidelines,
} from '../ui/icons';

const NAV = [
  { to: '/dashboard', label: 'Team Dashboard', Icon: NavDashboard },
  { to: '/agent-performance', label: 'Agent Performance', Icon: NavAgentPerf },
  { to: '/calls', label: 'Calls', Icon: NavCalls },
  { to: '/agents', label: 'Agents', Icon: NavAgents },
  { to: '/guidelines', label: 'Guidelines', Icon: NavGuidelines },
  { to: '/guideline-performance', label: 'Guideline Performance', Icon: NavGuidelinePerf },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <aside
        className={cn('flex shrink-0 flex-col bg-rail transition-[width] duration-200', collapsed ? 'w-[69px]' : 'w-[232px]')}
        aria-label="Main navigation"
      >
        {/* The logo is the toggle — there is no separate collapse control. */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className={cn(
            'flex items-center gap-3 px-4 pb-6 pt-5 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rail-label',
            collapsed && 'justify-center px-0',
          )}
        >
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#00A9E0] text-[9px] font-semibold tracking-tight text-white transition-opacity hover:opacity-80">
            avaamo
          </span>
          {!collapsed && <span className="text-[13px] font-semibold text-white">Agent Assist</span>}
        </button>

        <nav className="flex flex-col gap-1 px-[7px]">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to} to={to} title={collapsed ? label : undefined}
              className={({ isActive }) => cn(
                'flex h-10 items-center gap-3 rounded-xl text-[13px] font-medium transition-colors',
                collapsed ? 'justify-center px-0' : 'px-2.5',
                isActive ? 'bg-rail-active text-white' : 'text-rail-label hover:bg-rail-active/50',
              )}
            >
              <Icon className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={cn('mt-auto flex items-center gap-3 p-4', collapsed && 'justify-center px-0')}>
          <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-rail-avatar text-[13px] font-semibold text-white">VS</span>
          {!collapsed && <span className="text-[13px] font-medium text-rail-label">Vignesh</span>}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

/** Client mark, top right of every page. */
export function ClientLogo() {
  return (
    <div className="flex h-[27px] w-[101px] items-center justify-center rounded-sm text-[10px] font-bold tracking-[0.14em] text-[#1B3A93]">
      EAGLE HEALTH
    </div>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="px-8 pb-8 pt-7">{children}</div>;
}

export function PageHeader({
  title, back, left, right, breadcrumb,
}: {
  title: string;
  /** Rendered immediately before the title — the Back control on detail screens. */
  back?: React.ReactNode;
  left?: React.ReactNode; right?: React.ReactNode; breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      {breadcrumb && <div className="mb-2 flex items-center gap-2 text-sm text-muted">{breadcrumb}</div>}
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {back}
          <h1 className="text-3xl font-semibold -tracking-[0.75px] text-ink">{title}</h1>
          {left}
        </div>
        <div className="flex items-center gap-4">
          {right}
          <ClientLogo />
        </div>
      </div>
    </div>
  );
}
