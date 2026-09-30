import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";
import { hero } from "../data/content";
import { useFinePointer } from "../hooks/useFinePointer";
import { cn } from "../lib/cn";
import { easeOut, staggerContainer, wordRise } from "../lib/motion";
import { MountainRange } from "./motifs/MountainRange";
import { Constellation3D } from "./motifs/Constellation3D";
import { FiligreeFrame, GoldRule } from "./motifs/Ornament";
import { Particles } from "./motifs/Particles";
import { RiverLines } from "./motifs/RiverLines";
import { MagneticButton } from "./ui/MagneticButton";
import { TiltCard } from "./ui/TiltCard";

/**
 * Headline entrance.
 *
 * `split` cascades the line word by word — only safe when the text is a solid
 * colour. Gradient (background-clip) text must animate as one block, because a
 * background only clips against its own element's glyphs: child spans would
 * inherit `color: transparent` and render nothing.
 */
function AnimatedLine({
  text,
  className,
  delay = 0,
  split = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  split?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  if (!split) {
    return (
      <motion.span
        className={cn("block", className)}
        initial={{ opacity: 0, y: "0.3em", filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: easeOut, delay }}
      >
        {text}
      </motion.span>
    );
  }

  const words = text.split(" ");

  return (
    <span className={cn("block", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "0.45em", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: easeOut, delay: delay + index * 0.075 }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* Scroll: the scene drifts apart as the hero leaves the viewport. */
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 110]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const plaqueY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);

  /* Pointer: the landscape leans very slightly, so the plaque in front of it
     reads as sitting in front of a photograph rather than pasted onto it. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const sceneRotateY = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.7 });
  const sceneRotateX = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.7 });

  const handlePointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (!fine || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerY.set(-((event.clientY - rect.top) / rect.height - 0.5) * 3.5);
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 4.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy-950 text-white"
    >
      {/* Sky taken from the club banner: deep navy at the base, steel blue
          through the middle, and a warm amber horizon behind the peaks. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#061426_0%,#0B2137_24%,#16394F_44%,#2C5C74_58%,#7E8A85_68%,#D9B67F_77%,#15304A_90%,#0A1A2E_100%)]"
      />
      {/* Breathing sunrise light */}
      <div aria-hidden="true" className="sunrise-wash animate-sunrise absolute inset-0 opacity-60" />
      {/* The dawn sky, as a pointer-parallax star field */}
      <Constellation3D className="opacity-70" count={56} seed={9} lines={5} />
      {/* Faint vertical hairlines for an editorial structure */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "clamp(90px, 12vw, 160px) 100%",
        }}
      />
      {/* The sun rising over the ridge line */}
      <motion.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="absolute top-[58%] left-1/2 h-64 w-[80%] -translate-x-1/2 sm:left-[64%] sm:w-[42%]"
      >
        <div className="animate-sunrise h-full w-full rounded-full bg-sun-300/30 blur-[120px]" />
      </motion.div>

      {/* ---- Landscape diorama ------------------------------------------- */}
      <div aria-hidden="true" className="scene-far pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ rotateX: sceneRotateX, rotateY: sceneRotateY, transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          {/* mid plane — the white water descending from the peaks */}
          <div
            className="absolute inset-x-0 bottom-[14%] h-[26%]"
            style={{ transform: "translateZ(-90px) scale(1.07)" }}
          >
            <motion.div style={{ y: sceneY }} className="absolute inset-0">
              <RiverLines count={4} color="text-river-200" className="absolute inset-0 opacity-40" />
            </motion.div>
          </div>

          {/* near plane — snow-lit ridges, as on the banner */}
          <div
            className="absolute inset-x-0 bottom-0 h-[54%]"
            style={{ transform: "translateZ(-30px) scale(1.03)" }}
          >
            <motion.div style={{ y: sceneY }} className="absolute inset-0">
              <MountainRange
                color="text-[#071426]"
                snowfall
                className="absolute inset-0"
                ridgeOpacity={[0.5, 0.78, 1]}
              />
            </motion.div>
          </div>

          {/* near plane — golden motes lift off the water */}
          <div className="absolute inset-0" style={{ transform: "translateZ(70px)" }}>
            <Particles count={26} seed={11} color="bg-sun-300" rise />
          </div>
        </motion.div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px z-[5] h-14 w-full text-mist sm:h-20"
      >
        <path
          d="M0 62 C 180 18, 350 92, 560 64 C 760 38, 900 98, 1100 70 C 1240 50, 1345 78, 1440 58 L1440 120 L0 120 Z"
          fill="currentColor"
        />
      </svg>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-32 sm:px-8 sm:pb-36"
      >
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* ---------------------------------------------------- the copy */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="eyebrow flex items-center gap-3 text-sun-200"
            >
              <span className="relative grid size-2 place-items-center" aria-hidden="true">
                <span className="absolute size-2 rounded-full bg-gold-300 animate-pulse-ring" />
                <span className="size-1.5 rounded-full bg-gold-300" />
              </span>
              {hero.eyebrow}
            </motion.p>

            <h1 className="mt-7 max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-[3.9rem] xl:text-[4.4rem]">
              <AnimatedLine text={hero.headlineTop} className="text-white" delay={0.15} split />
              <AnimatedLine
                text={hero.headlineBottom}
                className="mt-1 bg-[linear-gradient(100deg,#FDF4E4_0%,#EFD3A1_45%,#E0B878_100%)] bg-clip-text text-transparent"
                delay={0.45}
              />
            </h1>

            {/* The club motto, set exactly as it is lettered on the banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.7 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
            >
              <p
                lang="sa"
                className="gold-text font-devanagari text-[1.9rem] leading-[1.15] font-semibold sm:text-[2.3rem]"
              >
                {hero.motto.devanagari}
              </p>
              <span aria-hidden="true" className="hidden h-11 w-px bg-gold-400/40 sm:block" />
              <p className="eyebrow max-w-[15rem] text-[0.6rem] leading-[1.7] text-gold-200/85">
                {hero.motto.englishLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.9 }}
              className="mt-7 max-w-2xl text-[1.02rem] leading-relaxed text-navy-100/80 sm:text-lg"
            >
              {hero.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 1.05 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href={hero.primaryCta.href}
                variant="gold"
                size="lg"
                icon={<ArrowDown className="h-4 w-4" aria-hidden="true" />}
              >
                {hero.primaryCta.label}
              </MagneticButton>
              <MagneticButton
                href={hero.secondaryCta.href}
                variant="outlineLight"
                size="lg"
                icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              >
                {hero.secondaryCta.label}
              </MagneticButton>
            </motion.div>

            <motion.ul
              variants={staggerContainer(0.09, 1.25)}
              initial="hidden"
              animate="show"
              className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3"
            >
              {hero.badges.map((badge) => (
                <motion.li
                  key={badge}
                  variants={reduced ? undefined : wordRise}
                  className="flex items-center gap-2.5 overflow-hidden"
                >
                  <span className="h-px w-4 bg-gold-300/50" aria-hidden="true" />
                  <span className="eyebrow text-[0.6rem] text-navy-100/60">{badge}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ------------------------------------------- the club banner */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: easeOut, delay: 0.55 }}
            style={{ y: plaqueY }}
            className="lg:col-span-5"
          >
            <TiltCard intensity={7} lift={18} surfaceClassName="rounded-[5px]">
              <div className="gold-frame relative overflow-hidden rounded-[5px] bg-navy-900 shadow-[0_60px_120px_-60px_rgba(3,12,24,0.95)]">
                <img
                  src={hero.banner.src}
                  srcSet={hero.banner.srcSet}
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  width={hero.banner.width}
                  height={hero.banner.height}
                  alt={`Official club banner of the Rotaract Club of Mumbai Anchors — District 3141, Club ID 91947, motto ${hero.motto.devanagari}`}
                  fetchPriority="high"
                  decoding="async"
                  className="h-auto w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,38,0)_60%,rgba(6,20,38,0.45)_100%)]"
                />
                <FiligreeFrame inset="inset-2" size="size-9 sm:size-12" color="text-gold-200/75" />
              </div>
            </TiltCard>

            <div className="mt-6 flex items-center justify-center gap-4">
              <GoldRule tone="dark" className="hidden flex-1 sm:flex" />
              <p className="eyebrow shrink-0 text-[0.55rem] text-navy-100/55">{hero.banner.caption}</p>
              <GoldRule tone="dark" className="hidden flex-1 sm:flex" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{ opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-8 z-10 hidden justify-center sm:flex"
        aria-hidden="true"
      >
        <span className="flex items-center gap-3 text-[0.6rem] font-semibold tracking-[0.22em] text-navy-100/45 uppercase">
          <span className="relative grid h-9 w-[22px] place-items-start rounded-full border border-navy-100/25 p-1">
            <motion.span
              className="size-1.5 rounded-full bg-gold-300"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}
