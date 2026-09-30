import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { gallery, galleryCategories, type GalleryCategory } from "../data/content";
import { cn } from "../lib/cn";
import { easeOut } from "../lib/motion";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

const ASPECT: Record<string, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => gallery.filter((item) => filter === "All" || item.category === filter),
    [filter],
  );

  const active = activeIndex !== null ? visible[activeIndex] : undefined;

  const step = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        const next = (current + direction + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, step]);

  return (
    <section id="gallery" className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments that became memories."
          lead="Service days, celebrations, fellowship trips and the small in-between moments that make this club feel like home."
          align="center"
        />

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery">
            {galleryCategories.map((item) => {
              const isActive = item === filter;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setFilter(item);
                    setActiveIndex(null);
                  }}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-[0.76rem] font-semibold tracking-tight transition-colors duration-300",
                    isActive
                      ? "border-navy-900 text-white"
                      : "border-navy-900/15 text-navy-600 hover:border-navy-900/35 hover:text-navy-950",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="absolute inset-0 -z-10 rounded-full bg-navy-900"
                    />
                  )}
                  {item}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visible.map((item, index) => (
            <motion.div
              key={item.src}
              initial={reduced ? undefined : { opacity: 0, y: 26, filter: "blur(10px)" }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.75, ease: easeOut }}
              className="mb-5 break-inside-avoid"
            >
              <TiltCard intensity={6} lift={10} surfaceClassName="rounded-[3px]">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Open image: ${item.caption}`}
                  className="group relative block w-full overflow-hidden rounded-[3px] border border-navy-900/10 bg-navy-900 text-left"
                >
                  <div className={cn("overflow-hidden", ASPECT[item.aspect])}>
                    <img
                      src={item.src}
                      alt={item.caption}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,36,0)_45%,rgba(8,20,36,0.78)_100%)] opacity-70 transition-opacity duration-500 group-hover:opacity-95"
                  />
                  {/* warm glow that follows the pointer, above the image */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 [background:radial-gradient(60%_60%_at_50%_110%,rgba(229,172,78,0.35),transparent_70%)]"
                  />
                  <span className="pointer-events-none absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/12 text-white opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-1.5 transition-transform duration-500 group-hover:translate-y-0">
                    <span className="block text-[0.62rem] font-bold tracking-[0.2em] text-river-200 uppercase">
                      {item.category}
                    </span>
                    <span className="mt-1 block text-[0.92rem] font-semibold text-white">{item.caption}</span>
                  </span>
                </button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            className="fixed inset-0 z-[80] flex flex-col bg-navy-950/94 backdrop-blur-md"
            onClick={() => setActiveIndex(null)}
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-navy-100/70 uppercase">
                {String((activeIndex ?? 0) + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Close gallery"
                className="grid size-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 pb-4" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="mr-3 hidden size-11 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:grid"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <motion.figure
                key={active.src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="max-h-full"
              >
                <img
                  src={active.src}
                  alt={active.caption}
                  className="mx-auto max-h-[70svh] w-auto rounded-[3px] object-contain shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
                />
                <figcaption className="mt-5 text-center">
                  <span className="block text-[0.62rem] font-bold tracking-[0.2em] text-river-200 uppercase">
                    {active.category}
                  </span>
                  <span className="mt-1.5 block text-[0.95rem] font-semibold text-white">{active.caption}</span>
                </figcaption>
              </motion.figure>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="ml-3 hidden size-11 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:grid"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 pb-6 sm:hidden">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
