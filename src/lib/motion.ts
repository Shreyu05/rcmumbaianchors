import type { Transition, Variants } from "framer-motion";

/** Signature easing used across the site — a confident, premium ease-out. */
export const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Reveal a block of content on scroll. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: easeOut } },
};

/** Depth-flavoured reveal: rises out of a soft blur, as if coming forward. */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeOut } },
};

/** Slides in from the side — used for alternating editorial blocks. */
export const slideIn = (from: "left" | "right", distance = 42): Variants => ({
  hidden: { opacity: 0, x: from === "left" ? -distance : distance },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
});

/** Parent container that cascades its children into view. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** One word of a masked heading reveal. */
export const wordRise: Variants = {
  hidden: { y: "108%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.85, ease: easeOut } },
};

/** Shared viewport config so reveals feel consistent. */
export const inViewOnce = { once: true, amount: 0.2 } as const;

/** Tighter trigger for tall sections, where 20% of the block may be off-screen. */
export const inViewSoft = { once: true, amount: 0.12 } as const;

/** Spring used by pointer-reactive (tilt / magnetic) surfaces. */
export const tiltSpring: Transition = { type: "spring", stiffness: 190, damping: 20, mass: 0.4 };
