import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Anchor, Compass, Telescope } from "lucide-react";
import { useRef } from "react";
import { about, site } from "../data/content";
import { slideIn } from "../lib/motion";
import { AnchorGlyph } from "./motifs/AnchorGlyph";
import { CompassRose } from "./motifs/CompassRose";
import { FiligreeFrame } from "./motifs/Ornament";
import { FlowDivider } from "./motifs/RiverLines";
import { Marquee } from "./ui/Marquee";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

const PILLAR_ICONS = [Telescope, Compass, Anchor];

const VALUES = [
  "Anchored in Purpose",
  "Service Above Self",
  "Leadership by Doing",
  "Fellowship",
  "Measurable Impact",
  "Mumbai",
];

export function About() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  /* Scroll parallax: the two photographs separate as the section passes,
     which reads as depth behind the flat editorial column. */
  const mainY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -50]);
  const detailY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -80]);
  const badgeY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [16, -34]);

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-mist py-20 sm:py-28 lg:py-32">
      {/* soft sunrise glow in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-[-10%] h-72 w-72 rounded-full bg-sun-200/60 blur-[120px]"
      />
      {/* the banner's compass, half-off the page, turning slowly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 -left-28 hidden opacity-[0.1] lg:block"
      >
        <CompassRose size={340} />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Editorial copy */}
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={about.eyebrow} title={about.title} lead={about.lead} />

            <div className="mt-8 space-y-5">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={0.1 + index * 0.06} y={34}>
                  <p className="text-[0.98rem] leading-relaxed text-navy-800/80 sm:text-[1.05rem]">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Pillars — each row tilts its icon forward in 3D on hover */}
            <RevealGroup
              stagger={0.08}
              className="mt-12 divide-y divide-navy-900/10 border-t border-navy-900/10"
            >
              {about.pillars.map((pillar, index) => {
                const Icon = PILLAR_ICONS[index] ?? Anchor;
                return (
                  <RevealItem key={pillar.title} variants={slideIn("left", 26)}>
                    <div className="group relative flex gap-5 py-6">
                      {/* a warm wash slides in from the left on hover */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-[-1rem] inset-y-0 -z-10 origin-left scale-x-0 rounded-[3px] bg-[linear-gradient(90deg,rgba(224,184,120,0.14),transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
                      />
                      <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border border-navy-900/12 bg-white text-navy-700 shadow-[0_10px_24px_-16px_rgba(10,26,46,0.6)] transition-[transform,color,border-color] duration-500 ease-out group-hover:border-gold-400/70 group-hover:text-gold-600 group-hover:[transform:translateY(-4px)_rotate(-6deg)]">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-[1.05rem] font-semibold text-navy-950">{pillar.title}</h3>
                        <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-navy-700/85">
                          {pillar.body}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>

          {/* Visual area — two drifting planes */}
          <div className="lg:col-span-5">
            <div className="scene relative pt-6">
              <Reveal delay={0.1}>
                <motion.div style={{ y: mainY }}>
                  <TiltCard intensity={6} lift={12} surfaceClassName="rounded-[3px]">
                    <div className="relative overflow-hidden rounded-[3px] border border-navy-900/10 bg-navy-900 shadow-[0_40px_80px_-50px_rgba(10,26,46,0.7)]">
                      <img
                        src={about.images.main}
                        alt="Mumbai Anchors members working together on a community project"
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tilt:scale-[1.05]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,26,46,0)_45%,rgba(10,26,46,0.55)_100%)]"
                      />
                      <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-white">
                        <AnchorGlyph className="h-6 w-6 text-gold-200" strokeWidth={7} />
                        <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase opacity-85">
                          Mumbai · Est. {site.foundingYear}
                        </p>
                      </div>
                      {/* the banner's ornament, tucked inside the frame */}
                      <FiligreeFrame
                        inset="inset-2"
                        size="size-8 sm:size-10"
                        color="text-gold-200/55"
                        className="hidden sm:block"
                      />
                    </div>
                  </TiltCard>
                </motion.div>
              </Reveal>

              {/* Overlapping detail image, drifting the other way */}
              <motion.div
                style={{ y: detailY }}
                className="absolute -bottom-12 -left-4 hidden w-[62%] sm:block lg:-left-10"
              >
                <Reveal delay={0.2}>
                  <TiltCard intensity={8} lift={14} surfaceClassName="rounded-[3px]">
                    <div className="overflow-hidden rounded-[3px] border border-white bg-navy-900 shadow-[0_30px_60px_-30px_rgba(10,26,46,0.6)]">
                      <img
                        src={about.images.detail}
                        alt="Volunteers during a Mumbai Anchors initiative"
                        loading="lazy"
                        decoding="async"
                        className="aspect-[10/9] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/tilt:scale-[1.06]"
                      />
                    </div>
                  </TiltCard>
                </Reveal>
              </motion.div>

              {/* Floating credibility badge */}
              <motion.div
                style={{ y: badgeY }}
                className="absolute -top-1 -right-3 rounded-[3px] border border-navy-900/10 bg-white/95 px-4 py-3 shadow-[0_20px_45px_-30px_rgba(10,26,46,0.7)] backdrop-blur sm:-right-6"
              >
                <p className="font-display text-xl font-semibold text-navy-950">{about.badge.value}</p>
                <p className="mt-1 max-w-[9.5rem] text-[0.66rem] leading-snug font-semibold tracking-wide text-navy-600 uppercase">
                  {about.badge.label}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Values ribbon */}
      <Reveal className="mt-24 border-y border-navy-900/10 bg-white/60" y={20}>
        <Marquee items={VALUES} tone="light" speed="slow" className="py-4" />
      </Reveal>

      {/* River leaves this section and arrives at the next */}
      <FlowDivider className="mt-16 sm:mt-20" color="text-river-500" />
    </section>
  );
}
