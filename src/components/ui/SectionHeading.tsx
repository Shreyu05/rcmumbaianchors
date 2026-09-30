import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Reveal } from "./Reveal";
import { WordReveal } from "./WordReveal";

/**
 * Consistent editorial section header: eyebrow, display title and lead copy.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              "eyebrow flex items-center gap-3",
              align === "center" && "justify-center",
              tone === "dark" ? "text-sun-200" : "text-gold-700",
            )}
          >
            <span
              className={cn("h-px w-8", tone === "dark" ? "bg-gold-300/60" : "bg-gold-400/60")}
              aria-hidden="true"
            />
            {eyebrow}
          </p>
        </Reveal>
      )}
      {typeof title === "string" ? (
        // Plain strings get the masked word-by-word rise; custom nodes fall back
        // to a normal fade so callers can still compose their own markup.
        <h2
          className={cn(
            "mt-4 text-[1.9rem] leading-[1.1] font-semibold sm:text-4xl lg:text-[2.9rem]",
            tone === "dark" ? "text-white" : "text-navy-950",
            titleClassName,
          )}
        >
          <WordReveal text={title} delay={0.05} />
        </h2>
      ) : (
        <Reveal delay={0.05}>
          <h2
            className={cn(
              "mt-4 text-[1.9rem] leading-[1.1] font-semibold sm:text-4xl lg:text-[2.9rem]",
              tone === "dark" ? "text-white" : "text-navy-950",
              titleClassName,
            )}
          >
            {title}
          </h2>
        </Reveal>
      )}
      {lead && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-[1.02rem] leading-relaxed sm:text-lg",
              tone === "dark" ? "text-navy-100/80" : "text-navy-700/85",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
