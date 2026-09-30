import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { easeOut } from "../../lib/motion";

/**
 * The intro: on every load the official club crest rises out of the dark,
 * zooms toward the visitor, and the curtain "opens up" to reveal the website.
 *
 * Choreography (≈2.3s total):
 *   0.0s  full navy overlay fades up from black
 *   0.1s  the white crest scales in with a soft blur
 *   0.6s  the crest zooms in (scale 1 → 1.35) as the light behind it blooms
 *   1.7s  the curtain splits like stage drapes and lifts, the crest punches
 *         through and dissolves — the website opens underneath
 *
 * The site renders underneath from the very first frame, so content, layout
 * and SEO are never blocked — the overlay is purely decorative. When the
 * animation completes the overlay is removed from the DOM entirely. Visitors
 * who prefer reduced motion see only a brief, calm cross-fade.
 */
export function IntroSplash() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  /* If the tab is hidden when the intro ends (background-tab load), the exit
     animation cannot run — remove the overlay outright instead. */
  const [instant, setInstant] = useState(false);
  /* Failsafe: once the exit has had its window, drop the overlay even if the
     exit transition itself was interrupted — the intro can never stick. */
  const [forceGone, setForceGone] = useState(false);

  const duration = reduced ? 0.6 : 2.3;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (document.hidden) setInstant(true);
      setDone(true);
    }, duration * 1000);
    return () => window.clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setForceGone(true), 1100);
    return () => window.clearTimeout(timer);
  }, [done]);

  if (instant || forceGone) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-navy-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
        >
          {/* The light that blooms behind the crest as it zooms */}
          <motion.div
            className="absolute top-1/2 left-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun-300/25 blur-[90px]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={reduced ? { opacity: 0.6 } : { opacity: [0, 0.9, 0.55], scale: [0.4, 1.15, 1.7] }}
            transition={{
              duration: reduced ? 0.5 : 2.1,
              times: reduced ? undefined : [0, 0.45, 1],
              ease: "easeOut",
            }}
          />

          {/* Curtain — splits like stage drapes as the site opens up */}
          {reduced ? (
            <div className="absolute inset-0 bg-navy-950" />
          ) : (
            <>
              <motion.div
                className="absolute inset-y-0 left-0 w-[50.5%] bg-navy-950"
                initial={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.85, ease: easeOut }}
              >
                <span className="absolute top-0 right-0 bottom-0 w-px bg-gold-300/25" />
              </motion.div>
              <motion.div
                className="absolute inset-y-0 right-0 w-[50.5%] bg-navy-950"
                initial={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.85, ease: easeOut }}
              >
                <span className="absolute top-0 left-0 bottom-0 w-px bg-gold-300/25" />
              </motion.div>
            </>
          )}

          {/* The official crest: rises, then zooms in, then punches through */}
          <div className="absolute inset-0 grid place-items-center">
            <motion.img
              src="/images/brand/logo-crest.png"
              alt=""
              width={478}
              height={507}
              fetchPriority="high"
              decoding="async"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.55, filter: "blur(14px)" }}
              animate={
                reduced
                  ? { opacity: [0, 1, 0] }
                  : { opacity: [0, 1, 1, 1, 0], scale: [0.55, 1, 1.35, 1.35, 1.5], filter: ["blur(14px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(16px)"] }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: reduced ? 0.5 : 2.1,
                times: reduced ? [0, 0.5, 1] : [0, 0.14, 0.52, 0.78, 1],
                ease: reduced ? "easeInOut" : easeOut,
              }}
              className="h-[34vmin] w-auto"
            />
          </div>

          {/* A whisper of a rule under the crest, parting with the curtains */}
          {!reduced && (
            <motion.div
              className="absolute top-1/2 left-1/2 mt-[24vmin] h-px w-[30vmin] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 2.1, times: [0, 0.4, 0.9], ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
