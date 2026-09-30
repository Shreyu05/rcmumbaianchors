import { cn } from "../../lib/cn";
import { AnchorGlyph } from "./AnchorGlyph";

/**
 * A CSS-3D gyroscope: three rings in different planes orbit slowly around the
 * club's anchor, which stays perfectly still at the centre — geometry for
 * "anchored while everything else moves".
 *
 * Built from transforms only (no canvas, no WebGL), so it costs nothing per
 * frame, inherits the ambient text colour, and freezes politely for
 * reduced-motion visitors.
 */
export function AnchorOrbit({
  className,
  glyphClassName,
  /** Opacity of the ring hairlines. */
  ringOpacity = 0.5,
}: {
  /** Sizing and colour — the motif is drawn with `currentColor`. */
  className?: string;
  glyphClassName?: string;
  ringOpacity?: number;
}) {
  const ring = "absolute rounded-full border border-current depth-3d";

  return (
    <div aria-hidden="true" className={cn("relative scene", className)}>
      {/* warm core glow */}
      <span className="absolute inset-[18%] rounded-full bg-gold-300/20 blur-3xl animate-glow" />

      <div
        className="absolute inset-0 depth-3d"
        style={{ transform: "rotateX(20deg) rotateZ(-10deg)" }}
      >
        <div className="absolute inset-0 animate-orbit depth-3d motion-reduce:animate-none">
          {/* ring 1 — widest plane */}
          <span
            className={ring}
            style={{ inset: "4%", opacity: ringOpacity, transform: "rotateX(74deg)" }}
          />
          {/* ring 2 — tilted across the first */}
          <span
            className={ring}
            style={{ inset: "15%", opacity: ringOpacity * 0.7, transform: "rotateX(74deg) rotateY(62deg)" }}
          />
          {/* ring 3 — dashed, closest in */}
          <span
            className={cn(ring, "border-dashed")}
            style={{ inset: "27%", opacity: ringOpacity * 0.55, transform: "rotateX(74deg) rotateY(-54deg)" }}
          />

          {/* orbiting nodes on the outer rings */}
          <span
            className="absolute depth-3d"
            style={{ inset: "4%", transform: "rotateX(74deg) rotateZ(140deg)" }}
          >
            <span className="absolute top-0 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_16px_4px_rgba(229,172,78,0.5)]" />
          </span>
          <span
            className="absolute depth-3d"
            style={{ inset: "4%", transform: "rotateX(74deg) rotateZ(300deg)" }}
          >
            <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-river-200 shadow-[0_0_14px_3px_rgba(134,211,228,0.45)]" />
          </span>
          <span
            className="absolute depth-3d"
            style={{ inset: "15%", transform: "rotateX(74deg) rotateY(62deg) rotateZ(60deg)" }}
          >
            <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
          </span>
        </div>
      </div>

      {/* The anchor never rotates — it only breathes. */}
      <div className="absolute inset-0 grid place-items-center">
        <AnchorGlyph
          className={cn("h-[38%] w-[38%] animate-bob motion-reduce:animate-none", glyphClassName)}
          strokeWidth={6}
          withCurrent
        />
      </div>
    </div>
  );
}
