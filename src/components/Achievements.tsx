import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { RefObject } from "react";
import { useRef } from "react";
import { achievements } from "../data/content";
import { cn } from "../lib/cn";
import { slideIn } from "../lib/motion";
import { MountainRange } from "./motifs/MountainRange";
import { RiverLines } from "./motifs/RiverLines";
import { RevealGroup, RevealItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

function MilestoneCard({ milestone, align }: { milestone: (typeof achievements)[number]; align: "left" | "right" }) {
  return (
    <TiltCard intensity={5} lift={8} surfaceClassName="rounded-[3px]">
    <div
      className={cn(
        "group relative rounded-[3px] border border-navy-900/10 bg-white/90 p-6 backdrop-blur transition-[border-color,box-shadow] duration-500 ease-out group-hover/tilt:border-river-400/40 group-hover/tilt:shadow-[0_30px_66px_-36px_rgba(10,26,46,0.5)]",
        align === "right" ? "md:text-right" : "md:text-left",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#86D3E4,#EFC87F,transparent)] transition-transform duration-700 ease-out group-hover/tilt:scale-x-100"
      />
      <div className={cn("flex items-center gap-3", align === "right" && "md:justify-end")}>
        <span className="font-display text-[1.6rem] leading-none font-semibold text-navy-950">
          {milestone.year}
        </span>
        <span className="rounded-full border border-navy-900/12 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.18em] text-navy-500 uppercase">
          {milestone.tag}
        </span>
      </div>
      <h3 className="mt-4 text-[1.1rem] font-semibold text-navy-950">{milestone.title}</h3>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-navy-700/85">{milestone.description}</p>
    </div>
    </TiltCard>
  );
}

/** The timeline rail: a static hairline with a gradient that fills as the list
    scrolls past, so the river visibly reaches each milestone. */
function TimelineRail({ containerRef }: { containerRef: RefObject<HTMLOListElement | null> }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <>
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[15px] w-px bg-navy-900/12 md:left-1/2"
      />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: reduced ? 1 : fill }}
        className="absolute top-2 bottom-2 left-[15px] w-px origin-top bg-[linear-gradient(180deg,rgba(134,211,228,0)_0%,#86D3E4_12%,#2C9FBC_60%,#EFC87F_100%)] md:left-1/2"
      />
    </>
  );
}

export function Achievements() {
  const listRef = useRef<HTMLOListElement>(null);

  return (
    <section id="achievements" className="relative isolate overflow-hidden bg-mist py-20 sm:py-28 lg:py-32">
      <RiverLines className="absolute inset-x-0 top-6 h-32 opacity-35" count={3} />
      <MountainRange
        color="text-navy-900"
        className="absolute inset-x-0 bottom-0 h-64 opacity-[0.08]"
        detailed={false}
        ridgeOpacity={[0.4, 0.6, 0.9]}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Achievements"
          title="Every milestone started as a small decision."
          lead="A club is built one year at a time. This is the trail so far — each marker placed where a group of young people chose to show up."
          className="lg:max-w-2xl"
        />

        <ol ref={listRef} className="relative mt-16 sm:mt-20">
          {/* The river runs the length of the timeline */}
          <TimelineRail containerRef={listRef} />

          {achievements.map((milestone, index) => (
            <li key={`${milestone.year}-${milestone.title}`} className="relative">
              {/* Mobile marker */}
              <span
                aria-hidden="true"
                className="absolute top-7 left-[15px] grid size-[13px] -translate-x-1/2 place-items-center rounded-[2px] border border-river-400 bg-white md:hidden"
              >
                <span className="size-1.5 rounded-[1px] bg-river-500" />
              </span>

              <RevealGroup delay={0.04 * index}>
                <RevealItem
                  variants={slideIn(index % 2 === 0 ? "left" : "right", 28)}
                  className="grid gap-6 pb-10 pl-12 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:pb-14 md:pl-0"
                >
                  {index % 2 === 0 ? (
                    <>
                      <MilestoneCard milestone={milestone} align="right" />
                      <DesktopMarker />
                      <div aria-hidden="true" className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div aria-hidden="true" className="hidden md:block" />
                      <DesktopMarker />
                      <MilestoneCard milestone={milestone} align="left" />
                    </>
                  )}
                </RevealItem>
              </RevealGroup>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DesktopMarker() {
  return (
    <span className="relative hidden md:grid md:place-items-center" aria-hidden="true">
      <span className="absolute size-9 rounded-full border border-river-400/40" />
      <span className="absolute size-9 rounded-full border border-river-400/30 animate-pulse-ring" />
      <span className="relative size-[13px] rotate-45 rounded-[2px] border border-river-500 bg-white">
        <span className="absolute inset-[3px] rounded-[1px] bg-[linear-gradient(135deg,#2C9FBC,#EFC87F)]" />
      </span>
    </span>
  );
}
