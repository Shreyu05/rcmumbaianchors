import { useMemo } from "react";
import { cn } from "../../lib/cn";

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Slow snowfall, for the banner's alpine air.
 *
 * Each flake falls on its own duration and sways on a sine-like CSS wind,
 * so the field never looks mechanical. Deterministic (seeded), transform-only,
 * `aria-hidden`, and switched off for reduced-motion visitors.
 */
export function Snowfall({
  className,
  count = 34,
  seed = 17,
  opacity = 0.7,
}: {
  className?: string;
  /** Number of flakes. */
  count?: number;
  /** Deterministic seed. */
  seed?: number;
  /** Overall intensity multiplier, 0–1. */
  opacity?: number;
}) {
  const flakes = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => {
      const size = 1.5 + random() * 3.5;
      return {
        id: index,
        left: `${random() * 100}%`,
        top: `${-8 - random() * 18}%`,
        size,
        opacity: (0.25 + random() * 0.6) * opacity,
        // Falling long enough to cross the box; negative delay mid-distributes
        // the flakes so the field starts already "in weather".
        duration: `${11 + random() * 14}s`,
        delay: `${-random() * 22}s`,
        sway: `${2.4 + random() * 3.2}s`,
        blur: size > 3.6 ? 1.1 : size > 2.6 ? 0.5 : 0,
      };
    });
  }, [count, seed, opacity]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="absolute animate-fall motion-reduce:animate-none"
          style={{
            left: flake.left,
            top: flake.top,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            filter: flake.blur ? `blur(${flake.blur}px)` : undefined,
          }}
        >
          {/* the inner sway: a second, shorter animation on the flake itself */}
          <span
            className="block size-full rounded-full bg-snow animate-sway motion-reduce:animate-none"
            style={{ animationDuration: flake.sway, animationDelay: flake.delay }}
          />
        </span>
      ))}
    </div>
  );
}
