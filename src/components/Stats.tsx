import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { blurUp } from "../lib/motion";
import { useContent } from "../store/content";
import { Constellation3D } from "./motifs/Constellation3D";
import { MountainRange } from "./motifs/MountainRange";
import { RiverLines } from "./motifs/RiverLines";
import { Counter } from "./ui/Counter";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";

type StatRow = { value: number; suffix: string; label: string; sublabel: string };

/** Each stat rides its own slow parallax lane, alternating direction. */
function StatItem({ stat, index }: { stat: StatRow; index: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = index % 2 === 0 ? [30, -30] : [-30, 30];
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : drift);

  return (
    <div ref={ref}>
      <motion.div style={{ y }}>
        <TiltCard intensity={8} lift={10} surfaceClassName="rounded-[3px]">
          {/* A definition list keeps each number paired with its label for
              screen readers; `dd` holds the visible stack. */}
          <dl className="h-full">
            <div className="group relative h-full overflow-hidden rounded-[3px] border border-white/10 bg-white/[0.035] px-5 py-7 backdrop-blur-sm transition-colors duration-500 group-hover/tilt:border-river-300/35 group-hover/tilt:bg-white/[0.06] sm:px-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 size-32 rounded-full bg-river-400/10 opacity-0 blur-2xl transition-opacity duration-700 group-hover/tilt:opacity-100"
              />
              {/* the number sits proud of the card on its own 3D layer */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-4 mx-auto block h-10 w-24 rounded-full bg-gold-300/10 blur-xl transition-all duration-700 group-hover/tilt:top-2 group-hover/tilt:bg-gold-300/20"
              />
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="font-display text-[2.4rem] leading-none font-semibold tracking-tight sm:text-[3rem] lg:text-[3.3rem]">
                  <span
                    aria-hidden="true"
                    className="bg-[linear-gradient(120deg,#FFFFFF_10%,#BFEAF3_50%,#EFC87F_95%)] bg-clip-text text-transparent"
                  >
                    <Counter value={stat.value} suffix={stat.suffix} duration={2 + index * 0.15} />
                  </span>
                  <span className="sr-only">
                    {stat.value.toLocaleString("en-IN")}
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-4 text-[0.95rem] font-semibold text-white">{stat.label}</p>
                <p className="mt-1.5 text-[0.82rem] text-navy-100/55">{stat.sublabel}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-px w-full bg-white/10 transition-colors duration-500 group-hover/tilt:bg-river-300/50"
                />
              </dd>
            </div>
          </dl>
        </TiltCard>
      </motion.div>
    </div>
  );
}

export function Stats() {
  const { stats } = useContent();

  return (
    <section
      id="impact"
      aria-label="Our impact in numbers"
      className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#0A1A2E_0%,#102F4E_55%,#0A1A2E_100%)]"
      />
      {/* a quiet sky of stars behind the numbers */}
      <Constellation3D className="pointer-events-none opacity-50" count={44} seed={31} lines={0} />
      <RiverLines className="absolute inset-x-0 top-4 h-40 opacity-30" count={3} />
      <MountainRange
        color="text-navy-800"
        className="absolute inset-x-0 bottom-0 h-56 opacity-90"
        detailed={false}
        ridgeOpacity={[0.28, 0.42, 0.6]}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal y={20}>
          <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="eyebrow flex items-center gap-3 text-river-200">
              <span className="h-px w-8 bg-river-300/60" aria-hidden="true" />
              Our Impact
            </p>
            <p className="max-w-md text-sm leading-relaxed text-navy-100/65">
              Impact measured in people, not press releases — every number here is a promise kept.
            </p>
          </div>
        </Reveal>

        <RevealGroup stagger={0.08} className="grid grid-cols-2 gap-x-6 gap-y-10 pt-12 lg:grid-cols-4 lg:gap-x-8">
          {stats.map((stat, index) => (
            <RevealItem key={stat.label + index} variants={blurUp} className="h-full">
              <StatItem stat={stat} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
