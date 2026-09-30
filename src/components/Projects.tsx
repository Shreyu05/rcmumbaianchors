import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, HandHeart, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { projects } from "../data/content";
import { cn } from "../lib/cn";
import { scaleIn } from "../lib/motion";
import { MountainRange } from "./motifs/MountainRange";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

const ROWS = [
  { key: "problem", label: "The Problem", icon: AlertCircle, accent: "text-gold-300" },
  { key: "action", label: "What We Did", icon: HandHeart, accent: "text-river-300" },
  { key: "impact", label: "The Impact", icon: TrendingUp, accent: "text-white" },
] as const;

/** One card. The photograph inside drifts against the card as you scroll, so
    the frame feels like a window rather than a flat image. */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-5%", "5%"]);

  return (
    <TiltCard className="h-full" intensity={6} lift={12} surfaceClassName="rounded-[3px]">
      <article
        ref={ref}
        className="group relative flex h-full flex-col overflow-hidden rounded-[3px] border border-white/10 bg-white/[0.035] transition-[border-color,background-color] duration-500 ease-out group-hover/tilt:border-river-300/35 group-hover/tilt:bg-white/[0.055]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
          <motion.img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            style={{ y: imageY }}
            className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover opacity-90"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,32,0.25)_0%,rgba(6,18,32,0.5)_45%,rgba(6,18,32,0.92)_100%)]"
          />
          {/* light sweep on card hover */}
          <span aria-hidden="true" className="sheen" />

          <span className="eyebrow absolute top-5 left-5 text-[0.58rem] text-river-200/90">
            Project {String(index + 1).padStart(2, "0")}
          </span>
          <div className="absolute inset-x-5 bottom-5">
            <h3 className="font-display text-[1.5rem] leading-tight font-semibold text-white sm:text-[1.7rem]">
              {project.title}
            </h3>
            <p className="mt-1.5 max-w-md text-[0.88rem] text-river-100/80">{project.tagline}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
          {ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.key} className="flex gap-4">
                <span
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-white/12 bg-white/5 transition-[transform,border-color] duration-500 ease-out group-hover/tilt:border-white/25 group-hover/tilt:[transform:translateY(-3px)]",
                    row.accent,
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[0.62rem] font-bold tracking-[0.2em] text-navy-100/55 uppercase">
                    {row.label}
                  </p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-navy-100/85">{project[row.key]}</p>
                </div>
              </div>
            );
          })}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/12 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-navy-100/70 uppercase transition-colors duration-500 group-hover/tilt:border-river-300/30 group-hover/tilt:text-river-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#08182B_0%,#0E2946_45%,#08182B_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-80">
        <MountainRange
          color="text-navy-700"
          className="absolute inset-0"
          detailed={false}
          ridgeOpacity={[0.2, 0.3, 0.42]}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projects & Initiatives"
          tone="dark"
          title="A portfolio of social impact, built in Mumbai."
          lead="Each initiative starts with a real problem, a measurable plan and a partner on the ground. Here is what we committed to — and what came of it."
          className="lg:max-w-3xl"
        />

        <RevealGroup stagger={0.12} className="mt-16 grid gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <RevealItem key={project.title} variants={scaleIn} className="h-full">
              <ProjectCard project={project} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl text-[0.9rem] leading-relaxed text-navy-100/60">
            Want to support, fund or partner on one of these initiatives? Write to us —{" "}
            <a
              href="#contact"
              className="font-semibold text-river-200 underline decoration-river-300/40 underline-offset-4 transition-colors hover:text-white"
            >
              start a conversation
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
