import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { eventCategories, type EventCategory } from "../data/content";
import { cn } from "../lib/cn";
import { easeOut } from "../lib/motion";
import { useContent } from "../store/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Events() {
  const { events } = useContent();
  const [category, setCategory] = useState<EventCategory>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => events.filter((event) => category === "All" || event.category === category),
    [events, category],
  );

  const activeEvent = openIndex !== null ? visible[openIndex] : undefined;

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  const scrollByCard = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.85, 440);
    node.scrollBy({ left: direction * amount, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="events" className="relative overflow-hidden bg-cloud py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Events"
            title="Where the club comes together."
            lead="Service drives, learning labs, fellowship nights and district assemblies — curated so every member gets something to give and something to grow from."
            className="lg:max-w-2xl"
          />

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Scroll to previous events"
                className="grid size-11 place-items-center rounded-full border border-navy-900/15 text-navy-800 transition-colors hover:border-navy-900/40 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Scroll to next events"
                className="grid size-11 place-items-center rounded-full border border-navy-900/15 text-navy-800 transition-colors hover:border-navy-900/40 hover:bg-white"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Category filters */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-2" role="group" aria-label="Filter events by category">
            {eventCategories.map((item) => {
              const isActive = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setOpenIndex(null);
                  }}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative overflow-hidden rounded-full border px-4 py-2 text-[0.76rem] font-semibold tracking-tight transition-colors duration-300",
                    isActive
                      ? "border-navy-900 text-white"
                      : "border-navy-900/15 text-navy-600 hover:border-navy-900/35 hover:text-navy-950",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="event-filter-pill"
                      transition={{ duration: 0.4, ease: easeOut }}
                      className="absolute inset-0 -z-10 rounded-full bg-navy-900"
                    />
                  )}
                  {/* a light sweep across the chip on hover */}
                  <span aria-hidden="true" className="sheen" />
                  {item}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Carousel */}
        <div className="relative mt-10">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
            tabIndex={0}
            role="region"
            aria-label="Events carousel"
          >
            {visible.map((event, index) => (
              <article
                key={event.title + event.dateISO}
                className="w-[80vw] max-w-[24rem] shrink-0 snap-start sm:w-[22rem]"
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[3px] border border-navy-900/10 bg-white transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-34px_rgba(10,26,46,0.45)]">
                  {/* gold hairline folds in from the top edge on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#E0B878,#EFD3A1,transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
                  />
                  <div className="relative overflow-hidden bg-navy-900">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,36,0.15),rgba(8,20,36,0.55))]"
                    />
                    <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-navy-950/50 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.16em] text-white uppercase backdrop-blur">
                      {event.category}
                    </span>
                    <span
                      className={cn(
                        "absolute top-3 right-3 rounded-full px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.16em] uppercase backdrop-blur",
                        event.status === "upcoming"
                          ? "bg-gold-300/90 text-navy-950 animate-pulse-soft motion-reduce:animate-none"
                          : "bg-white/15 text-white/85",
                      )}
                    >
                      {event.status === "upcoming" ? "Upcoming" : "Past"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.16em] text-navy-500 uppercase">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      <time dateTime={event.dateISO}>{event.date}</time>
                    </p>
                    <h3 className="mt-3 text-[1.15rem] leading-snug font-semibold text-navy-950">
                      {event.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-navy-700/85">
                      {event.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-navy-900/10 pt-4">
                      <span className="flex items-center gap-1.5 text-[0.72rem] text-navy-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {event.location}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        className="inline-flex shrink-0 items-center gap-1.5 text-[0.8rem] font-semibold text-navy-900 transition-colors hover:text-river-600"
                        aria-label={`View details for ${event.title}`}
                      >
                        View Details
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="rounded-[3px] border border-dashed border-navy-900/20 px-4 py-10 text-center text-[0.9rem] text-navy-500">
              No events in this category yet — the board publishes events from the admin panel.
            </p>
          )}
          <p className="mt-2 text-[0.72rem] text-navy-500 sm:hidden">Swipe to see more events →</p>
        </div>
      </div>

      {/* Event details */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.4, ease: easeOut }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[4px] bg-white sm:rounded-[4px]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close event details"
                className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-navy-950/60 text-white backdrop-blur transition-colors hover:bg-navy-950/85"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <img
                src={activeEvent.image}
                alt={activeEvent.title}
                className="aspect-[16/9] w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-navy-900 px-3 py-1 text-[0.6rem] font-bold tracking-[0.16em] text-white uppercase">
                    {activeEvent.category}
                  </span>
                  <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-navy-500 uppercase">
                    {activeEvent.status === "upcoming" ? "Upcoming" : "Completed"}
                  </span>
                </div>

                <h3 id="event-modal-title" className="mt-5 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
                  {activeEvent.title}
                </h3>

                <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-navy-900/10 py-4 text-[0.85rem]">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-river-600" aria-hidden="true" />
                    <dt className="sr-only">Date</dt>
                    <dd className="font-semibold text-navy-800">
                      <time dateTime={activeEvent.dateISO}>{activeEvent.date}</time>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-river-600" aria-hidden="true" />
                    <dt className="sr-only">Location</dt>
                    <dd className="font-semibold text-navy-800">{activeEvent.location}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-navy-800/85">{activeEvent.details}</p>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-navy-600">{activeEvent.description}</p>

                <a
                  href="#contact"
                  onClick={() => setOpenIndex(null)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-[0.85rem] font-semibold text-white transition-colors hover:bg-navy-800"
                >
                  Register your interest
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
