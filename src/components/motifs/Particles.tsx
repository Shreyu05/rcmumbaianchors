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
 * Drifting light motes. Deterministic, transform-only animation so it stays
 * cheap: no layout work, no per-frame JavaScript.
 *
 * `rise` swaps the gentle float for the rising-and-fading motion of the golden
 * embers that lift off the water in the club banner.
 */
export function Particles({
  className,
  count = 26,
  seed = 7,
  color = "bg-white",
  rise = false,
}: {
  className?: string;
  count?: number;
  seed?: number;
  /** Background utility for the mote colour (e.g. "bg-sun-300"). */
  color?: string;
  /** Rise and fade like embers instead of floating in place. */
  rise?: boolean;
}) {
  const motes = useMemo(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, index) => {
      const size = 1 + random() * 3.2;
      return {
        id: index,
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size,
        opacity: 0.18 + random() * 0.5,
        duration: `${rise ? 7 + random() * 9 : 9 + random() * 14}s`,
        delay: `${-random() * 12}s`,
        blur: size > 2.4 ? 0.6 : 0,
      };
    });
  }, [count, seed, rise]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          className={cn(
            "absolute rounded-full motion-reduce:animate-none",
            color,
            rise ? "animate-rise" : "animate-float-slower",
          )}
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            opacity: mote.opacity,
            animationDuration: mote.duration,
            animationDelay: mote.delay,
            filter: mote.blur ? `blur(${mote.blur}px)` : undefined,
          }}
        />
      ))}
    </div>
  );
}
