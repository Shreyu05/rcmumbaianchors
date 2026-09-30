import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { contact, site } from "../data/content";
import { cn } from "../lib/cn";
import { easeOut } from "../lib/motion";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const CHANNEL_ICONS = {
  instagram: Instagram,
  email: Mail,
  linkedin: Linkedin,
  location: MapPin,
  phone: Phone,
} as const;

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

type FieldName = keyof typeof EMPTY_FORM;

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  /** Name spans the full row; email and phone share the next one. */
  full?: boolean;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true, full: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
];

export function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please add your name and email so we can reply.");
      return;
    }
    setError("");
    // NOTE: this form is front-end only — connect a service or endpoint
    // (Formspree, EmailJS, your own API) to receive submissions. See README.
    setSent(true);
    setForm(EMPTY_FORM);
  };

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

  return (
    <section id="contact" className="relative overflow-hidden bg-mist py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-sun-200/70 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead} />

            <ul className="mt-10 divide-y divide-navy-900/10 border-t border-navy-900/10">
              {contact.channels.map((channel) => {
                const Icon = CHANNEL_ICONS[channel.key as keyof typeof CHANNEL_ICONS] ?? MapPin;
                const content = (
                  <span className="flex items-center gap-4 py-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-navy-900/12 bg-white text-navy-700 transition-colors duration-500 group-hover:border-gold-400/70 group-hover:text-gold-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow block text-[0.55rem] text-navy-400">{channel.label}</span>
                      <span className="mt-0.5 block truncate text-[0.95rem] font-semibold text-navy-900">
                        {channel.value}
                      </span>
                    </span>
                  </span>
                );

                return (
                  <li key={channel.key} className="group">
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel={channel.href.startsWith("http") ? "noreferrer noopener" : undefined}
                        className="block transition-transform duration-300 hover:translate-x-1"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[3px] border border-navy-900/10 bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-navy-900/10 px-6 py-5 sm:px-8">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-950">Send us a message</h3>
                    <p className="mt-1 text-[0.82rem] text-navy-600">
                      We usually respond within two working days.
                    </p>
                  </div>
                  <Send className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {FIELDS.map((field) => (
                      <div key={field.name} className={cn(field.full && "sm:col-span-2")}>
                        <label
                          htmlFor={`contact-${field.name}`}
                          className="eyebrow block text-[0.55rem] text-navy-500"
                        >
                          {field.label}
                          {field.required && <span className="text-gold-500"> *</span>}
                        </label>
                        <input
                          id={`contact-${field.name}`}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          required={field.required}
                          value={form[field.name]}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-[2px] border border-navy-900/15 bg-mist px-4 py-3 text-[0.95rem] text-navy-950 transition-colors duration-300 placeholder:text-navy-300 focus:border-river-400 focus:bg-white focus:outline-none"
                          placeholder={field.name === "phone" ? "Optional" : ""}
                        />
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className="eyebrow block text-[0.55rem] text-navy-500">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="mt-2 w-full resize-y rounded-[2px] border border-navy-900/15 bg-mist px-4 py-3 text-[0.95rem] text-navy-950 transition-colors duration-300 placeholder:text-navy-300 focus:border-river-400 focus:bg-white focus:outline-none"
                        placeholder="Tell us how you'd like to get involved…"
                      />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-4 text-[0.85rem] font-semibold text-gold-600">
                      {error}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <motion.button
                      type="submit"
                      whileTap={reduced ? undefined : { scale: 0.98 }}
                      className="group inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-colors duration-300 hover:bg-navy-800"
                    >
                      Submit
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </motion.button>
                    <p className="text-[0.75rem] text-navy-500">
                      Your details stay with the club and are never shared.
                    </p>
                  </div>

                  <div aria-live="polite" className="min-h-[1.5rem]">
                    {sent && (
                      <motion.p
                        initial={reduced ? undefined : { opacity: 0, y: 6 }}
                        animate={reduced ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: easeOut }}
                        className="mt-4 flex items-center gap-2 text-[0.9rem] font-semibold text-pine-600"
                      >
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Thank you — your message is noted. We'll be in touch shortly.
                      </motion.p>
                    )}
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Location / map */}
        <Reveal delay={0.12}>
          <div className="mt-14 overflow-hidden rounded-[3px] border border-navy-900/10 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-900/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gold-600" aria-hidden="true" />
                <p className="text-[0.9rem] font-semibold text-navy-900">{site.location}</p>
              </div>
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-navy-800 transition-colors hover:text-gold-600"
              >
                Open in Google Maps
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="relative h-72 w-full bg-cloud sm:h-80">
              {site.mapEmbedUrl ? (
                <iframe
                  src={site.mapEmbedUrl}
                  title="Map showing the club's base location in Mumbai"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="relative h-full w-full overflow-hidden">
                  <MapSketch />
                  <div className="absolute inset-0 grid place-items-center px-6 text-center">
                    <div className="max-w-sm rounded-[3px] border border-navy-900/10 bg-white/95 px-6 py-5 backdrop-blur">
                      <span className="mx-auto grid size-11 place-items-center rounded-full bg-navy-900 text-white">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="mt-3 font-display text-[1.05rem] font-semibold text-navy-950">
                        {site.clubName}
                      </p>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-navy-600">{contact.mapNote}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Stylised map placeholder: streets, water and a coastline hint. */
function MapSketch() {
  return (
    <svg
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full text-navy-300"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="1200" height="420" fill="#F7EFE0" />
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        {[60, 140, 220, 300, 380].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} />
        ))}
        {[100, 260, 420, 580, 740, 900, 1060].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420" />
        ))}
      </g>
      <g stroke="#A8C6CE" strokeWidth="2.5" fill="none" opacity="0.8">
        <path d="M0 96 C 260 150, 520 60, 780 130 C 940 172, 1080 120, 1200 158" />
        <path d="M0 268 C 240 232, 460 320, 720 268 C 900 232, 1050 300, 1200 262" />
      </g>
      <path
        d="M1200 0 L1200 420 L830 420 C 900 330, 1000 250, 1080 170 C 1130 118, 1170 60, 1200 0 Z"
        fill="#D2E3E6"
        opacity="0.85"
      />
      <circle cx="470" cy="196" r="34" fill="#0A1A2E" opacity="0.08" />
      <circle cx="470" cy="196" r="12" fill="#123A5C" />
      <circle cx="470" cy="196" r="22" fill="none" stroke="#123A5C" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}
