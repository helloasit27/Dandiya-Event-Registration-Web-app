/**
 * The design's inline SVGs, lifted verbatim. All share the same stroke
 * treatment, so they take size/colour from props and everything else is fixed.
 */

type IconProps = {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

function Svg({
  size = 18,
  stroke = "currentColor",
  strokeWidth = 2,
  children,
  className,
  style,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.5}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.5}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const Calendar = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const Pin = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </Svg>
);

export const Minus = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.5}>
    <path d="M5 12h14" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.5}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Svg>
);

export const Lock = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const Alert = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </Svg>
);

export const ExternalLink = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.4}>
    <path d="M7 17L17 7M9 7h8v8" />
  </Svg>
);

export const Play = ({ size = 24, fill = "#2b0a30" }: { size?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/* Highlight-card icons, keyed by the `icon` field in the event data. */
export const HighlightIcon = ({ name, ...p }: IconProps & { name: string }) => {
  switch (name) {
    case "dj":
      return (
        <Svg {...p}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </Svg>
      );
    case "dhol":
      return (
        <Svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10v4M12 8v8M16 10v4" />
        </Svg>
      );
    case "gift":
      return (
        <Svg {...p}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13M5 12v9h14v-9" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
        </Svg>
      );
    case "mascot":
      return (
        <Svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </Svg>
      );
    case "food":
      return (
        <Svg {...p}>
          <path d="M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2M7 2v20M17 2v20M17 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </Svg>
      );
    default:
      return (
        <Svg {...p}>
          <path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1M8 21h8M10 17h4a4 4 0 1 0-4 0z" />
        </Svg>
      );
  }
};
