/** Inline icon set. 16px grid, 1.5 stroke, currentColor. */
type P = { className?: string; size?: number };

const base = (size = 16) => ({
  width: size, height: size, viewBox: '0 0 16 16', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, 'aria-hidden': true,
});

export const ChevronRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 3.5 10.5 8 6 12.5" /></svg>
);
export const ChevronDown = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3.5 6 8 10.5 12.5 6" /></svg>
);
export const ChevronLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M10 3.5 5.5 8 10 12.5" /></svg>
);
export const Search = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="7.2" cy="7.2" r="4.2" /><path d="m10.4 10.4 3 3" /></svg>
);
export const Close = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 4l8 8M12 4l-8 8" /></svg>
);
export const Play = ({ className, size }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><path d="M5.5 3.8 12 8l-6.5 4.2z" /></svg>
);
export const Pause = ({ className, size }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><rect x="4.5" y="4" width="2.5" height="8" rx="0.6" /><rect x="9" y="4" width="2.5" height="8" rx="0.6" /></svg>
);
export const Dots = ({ className, size }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none"><circle cx="8" cy="3.5" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="8" cy="12.5" r="1.2" /></svg>
);

/** Nav rail glyphs, in the order the DS menu lists them. */
export const NavDashboard = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><rect x="2.5" y="3" width="15" height="14" rx="2" /><path d="M2.5 8h15M8 8v9" /></svg>
);
export const NavAgentPerf = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><rect x="2.5" y="3" width="15" height="14" rx="2" /><path d="M6 13V9M10 13V7M14 13v-2.5" /></svg>
);
export const NavCalls = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><path d="M4.2 3.5h3l1.3 3.2-1.7 1.2a9.5 9.5 0 0 0 4.3 4.3l1.2-1.7 3.2 1.3v3a1.2 1.2 0 0 1-1.3 1.2A13 13 0 0 1 3 4.8a1.2 1.2 0 0 1 1.2-1.3z" /></svg>
);
export const NavAgents = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><path d="M3.5 12v-2a6.5 6.5 0 1 1 13 0v2" /><rect x="2.5" y="11" width="3.2" height="5" rx="1.4" /><rect x="14.3" y="11" width="3.2" height="5" rx="1.4" /></svg>
);
export const NavGuidelines = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M6.5 7.5h7M6.5 10.5h7M6.5 13.5h4" /></svg>
);
export const NavGuidelinePerf = ({ className, size = 20 }: P) => (
  <svg {...base(size)} viewBox="0 0 20 20" className={className}><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M3 13.5 7.5 9l3 3L17 5.5" /></svg>
);
