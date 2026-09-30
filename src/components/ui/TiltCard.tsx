import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useFinePointer } from "../../hooks/useFinePointer";

/**
 * A surface that tilts in real 3D toward the cursor, with a specular highlight
 * that tracks the pointer and a slight forward lift on hover.
 *
 * Children can opt into the depth by giving themselves a translateZ — put
 * `depth-3d` on the parent inside your own markup and the layers will separate
 * as the card tilts.
 *
 * Only active for fine pointers with hover; touch and reduced-motion visitors
 * get a completely static card.
 */
export function TiltCard({
  children,
  className,
  surfaceClassName,
  /** Maximum rotation in degrees at the edges of the card. */
  intensity = 9,
  /** How far the card lifts toward the viewer on hover (px). */
  lift = 14,
  glare = true,
}: {
  children: ReactNode;
  /** Applied to the perspective wrapper (sizing, grid placement). */
  className?: string;
  /** Applied to the tilting surface (background, border, radius, shadow). */
  surfaceClassName?: string;
  intensity?: number;
  lift?: number;
  glare?: boolean;
}) {
  const enabled = useFinePointer();

  const rotateX = useSpring(0, { stiffness: 190, damping: 20, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 190, damping: 20, mass: 0.4 });
  const z = useSpring(0, { stiffness: 190, damping: 20, mass: 0.4 });

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 140, damping: 24 });
  const glareBackground = useMotionTemplate`radial-gradient(42% 42% at ${glareX}% ${glareY}%, color-mix(in oklab, white 34%, transparent), transparent 70%)`;

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * intensity * 2);
    rotateX.set((0.5 - py) * intensity * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleEnter = () => {
    if (!enabled) return;
    z.set(lift);
    glareOpacity.set(1);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
    glareOpacity.set(0);
  };

  return (
    <div className={cn("group/tilt scene relative", className)}>
      <motion.div
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, z, transformStyle: "preserve-3d" }}
        className={cn("relative h-full w-full", surfaceClassName)}
      >
        {children}
        {glare && enabled && (
          <motion.span
            aria-hidden="true"
            style={{ background: glareBackground, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          />
        )}
      </motion.div>
    </div>
  );
}
