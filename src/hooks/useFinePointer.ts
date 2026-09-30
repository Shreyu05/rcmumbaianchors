import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * True only for visitors with a fine pointer that can hover (a mouse or
 * trackpad) who have not asked for reduced motion.
 *
 * Pointer-reactive effects — tilt cards, hero parallax — check this so touch
 * devices and reduced-motion visitors get a completely static, cheap page.
 */
export function useFinePointer() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (reduced) {
      setFine(false);
      return;
    }
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduced]);

  return fine;
}
