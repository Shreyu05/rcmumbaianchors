import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "../../hooks/useFinePointer";
import { AnchorGlyph } from "../motifs/AnchorGlyph";

/**
 * The custom cursor, in three voices:
 *
 *  · a precise gold dot that tracks the pointer 1:1
 *  · a lagging ring on a spring that changes with context — slim while moving
 *    through the page, a wide soft lens over images, and a magnetised anchor
 *    emblem between the two over links and buttons
 *  · a wake of golden embers that scatter behind fast movement, and a ripple
 *    that rings out on every press
 *
 * Rendered only for fine pointers with reduced-motion off; on touch devices
 * and for reduced-motion visitors the native cursor is left untouched. The
 * ring and emblem are mix-blend layers, so they stay visible on both the navy
 * and the parchment sections.
 */

type Trail = { id: number; x: number; y: number; drift: number; size: number; life: number };
type Ripple = { id: number; x: number; y: number };

type CursorMode = "default" | "interactive" | "media";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, summary";
const MEDIA_SELECTOR = "img, picture, video, [data-cursor='media']";

export function Cursor() {
  const fine = useFinePointer();
  const [mode, setMode] = useState<CursorMode>("default");
  const [pressed, setPressed] = useState(false);
  const [trail, setTrail] = useState<Trail[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  const trailId = useRef(0);
  const lastEmber = useRef({ x: -100, y: -100 });
  const rippleId = useRef(0);

  useEffect(() => {
    if (!fine) return;

    document.documentElement.style.cursor = "none";

    const closest = (target: EventTarget | null, selector: string) =>
      target instanceof Element && Boolean(target.closest(selector));

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const interactive = closest(event.target, INTERACTIVE_SELECTOR);
      const media = !interactive && closest(event.target, MEDIA_SELECTOR);
      setMode(interactive ? "interactive" : media ? "media" : "default");

      /* Scatter embers along the wake — only on real movement, so hovering
         in place doesn't pile sparks under the pointer. */
      const dx = event.clientX - lastEmber.current.x;
      const dy = event.clientY - lastEmber.current.y;
      if (dx * dx + dy * dy > 26 * 26) {
        lastEmber.current = { x: event.clientX, y: event.clientY };
        const id = ++trailId.current;
        const life = 620 + Math.random() * 260;
        const ember: Trail = {
          id,
          x: event.clientX + (Math.random() - 0.5) * 14,
          y: event.clientY + (Math.random() - 0.5) * 14 + 6,
          drift: (Math.random() - 0.5) * 26,
          size: 2.5 + Math.random() * 3,
          life,
        };
        setTrail((current) => [...current.slice(-24), ember]);
        window.setTimeout(() => {
          setTrail((current) => current.filter((item) => item.id !== id));
        }, life + 60);
      }
    };

    const onDown = (event: PointerEvent) => {
      setPressed(true);
      const id = ++rippleId.current;
      const ripple = { id, x: event.clientX, y: event.clientY };
      setRipples((current) => [...current.slice(-4), ripple]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== id));
      }, 700);
    };
    const onUp = () => setPressed(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const media = mode === "media";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      {/* Ember wake — gold sparks that scatter behind fast pointer movement */}
      {trail.map((ember) => (
        <motion.span
          key={ember.id}
          className="absolute top-0 left-0 rounded-full bg-sun-300"
          style={{
            x: ember.x,
            y: ember.y,
            width: ember.size,
            height: ember.size,
            boxShadow: "0 0 8px rgba(244, 224, 180, 0.85)",
          }}
          initial={{ opacity: 0, scale: 0.3, translateX: "-50%", translateY: "-50%" }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.3, 1, 0.4],
            y: [ember.y, ember.y - 16],
            x: [ember.x, ember.x + ember.drift],
          }}
          transition={{ duration: ember.life / 1000, ease: "easeOut", times: [0, 0.25, 1] }}
        />
      ))}

      {/* Press ripple — a ring that rings out from every click */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute top-0 left-0 rounded-full border border-gold-300/80"
          style={{ x: ripple.x, y: ripple.y, width: 46, height: 46, translateX: "-50%", translateY: "-50%" }}
          initial={{ scale: 0.35, opacity: 0.6 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 0.62, ease: "easeOut" }}
        />
      ))}

      {/* The precise dot — sits exactly under the pointer */}
      <motion.span style={{ x, y }} className="absolute top-0 left-0">
        <motion.span
          animate={{ scale: pressed ? 0.5 : mode === "interactive" ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300"
        />
      </motion.span>

      {/* The lagging ring — a soft gold halo that widens over media, and
          stretches on press like a held breath */}
      <motion.span style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.span
          animate={{
            width: media ? 76 : mode === "interactive" ? 52 : 30,
            height: media ? 76 : mode === "interactive" ? 52 : 30,
            opacity: media ? 0.4 : mode === "interactive" ? 0.55 : 0.9,
            scale: pressed ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="block -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300/70"
          style={{ boxShadow: "0 0 18px rgba(239, 211, 161, 0.25)" }}
        />
      </motion.span>

      {/* The lens over media — a warm tinted glass that follows the pointer */}
      <motion.span style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.span
          animate={{ scale: media ? 1 : 0, opacity: media ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="grid size-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-sun-200/40 bg-sun-200/10 backdrop-blur-[1.5px]"
        >
          <AnchorGlyph className="size-4 text-sun-200/80" strokeWidth={9} />
        </motion.span>
      </motion.span>

      {/* The anchor emblem — appears over links and buttons */}
      <motion.span style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.span
          animate={{
            scale: mode === "interactive" ? 1 : 0,
            opacity: mode === "interactive" ? 1 : 0,
            rotate: mode === "interactive" ? 0 : -30,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-300/50 bg-navy-950/35 text-gold-200 backdrop-blur-[2px]"
        >
          <AnchorGlyph className="size-5" strokeWidth={9} />
        </motion.span>
      </motion.span>
    </div>
  );
}
