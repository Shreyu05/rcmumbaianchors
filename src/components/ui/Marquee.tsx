import { cn } from "../../lib/cn";

/** Matches Devanagari codepoints, so the marquee can pick the right font. */
const DEVANAGARI = /[\u0900-\u097F]/;

/**
 * Infinite marquee ribbon.
 *
 * The track holds two identical copies of the list so translating it exactly
 * -50% loops without a seam. Animation is pure CSS (no per-frame JavaScript),
 * pauses on hover, and is switched off entirely for reduced-motion visitors.
 */
export function Marquee({
  items,
  className,
  speed = "normal",
  reverse = false,
  tone = "dark",
  mark = false,
}: {
  items: string[];
  className?: string;
  speed?: "normal" | "slow";
  reverse?: boolean;
  /** `dark` = light text and rules, for use on navy sections. */
  tone?: "dark" | "light";
  /** Show a small anchor mark between items. */
  mark?: boolean;
}) {
  const animation = speed === "slow" ? "animate-marquee-slow" : "animate-marquee";

  const row = (copy: number) => (
    <ul
      key={copy}
      aria-hidden={copy === 1 ? "true" : undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <li key={`${copy}-${item}`} className="flex items-center">
          <span
            className={cn(
              "text-[1.05rem] font-semibold tracking-tight whitespace-nowrap sm:text-[1.3rem]",
              // Devanagari needs its own family — Fraunces has no such glyphs.
              DEVANAGARI.test(item) ? "font-devanagari" : "font-display",
              tone === "dark" ? "text-white/70" : "text-navy-800/75",
            )}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "mx-7 size-1.5 shrink-0 rotate-45 sm:mx-10",
              tone === "dark" ? "bg-gold-300/70" : "bg-gold-500/60",
            )}
          />
          {mark && (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "h-3.5 w-px shrink-0",
                  tone === "dark" ? "bg-white/15" : "bg-navy-900/15",
                )}
              />
              <span aria-hidden="true" className="mx-7 sm:mx-10" />
            </>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0",
          animation,
          reverse && "[animation-direction:reverse]",
          "group-hover:[animation-play-state:paused] motion-reduce:animate-none",
        )}
      >
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
