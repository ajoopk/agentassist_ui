/** Table primitives — bordered radius-6 container, 48px header, ruled rows. */
import React from 'react';
import { cn } from './index';

export function TableShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded border border-line bg-white', className)}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function THead({ children, tinted }: { children: React.ReactNode; tinted?: boolean }) {
  return (
    <thead className={cn('border-b border-line', tinted && 'bg-subtle')}>
      <tr className="h-12">{children}</tr>
    </thead>
  );
}

export function TH({
  children, width, align = 'left', className,
}: { children?: React.ReactNode; width?: number; align?: 'left' | 'right'; className?: string }) {
  return (
    <th
      style={width ? { width } : undefined}
      className={cn(
        'px-4 text-sm font-medium text-muted first:pl-4 last:pr-4',
        align === 'right' && 'text-right', className,
      )}
      scope="col"
    >{children}</th>
  );
}

export function TR({
  children, onClick, className, last,
}: { children: React.ReactNode; onClick?: () => void; className?: string; last?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        !last && 'border-b border-line',
        onClick && 'cursor-pointer hover:bg-subtle/60',
        className,
      )}
    >{children}</tr>
  );
}

export function TD({
  children, align = 'left', className,
}: { children?: React.ReactNode; align?: 'left' | 'right'; className?: string }) {
  return (
    <td className={cn('px-4 py-3 align-middle text-sm text-ink', align === 'right' && 'text-right', className)}>
      {children}
    </td>
  );
}
