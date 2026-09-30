import { cn } from "../../lib/cn";
import { site } from "../../data/content";

/**
 * The real club crest.
 *
 * Both files come from the same artwork; the source is white-on-black, so it was
 * separated into a white cut for navy surfaces and a navy cut for pale ones (see
 * `scripts/brand-assets.py`).
 */
const CREST_SRC = {
  dark: "/images/brand/logo-crest-ink.png",
  light: "/images/brand/logo-crest.png",
} as const;

/** Standalone crest, for badges, overlays and watermarks. */
export function Crest({
  tone = "dark",
  className,
  alt = "",
}: {
  tone?: "dark" | "light";
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={CREST_SRC[tone]}
      alt={alt}
      width={478}
      height={507}
      decoding="async"
      className={cn("h-9 w-auto select-none", className)}
    />
  );
}

/** Club wordmark: the real crest beside the club name. */
export function Logo({
  tone = "dark",
  className,
  compact = false,
  crestClassName,
}: {
  tone?: "dark" | "light";
  className?: string;
  compact?: boolean;
  crestClassName?: string;
}) {
  return (
    <a
      href="#home"
      className={cn("group flex items-center gap-3", className)}
      aria-label={`${site.clubName} — back to top`}
    >
      <Crest
        tone={tone}
        className={cn(
          "h-11 w-auto shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5",
          crestClassName,
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[0.98rem] font-semibold tracking-tight",
            tone === "dark" ? "text-navy-950" : "text-white",
          )}
        >
          Mumbai Anchors
        </span>
        {!compact && (
          <span
            className={cn(
              "eyebrow mt-1 text-[0.5rem]",
              tone === "dark" ? "text-navy-500" : "text-river-200/80",
            )}
          >
            Rotaract · {site.district}
          </span>
        )}
      </span>
    </a>
  );
}
