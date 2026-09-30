import { ArrowUpRight, Check } from "lucide-react";
import { join, motto, site } from "../data/content";
import { AnchorOrbit } from "./motifs/AnchorOrbit";
import { CompassRose } from "./motifs/CompassRose";
import { MountainRange } from "./motifs/MountainRange";
import { Snowfall } from "./motifs/Snowfall";
import { FiligreeFrame, GoldRule } from "./motifs/Ornament";
import { Particles } from "./motifs/Particles";
import { RiverLines } from "./motifs/RiverLines";
import { MagneticButton } from "./ui/MagneticButton";
import { Reveal } from "./ui/Reveal";

/**
 * The end of the journey: the river reaches the summit. Sits on the deepest
 * navy with the banner's sunrise glowing behind the peaks.
 */
export function JoinUs() {
  return (
    <section
      id="join"
      className="relative isolate overflow-hidden bg-navy-950 py-24 text-white sm:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#061426_0%,#0B2137_30%,#173C5C_50%,#5C6F77_62%,#C0A272_72%,#2A4157_84%,#0A1A2E_100%)]"
      />
      <div aria-hidden="true" className="sunrise-wash animate-sunrise absolute inset-0 opacity-70" />
      {/* Sunrise behind the summit */}
      <div
        aria-hidden="true"
        className="absolute bottom-[26%] left-1/2 h-56 w-[80%] -translate-x-1/2 rounded-full bg-sun-300/25 blur-[130px]"
      />
      <Particles className="z-[1]" count={22} seed={23} color="bg-sun-300" rise />
      {/* Alpine air: snow drifting off the summit */}
      <Snowfall className="z-[1] opacity-60" count={30} seed={17} />

      {/* The banner's ornamental border, drawn around the whole section */}
      <FiligreeFrame
        inset="inset-3 sm:inset-5"
        size="size-9 sm:size-14"
        color="text-gold-300/45"
        className="z-[6]"
      />

      {/* The 3D gyroscope: rings orbit the anchor that never moves */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[3%] z-[2] flex justify-center text-river-300/[0.18]"
      >
        <AnchorOrbit
          className="h-[20rem] w-[20rem] sm:h-[30rem] sm:w-[30rem]"
          ringOpacity={0.9}
          glyphClassName="text-river-200/30"
        />
      </div>

      {/* The banner's compass star, turning slowly behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[16%] left-1/2 z-[1] -translate-x-1/2 opacity-[0.16]"
      >
        <CompassRose size={420} />
      </div>

      {/* River arriving at the peak */}
      <RiverLines
        className="absolute inset-x-0 bottom-[14%] z-[2] h-40 opacity-40"
        count={4}
        color="text-river-200"
      />

      <MountainRange
        color="text-[#071426]"
        className="absolute inset-x-0 bottom-0 z-[3] h-[42%]"
        ridgeOpacity={[0.45, 0.72, 1]}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px z-[4] h-14 w-full text-mist sm:h-20"
      >
        <path
          d="M0 58 C 200 96, 380 22, 600 56 C 800 88, 960 26, 1160 54 C 1290 72, 1370 48, 1440 62 L1440 120 L0 120 Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow flex items-center justify-center gap-3 text-sun-200">
            <span className="h-px w-8 bg-gold-300/60" aria-hidden="true" />
            {join.eyebrow}
            <span className="h-px w-8 bg-gold-300/60" aria-hidden="true" />
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-6 text-[2.2rem] leading-[1.05] font-semibold sm:text-5xl lg:text-[3.6rem]">
            <span className="bg-[linear-gradient(100deg,#FFFFFF_5%,#F4E0B4_55%,#E0B878_100%)] bg-clip-text text-transparent">
              {join.title}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-navy-100/80 sm:text-lg">
            {join.body}
          </p>
        </Reveal>

        {/* The motto strip, borrowed straight from the club banner */}
        <Reveal delay={0.15}>
          <div className="parchment-panel relative mt-10 px-6 py-6 sm:px-12">
            <p lang="sa" className="font-devanagari text-[1.15rem] leading-relaxed text-navy-900 sm:text-[1.35rem]">
              {motto.devanagariFull}
            </p>
            <GoldRule tone="light" className="mt-4" />
            <p className="eyebrow mt-4 text-[0.6rem] text-gold-700">{motto.english}</p>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href={join.primaryCta.href}
              variant="gold"
              size="lg"
              icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
            >
              {join.primaryCta.label}
            </MagneticButton>
            <MagneticButton href={join.secondaryCta.href} variant="outlineLight" size="lg">
              {join.secondaryCta.label}
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <ul className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {join.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2.5 text-[0.85rem] text-navy-100/70">
                <Check className="h-4 w-4 shrink-0 text-river-300" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The club's own wordmark, exactly as it is drawn on the crest */}
        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-col items-center gap-5">
            <GoldRule tone="dark" />
            <div className="relative grid place-items-center">
              {/* softens the ridge line behind the wordmark so it stays legible */}
              <span
                aria-hidden="true"
                className="absolute inset-x-2 inset-y-1 rounded-full bg-navy-950/60 blur-2xl"
              />
              <img
                src="/images/brand/logo-lockup.png"
                alt={`${site.clubName} — crest and wordmark`}
                loading="lazy"
                decoding="async"
                className="relative h-28 w-auto opacity-95"
              />
            </div>
            <p className="eyebrow text-[0.55rem] text-navy-100/45">
              {site.clubShortCode} · Club ID {site.clubId}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
