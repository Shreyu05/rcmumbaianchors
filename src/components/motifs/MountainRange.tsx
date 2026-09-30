import { cn } from "../../lib/cn";

/**
 * Layered mountain ridges.
 *
 * Pass position/size/opacity through `className` and the ridge colour through
 * `color` — keeping Tailwind classes unambiguous (no fighting defaults).
 *
 * `snow` traces each silhouette with a pale stroke, which reads as the snow-lit
 * ridgelines of the club banner at sunrise.
 */
export function MountainRange({
  className,
  color = "text-navy-950",
  detailed = true,
  snowfall = true,
  ridgeOpacity = [0.22, 0.38, 0.62],
}: {
  /** Position, size and opacity of the ridges (e.g. "absolute inset-x-0 bottom-0 h-64"). */
  className?: string;
  /** Text-colour utility that drives the ridge colour. */
  color?: string;
  detailed?: boolean;
  /** Draw the pale snow highlight along each ridge. */
  snowfall?: boolean;
  /** Opacity of the far, middle and near ridges. */
  ridgeOpacity?: [number, number, number];
}) {
  const ridges = [
    "M0 322 L120 252 L212 302 L340 198 L470 300 L562 240 L700 322 L820 228 L960 312 L1082 250 L1202 320 L1322 258 L1440 330 L1440 500 L0 500 Z",
    "M0 402 L160 300 L282 380 L432 248 L560 360 L700 292 L862 402 L1000 300 L1142 390 L1292 322 L1440 412 L1440 500 L0 500 Z",
    "M0 472 L182 378 L322 452 L520 328 L700 442 L882 368 L1060 462 L1242 388 L1440 472 L1440 500 L0 500 Z",
  ];

  const visible = ridges
    .map((d, index) => ({ d, opacity: ridgeOpacity[index] }))
    .filter((_, index) => detailed || index !== 1);

  /* The snow highlight traces the silhouette only, so the closing edges that
     make the ridge a fillable shape are dropped first. */
  const outline = (d: string) => d.replace(/ L1440 500 L0 500 Z$/, "");

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMax slice"
        className={cn("h-full w-full", color)}
        focusable="false"
      >
        {visible.map(({ d, opacity }) => (
          <path key={d} d={d} fill="currentColor" opacity={opacity} />
        ))}
        {snowfall && (
          <g
            className="text-snow/30"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {visible.map(({ d }) => (
              <path key={`snow-${d}`} d={outline(d)} />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
