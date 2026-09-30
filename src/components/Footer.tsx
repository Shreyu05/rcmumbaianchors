import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { footer, motto, site } from "../data/content";
import { Crest, Logo } from "./motifs/Logo";
import { GoldRule } from "./motifs/Ornament";
import { RiverLines } from "./motifs/RiverLines";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";

const RIBBON = [
  motto.devanagari,
  ...motto.englishLines,
  "Service Above Self",
  `${site.district} · Club ID ${site.clubId}`,
];

const SOCIALS = [
  { icon: Instagram, href: site.instagram, label: "Instagram" },
  { icon: Linkedin, href: site.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${site.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-navy-100">
      {/* The club's motto, running forever along the top of the footer */}
      <div className="relative z-10 border-b border-white/10">
        <Marquee items={RIBBON} tone="dark" speed="slow" reverse mark className="py-4" />
      </div>

      {/* flowing-line roof */}
      <RiverLines className="absolute inset-x-0 top-16 h-24 opacity-30" count={3} />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo tone="light" />

            {/* The motto, straight from the banner */}
            <div className="mt-6 flex items-center gap-4">
              <p
                lang="sa"
                className="gold-text font-devanagari text-[1.35rem] leading-none font-semibold"
              >
                {motto.devanagari}
              </p>
              <span aria-hidden="true" className="h-9 w-px bg-gold-400/30" />
              <p className="eyebrow text-[0.52rem] leading-[1.7] text-gold-200/70">
                {motto.englishLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <p className="mt-6 max-w-sm text-[0.9rem] leading-relaxed text-navy-100/65">{footer.blurb}</p>

            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  aria-label={`${site.clubName} on ${social.label}`}
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-navy-100/80 transition-colors duration-300 hover:border-river-300/50 hover:text-white"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer quick links">
            <h2 className="eyebrow text-[0.55rem] text-river-200">{footer.columns.quickLinks}</h2>
            <ul className="mt-5 space-y-3">
              {footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[0.88rem] text-navy-100/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="h-px w-0 bg-river-300 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-[0.55rem] text-river-200">{footer.columns.contact}</h2>
            <ul className="mt-5 space-y-4 text-[0.88rem]">
              <li className="flex items-start gap-3 text-navy-100/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-river-300" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-navy-100/70">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-river-300" aria-hidden="true" />
                <span>{site.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-navy-100/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-river-300" aria-hidden="true" />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-[0.55rem] text-sun-200">{footer.columns.affiliation}</h2>
            <div className="gold-frame mt-5 rounded-[3px] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <Crest tone="light" className="h-10" alt={`${site.clubName} crest`} />
                <div>
                  <p className="text-[0.85rem] font-semibold text-white">{site.clubShortCode}</p>
                  <p className="text-[0.72rem] text-navy-100/55">Rotaract year {site.term}</p>
                </div>
              </div>

              <dl className="mt-5 space-y-2.5 text-[0.8rem]">
                {[
                  { label: "District", value: site.district },
                  { label: "Club ID", value: site.clubId },
                  { label: "Sponsored by", value: site.sponsorClub },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4">
                    <dt className="shrink-0 text-navy-100/45">{row.label}</dt>
                    <dd className="text-right text-navy-100/85">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <GoldRule tone="dark" align="start" className="mt-5" />
              <p className="mt-4 text-[0.75rem] leading-relaxed text-navy-100/45">{site.affiliation}</p>
            </div>
          </div>
        </div>

        <Reveal delay={0.05}>
          <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-7 sm:flex-row sm:justify-between">
            <p className="text-[0.78rem] text-navy-100/45">{footer.legal}</p>
            <p className="flex items-center gap-2.5 text-[0.78rem] text-navy-100/45">
              <span lang="sa" className="font-devanagari text-gold-200/70">
                {motto.devanagari}
              </span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span className="text-sun-200/70">{site.location}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
