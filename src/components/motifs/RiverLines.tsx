import { useMemo } from "react";
import { cn } from "../../lib/cn";

/**
 * Curves hand-tuned so the dash patterns alias into a continuous current.
 * Every `dash` pattern divides the 600px travel defined in the `flow` keyframe
 * evenly, so the animation loops seamlessly.
 */
const CURRENTS = [
  { d: "M-60 92 C 300 30, 720 152, 1500 58", width: 2.4, opacity: 0.75, dash: "540 60", delay: 0 },
  { d: "M-60 148 C 360 88, 660 212, 1500 112", width: 1.5, opacity: 0.5, dash: "420 180", delay: -2.4 },
  { d: "M-60 204 C 320 148, 780 264, 1500 172", width: 1.1, opacity: 0.4, dash: "300 300", delay: -4.8 },
  { d: "M-60 258 C 420 206, 700 316, 1500 234", width: 2.2, opacity: 0.24, dash: "240 60", delay: -7.2 },
];

let instance = 0;

/**
 * Animated flowing-river lines.
 *
 * Sizing and colour are explicit to keep Tailwind classes predictable:
 * pass position/size/opacity through `className` and the stroke colour through
 * `color`. Use inside a positioned container or as a section divider.
 */
export function RiverLines({
  className,
  color = "text-river-400",
  count = CURRENTS.length,
  speed = "slow",
  animated = true,
}: {
  /** Position, size and opacity of the motif (e.g. "absolute inset-x-0 top-6 h-40"). */
  className?: string;
  /** Text-colour utility that drives the stroke colour. */
  color?: string;
  count?: number;
  speed?: "slow" | "slower";
  animated?: boolean;
}) {
  const id = useMemo(() => `river-${(instance += 1)}`, []);
  const animation = speed === "slow" ? "animate-flow" : "animate-flow-slow";

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className={cn("h-full w-full", color)}
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.16" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.84" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect width="1440" height="320" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`}>
          {CURRENTS.slice(0, count).map((curve) => (
            <path
              key={curve.d}
              d={curve.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={curve.width}
              strokeOpacity={curve.opacity}
              strokeLinecap="round"
              strokeDasharray={curve.dash}
              className={animated ? animation : undefined}
              style={animated ? { animationDelay: `${curve.delay}s` } : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * A section-to-section divider: the river leaves one block and arrives at the
 * next, fading out at both ends.
 */
export function FlowDivider({
  className,
  color = "text-river-400",
  flip = false,
}: {
  className?: string;
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-28 w-full overflow-hidden sm:h-36", flip && "rotate-180", className)}
    >
      <RiverLines className="absolute inset-0 opacity-80" color={color} count={4} />
    </div>
  );
}
