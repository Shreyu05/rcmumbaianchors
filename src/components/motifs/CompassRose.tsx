import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

/**
 * The compass rose from the club banner's ornament, rebuilt as a layered SVG
 * that turns slowly on its own axis. The long points and the fine inner star
 * rotate in opposite directions, which keeps the piece alive without any
 * JavaScript running per frame.
 *
 * Purely decorative: `aria-hidden`, CSS animation only, disabled for visitors
 * who ask for reduced motion.
 */
export function CompassRose({
  className,
  size = 260,
}: {
  className?: string;
  /** Rendered box in pixels. */
  size?: number;
}) {
  const points = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full text-gold-300">
        {/* outer graduated ring */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
          className="animate-turn-slow motion-reduce:animate-none"
          style={{ transformOrigin: "100px 100px" }}
        >
          <circle cx="100" cy="100" r="92" strokeDasharray="2 5" />
          <circle cx="100" cy="100" r="84" strokeOpacity="0.2" />
        </g>

        {/* the eight long points, drawn on their own turning layer */}
        <g
          className="animate-turn motion-reduce:animate-none"
          style={{ transformOrigin: "100px 100px", animationDuration: "90s" }}
        >
          {points.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M100 18 L105 100 L100 118 L95 100 Z"
                fill="currentColor"
                fillOpacity={angle % 90 === 0 ? 0.55 : 0.22}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </g>

        {/* the fine inner star, counter-rotating */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
          className="text-sun-200"
          fill="currentColor"
          fillOpacity="0.5"
        >
          {points.map((angle) => (
            <path
              key={angle}
              d="M100 58 L102.5 100 L100 108 L97.5 100 Z"
              transform={`rotate(${angle + 22.5} 100 100)`}
              fillOpacity={angle % 45 === 0 ? 0.6 : 0.3}
            />
          ))}
        </motion.g>

        {/* the still hub — like the club's anchor, everything turns around it */}
        <circle cx="100" cy="100" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="2.6" fill="currentColor" />
      </svg>
    </div>
  );
}
