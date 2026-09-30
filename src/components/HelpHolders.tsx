import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { motto, site, type PastPresident } from "../data/content";
import { cn } from "../lib/cn";
import { useContent } from "../store/content";
import { Constellation3D } from "./motifs/Constellation3D";
import { CompassRose } from "./motifs/CompassRose";
import { GoldRule } from "./motifs/Ornament";
import { Particles } from "./motifs/Particles";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * "The Help Holders" — a hall of leaders for the club's past presidents.
 *
 * The portraits are strung on a glowing gold chain that fills top-to-bottom as
 * the section scrolls past, and each president is lit in turn — one after
 * another, like a lamp being passed down the line. Each card rises with the
 * exact stagger of its position, so on a fresh scroll the presidents arrive
 * strictly in sequence, earliest first.
 */

/* How far down the section the chain has filled when president N lights up.
   0.18 → 0.94 spreads the whole court evenly along the scroll. */
const litAt = (index: number, total: number) => 0.18 + (index / total) * 0.76;

function PresidentCard({
  president,
  index,
  total,
  progress,
}: {
  president: PastPresident;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();

  /* Each card waits for its own moment on the chain, then lights. */
  const point = litAt(index, total);
  const lit = useTransform(progress, [point, point + 0.08], [0, 1]);
  const glow = useSpring(lit, { stiffness: 90, damping: 22, mass: 0.5 });
  const glowOpacity = useTransform(glow, (v) => 0.25 + 0.75 * v);
  const haloOpacity = useTransform(glow, [0, 1], [0, 0.5]);
  const rimOpacity = useTransform(glow, [0, 1], [0.16, 0.55]);

  return (
    <motion.li
      className="group/pres relative flex flex-col items-center text-center"
      style={reduced ? undefined : { opacity: glowOpacity }}
    >
      {/* The lamp: a soft dawn light that blooms behind each president in turn */}
      <motion.span
        aria-hidden="true"
        style={{ opacity: haloOpacity }}
        className="pointer-events-none absolute top-6 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-sun-300/40 blur-[56px]"
      />

      <div className="relative">
        {/* Portrait: the gold frame stays quiet until lit, then the double
            rule catches fire and the portrait lifts forward. */}
        <motion.div
          whileHover={reduced ? undefined : { y: -8 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="gold-frame relative overflow-hidden rounded-[4px] bg-navy-900 shadow-[0_26px_60px_-34px_rgba(3,12,24,0.9)] transition-shadow duration-500 group-hover/pres:shadow-[0_40px_80px_-38px_rgba(3,12,24,0.95)]"
        >
          <img
            src={president.image}
            alt={`Portrait of ${president.name}, ${president.title} (${president.year})`}
            loading="lazy"
            decoding="async"
            width={720}
            height={720}
            className="aspect-square w-full object-cover transition-transform duration-[1100ms] ease-out group-hover/pres:scale-[1.06]"
          />
          {/* Dawn wash that strengthens as the president lights up */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: haloOpacity }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,224,180,0)_55%,rgba(244,224,180,0.22)_100%)]"
          />
        </motion.div>

        {/* The chain link: a diamond bead that kindles as the chain reaches it */}
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-3.5 left-1/2 z-10 grid size-[13px] -translate-x-1/2 rotate-45 place-items-center rounded-[2px] border border-gold-300/70 bg-navy-950"
          style={{ opacity: rimOpacity }}
        >
          <motion.span
            style={{ opacity: glow }}
            className="absolute inset-[2.5px] rounded-[1px] bg-[linear-gradient(135deg,#EFD3A1,#E0B878)]"
          />
          <motion.span
            className="absolute -inset-2 rounded-full border border-gold-300/50 animate-pulse-ring motion-reduce:animate-none"
            style={{ opacity: glow }}
          />
        </motion.span>
      </div>

      <span className="eyebrow mt-6 text-[0.55rem] text-gold-200/80">{president.year}</span>
      <h3 className="mt-1.5 font-display text-[1.02rem] leading-snug font-semibold text-white">
        {president.name}
      </h3>
      <p className="mt-1 text-[0.7rem] font-bold tracking-[0.16em] text-river-200/85 uppercase">
        {president.title}
      </p>
      <p className="mt-2.5 max-w-[24ch] text-[0.8rem] leading-relaxed text-navy-100/65">
        {president.note}
      </p>
    </motion.li>
  );
}

export function HelpHolders() {
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const { pastPresidents } = useContent();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 82%", "end 55%"],
  });
  /* The chain itself fills smoothly; each president reads a threshold off it. */
  const chain = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const chainScale = useTransform(chain, [0, 1], [0, 1]);

  return (
    <section
      id="help-holders"
      className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28 lg:py-32"
    >
      {/* The dawn sky the club has always sailed under */}
      <Constellation3D className="opacity-60" count={46} seed={57} lines={4} />
      <div aria-hidden="true" className="sunrise-wash animate-sunrise absolute inset-0 opacity-35" />
      {/* Golden motes lift through the hall */}
      <Particles className="z-[1]" count={18} seed={29} color="bg-sun-300" rise />
      {/* The banner's compass star, faint behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 opacity-[0.13]"
      >
        <CompassRose size={360} />
      </div>

      {/* Hairline rails behind the chain, portrait rows on mobile */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gold-300/[0.07] lg:block"
      />

      {/* The nameplate: a parchment ribbon carrying the motto into the hall */}
      <div
        aria-hidden="true"
        className="parchment-panel relative z-[2] overflow-hidden border-t border-b py-3.5"
      >
        <div className="animate-marquee-slow flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {[
                motto.devanagari,
                "The Help Holders",
                motto.english,
                `District ${site.district.replace(/^District /, "")}`,
                "Service Above Self",
              ].map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center">
                  <span
                    className={cn(
                      "px-6 text-[0.78rem] font-semibold tracking-[0.08em] whitespace-nowrap text-navy-900",
                      index % 2 === 0 && "font-devanagari text-[0.95rem]",
                    )}
                  >
                    {item}
                  </span>
                  <span className="size-1.5 rotate-45 bg-gold-500/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Help Holders"
          title="Nine hands that held the club, year after year."
          lead="Every term begins with a handover and ends with one. These are the presidents who carried Mumbai Anchors before us — the help holders whose steadiness the club still stands on."
          tone="dark"
          align="center"
          className="mx-auto"
        />

        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          {/* The chain: a gold river that fills as the court scrolls past */}
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-[15px] w-px bg-white/[0.08] lg:left-1/2 lg:-translate-x-1/2"
          />
          <motion.span
            aria-hidden="true"
            style={reduced ? { scaleY: 1 } : { scaleY: chainScale }}
            className="absolute top-4 bottom-4 left-[15px] w-px origin-top bg-[linear-gradient(180deg,rgba(239,211,161,0)_0%,rgba(239,211,161,0.65)_14%,#EFD3A1_55%,#E0B878_100%)] lg:left-1/2 lg:-translate-x-1/2"
          />

          <ul ref={listRef} className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-14">
            {pastPresidents.map((president, index) => (
              <PresidentCard
                key={president.name}
                president={president}
                index={index}
                total={pastPresidents.length}
                progress={chain}
              />
            ))}
          </ul>

          {/* Mobile rails: keep the chain visible between the two columns */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold-300/[0.05] lg:hidden"
          />
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <GoldRule tone="dark" line solid />
          <p className="max-w-xl text-center text-[0.85rem] leading-relaxed text-navy-100/55">
            Nine presidencies, one thread — service above self, passed hand to hand since the club&rsquo;s
            charter in {site.foundingYear}.
          </p>
        </div>
      </div>
    </section>
  );
}
