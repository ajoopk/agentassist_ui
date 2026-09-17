/**
 * Design System AQA primitives.
 *
 * Values come from the Figma file "Agent Assist AutoQA Admin", page
 * "Design System AQA". Anything not in the kit is not invented here — notably
 * there is no success or warning colour, so state is carried by badge variant
 * and label, never by hue alone.
 */
import React, { useEffect, useRef } from 'react';
import { ChevronDown, Close, Search } from './icons';

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

/* ---------------------------------------------------------------- Button */

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary/90',
  outline: 'bg-white text-ink border border-line hover:bg-subtle',
  ghost: 'bg-transparent text-ink hover:bg-subtle',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
};
const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-8 text-sm',
};

export function Button({
  variant = 'outline', size = 'md', className, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        BUTTON_VARIANT[variant], BUTTON_SIZE[size], className,
      )}
    />
  );
}

/* ----------------------------------------------------------------- Badge */

type BadgeVariant = 'secondary' | 'destructive' | 'outline' | 'solid';
const BADGE_VARIANT: Record<BadgeVariant, string> = {
  secondary: 'bg-subtle text-ink',
  destructive: 'bg-destructive text-white',
  outline: 'border border-line text-muted',
  solid: 'bg-primary text-primary-fg',
};

export function Badge({
  variant = 'secondary', className, ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        BADGE_VARIANT[variant], className,
      )}
    />
  );
}

/* ----------------------------------------------------------- Input/Select */

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-10 w-full rounded border border-line bg-white px-3 text-sm text-ink',
        'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
        className,
      )}
    />
  );
}

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <Input {...props} className="pl-9" />
    </div>
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded border border-line bg-white px-3 py-2.5 text-sm text-ink',
        'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
        className,
      )}
    />
  );
}

export function Select({
  className, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select
        {...props}
        className={cn(
          'h-10 w-full appearance-none rounded border border-line bg-white pl-3 pr-9 text-sm text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
}

export function Checkbox({
  label, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 cursor-pointer rounded-[4px] border-line text-primary focus-visible:ring-2 focus-visible:ring-ink"
      />
      {label}
    </label>
  );
}

export function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded"
    >
      <span className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-line')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </span>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ Card */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('rounded-card border border-line bg-white shadow-card', className)} />;
}

/** The DS "Card for Metrics" surface: filled, no border. */
export function MetricCard({
  label, value, sub, emphasis,
}: { label: string; value: string; sub?: string; emphasis?: boolean }) {
  return (
    <div className="flex-1 rounded-card bg-subtle px-5 py-4 shadow-card">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className={cn('text-3xl font-semibold -tracking-[0.75px]', emphasis ? 'text-destructive' : 'text-ink')}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Tabs */

export function Tabs<T extends string>({
  value, onChange, options, className,
}: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[]; className?: string;
}) {
  return (
    <div className={cn('inline-flex rounded bg-subtle p-1', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 whitespace-nowrap rounded-[4px] px-3 py-1.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
            value === o.value ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Dialog */

export function Dialog({
  open, onClose, title, children, footer, width = 620,
}: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode; width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector<HTMLElement>('input,textarea,button')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 p-4" onMouseDown={onClose}>
      <div
        ref={ref} role="dialog" aria-modal="true" aria-label={title}
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto rounded-card border border-line bg-white p-6 shadow-dialog"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-muted hover:bg-subtle hover:text-ink">
            <Close />
          </button>
        </div>
        <div className="space-y-5">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Pagination */

export function Pagination({
  page, pageCount, onChange,
}: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null;
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i <= 4 || i === pageCount) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return (
    <nav className="flex items-center justify-end gap-1" aria-label="Pagination">
      <Button variant="ghost" size="md" disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</Button>
      {pages.map((p, i) =>
        p === '…'
          ? <span key={'e' + i} className="grid h-10 w-10 place-items-center text-sm text-muted">…</span>
          : <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'h-10 w-10 rounded text-sm font-medium',
                p === page ? 'border border-line bg-white text-ink' : 'text-muted hover:bg-subtle hover:text-ink',
              )}
            >{p}</button>,
      )}
      <Button variant="ghost" size="md" disabled={page === pageCount} onClick={() => onChange(page + 1)}>Next</Button>
    </nav>
  );
}

/* ----------------------------------------------------------------- Misc */

export function Avatar({ name, size = 32, tone = 'subtle' }: { name: string; size?: number; tone?: 'subtle' | 'white' }) {
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span
      style={{ width: size, height: size, fontSize: size <= 32 ? 12 : 14 }}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-medium text-muted',
        tone === 'white' ? 'border border-line bg-white' : 'bg-subtle',
      )}
    >{initials}</span>
  );
}

export function ProgressBar({ value, weak }: { value: number; weak?: boolean }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
      <div
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        className={cn('h-full rounded-full', weak ? 'bg-destructive' : 'bg-primary')}
      />
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-ink">{children}</h2>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="px-4 py-14 text-center text-sm text-muted">{message}</div>;
}
