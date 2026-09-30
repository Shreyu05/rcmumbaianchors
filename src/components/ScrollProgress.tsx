import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline reading-progress bar: shows how far the journey has come. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-river-500 via-river-300 to-gold-400"
    />
  );
}
