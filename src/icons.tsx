// Small inline-SVG icon set. Replaces text glyphs (✓, →, ☰, ◷, £, ▦, ↗ …)
// that were previously used as icons — those render inconsistently across
// devices/fonts (some render as colour emoji on certain OS/browser
// combinations) and don't scale or align as cleanly as real vector icons.
// All icons use currentColor so they inherit whatever color context they're
// placed in (the blue .icon circles, a white button, dark footer text, etc.)
import type { CSSProperties } from "react";

type IconProps = { size?: number; className?: string; style?: CSSProperties };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconCheck = ({ size = 16, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconArrowRight = ({ size = 16, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconArrowLeft = ({ size = 16, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const IconMenu = ({ size = 22, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const IconClose = ({ size = 22, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const IconClock = ({ size = 20, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

export const IconCoin = ({ size = 20, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 15V9.3a2.3 2.3 0 0 1 4.3-1.1" />
    <line x1="8" y1="12.3" x2="12.7" y2="12.3" />
    <line x1="8.7" y1="15" x2="13.5" y2="15" />
  </svg>
);

export const IconGrid = ({ size = 20, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconTrendingUp = ({ size = 20, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </svg>
);

export const IconChevronDown = ({ size = 14, className, style }: IconProps) => (
  <svg {...base(size)} className={className} style={style} aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
