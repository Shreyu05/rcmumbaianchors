import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";
import { inViewOnce, staggerContainer, wordRise } from "../../lib/motion";

/**
 * Headline reveal: each word rises out of its own mask as the heading scrolls
 * into view, giving the type a sense of weight rather than a plain fade.
 *
 * Splits on words only — never use for gradient (background-clip) text, since
 * a background only clips against its own element's glyphs.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  /** Delay before the first word rises. */
  delay?: number;
  /** Delay between words. */
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  const words = text.split(" ");

  return (
    <motion.span
      className={cn("inline", className)}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          /* The mask: overflow-hidden clips the rising word beneath the baseline. */
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span className="inline-block will-change-transform" variants={wordRise}>
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
