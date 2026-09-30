import { cn } from "../../lib/cn";

/**
 * A single gold filigree corner — the flourish that frames the club banner.
 *
 * The drawing is symmetric about the corner's diagonal, so the same SVG can be
 * rotated 90/180/270 degrees to build all four corners of a frame. Everything is
 * `currentColor`, so the caller decides the metal tone.
 */
export function FiligreeCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-10 w-10", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 56 C4 27 27 4 56 4" strokeWidth="1.8" />
        <path d="M14 64 C14 36 36 14 64 14" strokeWidth="1.1" opacity="0.75" />
        <path d="M56 4 L64 14 M4 56 L14 64" strokeWidth="0.8" opacity="0.55" />
        <path
          d="M56 4 C68 5 77 12 81 23 C69 22 60 15 56 4 Z"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.16"
        />
        <path
          d="M4 56 C5 68 12 77 23 81 C22 69 15 60 4 56 Z"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.16"
        />
        <path d="M30 22 L38 30 L30 38 L22 30 Z" strokeWidth="1" opacity="0.9" />
      </g>
      <circle cx="9" cy="9" r="2.4" fill="currentColor" />
      <circle cx="70" cy="20" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="20" cy="70" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/**
 * Four filigree corners (plus an optional inner gold rule) laid over a framed
 * panel — the banner's ornamental border, expressed for the web.
 */
export function FiligreeFrame({
  className,
  inset = "inset-3",
  size = "size-10 sm:size-14",
  rule = false,
  color = "text-gold-400/70",
}: {
  /** Position on the parent (e.g. "inset-0"). Tune `inset` for finer control. */
  className?: string;
  /** Distance of the ornament from the parent's edges. */
  inset?: string;
  /** Corner size utilities. */
  size?: string;
  /** Draw the thin gold rule just inside the frame. */
  rule?: boolean;
  /** Text-colour utility driving the metal tone. */
  color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-20", inset, color, className)}
    >
      {rule && <span className="absolute -inset-2 rounded-[3px] border border-current opacity-35" />}
      <FiligreeCorner className={cn("absolute -top-1 -left-1", size)} />
      <FiligreeCorner className={cn("absolute -top-1 -right-1 rotate-90", size)} />
      <FiligreeCorner className={cn("absolute -right-1 -bottom-1 rotate-180", size)} />
      <FiligreeCorner className={cn("absolute -bottom-1 -left-1 -rotate-90", size)} />
    </div>
  );
}

/**
 * A gold divider: hairline, small diamond, hairline — the mark that sits under
 * the motto on the club banner.
 */
export function GoldRule({
  className,
  tone = "light",
  align = "center",
  line = false,
  solid = false,
}: {
  className?: string;
  /** `light` = for pale surfaces, `dark` = for navy surfaces. */
  tone?: "light" | "dark";
  /** The centre mark can sit in the middle of a wide rule, or hug the start. */
  align?: "center" | "start";
  /** Flat hairlines instead of gradients — for long, quiet dividers. */
  line?: boolean;
  /** A solid diamond mark instead of the gradient one. */
  solid?: boolean;
}) {
  const lineClass = line
    ? tone === "dark"
      ? "gold-rule-line-dark"
      : "gold-rule-line-light"
    : tone === "dark"
      ? "bg-gradient-to-r from-transparent to-gold-300/70"
      : "bg-gradient-to-r from-transparent to-gold-500/60";
  const lineReverseClass = line
    ? tone === "dark"
      ? "gold-rule-line-reverse-dark"
      : "gold-rule-line-reverse-light"
    : tone === "dark"
      ? "bg-gradient-to-l from-transparent to-gold-300/70"
      : "bg-gradient-to-l from-transparent to-gold-500/60";
  const mark = solid
    ? tone === "dark"
      ? "gold-rule-solid-dark"
      : "gold-rule-solid-light"
    : tone === "dark"
      ? "bg-gold-300/85"
      : "bg-gold-500/70";

  return (
    <span
      aria-hidden="true"
      className={cn("flex items-center gap-3", align === "center" ? "justify-center" : "", className)}
    >
      <span className={cn("h-px w-12 sm:w-20", lineClass)} />
      <span className={cn("size-1.5 rotate-45", mark)} />
      <span className={cn("h-px w-12 sm:w-20", lineReverseClass)} />
    </span>
  );
}
