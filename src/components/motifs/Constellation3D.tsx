import { useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { cn } from "../../lib/cn";
import { useFinePointer } from "../../hooks/useFinePointer";

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  id: number;
  plane: 0 | 1 | 2;
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: string;
  delay: string;
};

/**
 * A 3D star field, the banner's dawn sky rebuilt as geometry.
 *
 * Three planes of glowing stars sit at different depths; the whole scene
 * rotates a few degrees toward the pointer, so the planes visibly separate as
 * you move — real parallax, not a flat texture. A handful of stars are
 * connected by hairlines, drawing a constellation.
 *
 * Decorative only: `aria-hidden`, no layout work, transform-only motion.
 */
export function Constellation3D({
  className,
  count = 64,
  seed = 5,
  lines = 5,
}: {
  className?: string;
  /** Total stars spread across the three planes. */
  count?: number;
  /** Deterministic seed, so the sky is identical on every load. */
  seed?: number;
  /** How many stars to join into the constellation. */
  lines?: number;
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 48, damping: 18, mass: 0.8 });
  const springY = useSpring(rotateY, { stiffness: 48, damping: 18, mass: 0.8 });

  const { stars, constellation } = useMemo(() => {
    const random = seeded(seed);
    const all: Star[] = Array.from({ length: count }, (_, index) => {
      const size = 1 + random() * 2.6;
      return {
        id: index,
        plane: (index % 3) as 0 | 1 | 2,
        left: random() * 100,
        top: random() * 100,
        size,
        opacity: 0.25 + random() * 0.65,
        duration: `${2.6 + random() * 5}s`,
        delay: `${-random() * 6}s`,
      };
    });
    // Join the brightest stars of one plane into a constellation.
    const bright = all
      .filter((star) => star.plane === 1 && star.size > 2)
      .sort((a, b) => b.size - a.size)
      .slice(0, lines);
    const segments = bright.slice(1).map((star, index) => ({
      id: index,
      x1: bright[index].left,
      y1: bright[index].top,
      x2: star.left,
      y2: star.top,
    }));
    return { stars: all, constellation: segments };
  }, [count, seed, lines]);

  const handlePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!fine || event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect?.width) return;
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const resetPointer = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const planeDepth = ["-140px", "-60px", "30px"];
  const planeScale = [1.14, 1.06, 1];

  return (
    <div
      ref={ref}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      aria-hidden="true"
      className={cn("pointer-events-auto absolute inset-0 overflow-hidden scene", className)}
    >
      <motion.div
        style={reduced ? undefined : { rotateX: springX, rotateY: springY }}
        className="absolute inset-0 depth-3d"
      >
        {[0, 1, 2].map((plane) => (
          <div
            key={plane}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${planeDepth[plane]}) scale(${planeScale[plane]})`,
            }}
          >
            {stars
              .filter((star) => star.plane === plane)
              .map((star) => (
                <span
                  key={star.id}
                  className="absolute rounded-full bg-sun-100 animate-glow motion-reduce:animate-none"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                    animationDuration: star.duration,
                    animationDelay: star.delay,
                    boxShadow: "0 0 6px rgba(250, 240, 217, 0.7)",
                  }}
                />
              ))}
          </div>
        ))}

        {/* The constellation hairlines live on the middle plane */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-gold-200/25"
        >
          {constellation.map((segment) => (
            <line
              key={segment.id}
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke="currentColor"
              strokeWidth="0.15"
              strokeDasharray="1 1.4"
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
