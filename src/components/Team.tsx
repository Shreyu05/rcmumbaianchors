import { Instagram, Linkedin, Star } from "lucide-react";
import { site, teamGroups, type TeamMember } from "../data/content";
import { cn } from "../lib/cn";
import { blurUp } from "../lib/motion";
import { useContent } from "../store/content";
import { AnchorGlyph } from "./motifs/AnchorGlyph";
import { GoldRule } from "./motifs/Ornament";
import { FlowDivider } from "./motifs/RiverLines";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { TiltCard } from "./ui/TiltCard";

function MemberCard({
  member,
  compact = false,
}: {
  member: TeamMember;
  compact?: boolean;
}) {
  const socials = [
    member.linkedin ? { icon: Linkedin, href: member.linkedin, label: `${member.name} on LinkedIn` } : null,
    member.instagram
      ? { icon: Instagram, href: member.instagram, label: `${member.name} on Instagram` }
      : null,
  ].filter((value): value is { icon: typeof Linkedin; href: string; label: string } => Boolean(value));

  return (
    <TiltCard
      className="h-full"
      intensity={7}
      lift={10}
      surfaceClassName="rounded-[3px]"
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[3px] border border-navy-900/10 bg-white transition-[box-shadow,border-color] duration-500 ease-out group-hover/tilt:border-navy-900/20 group-hover/tilt:shadow-[0_36px_70px_-38px_rgba(10,26,46,0.55)]">
        <div className="relative overflow-hidden bg-navy-900">
          <img
            src={member.image}
            alt={`${member.name} — ${member.role}, Rotaract Club of Mumbai Anchors`}
            loading="lazy"
            decoding="async"
            className={cn(
              "w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]",
              compact ? "aspect-square" : "aspect-[4/5]",
            )}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,36,0.05)_35%,rgba(8,20,36,0.85)_100%)]"
          />
          {/* the fine blueprint veil lifts on hover, adding a second layer of depth */}
          <div
            aria-hidden="true"
            className="grid-veil pointer-events-none absolute inset-0 text-white opacity-0 transition-opacity duration-700 group-hover:opacity-25"
          />
          {member.officeBearers && (
            <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-gold-200/40 bg-navy-950/60 px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.18em] text-gold-200 uppercase backdrop-blur">
              <Star className="h-3 w-3" aria-hidden="true" />
              Office Bearer
            </span>
          )}
          <div className="absolute inset-x-4 bottom-4">
            <h4 className="text-[1.05rem] leading-tight font-semibold text-white">{member.name}</h4>
            <p className="mt-1 text-[0.7rem] font-bold tracking-[0.16em] text-gold-200 uppercase">
              {member.role}
            </p>
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col justify-between gap-4", compact ? "p-4" : "p-5")}>
          <p className="text-[0.88rem] leading-relaxed text-navy-700/85">{member.bio}</p>
          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid size-8 place-items-center rounded-full border border-navy-900/10 text-navy-600 transition-colors duration-300 hover:border-river-400/60 hover:text-river-600"
                >
                  <social.icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    </TiltCard>
  );
}

export function Team() {
  const { team, bannerBearers, teamSummary } = useContent();

  return (
    <section id="team" className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-sun-200/70 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our Team"
            title="The people who keep the anchor steady."
            lead="Eleven board of directors and nine core members turn plans into ground reality — supported by every member who shows up."
            className="lg:max-w-2xl"
          />
          <RevealItem variants={blurUp} className="hidden lg:block">
            <div className="flex items-center gap-3 text-navy-500">
              <AnchorGlyph className="h-8 w-8 text-gold-600" strokeWidth={6} />
              <p className="max-w-[12rem] text-[0.8rem] leading-snug font-semibold tracking-wide text-navy-700 uppercase">
                Board term {site.term}
              </p>
            </div>
          </RevealItem>
        </div>

        {/* The banner's parchment strip, carrying the two named office bearers */}
        <Reveal delay={0.08} className="mt-12">
          <div className="parchment-panel px-6 py-7 sm:px-10">
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-gold-500/25">
              {bannerBearers.map((member) => (
                <div key={member.name} className="text-center sm:px-8">
                  <p className="font-display text-[1.15rem] font-semibold text-navy-900 sm:text-[1.3rem]">
                    {member.name}
                  </p>
                  <p className="eyebrow mt-2 text-[0.56rem] text-gold-700">{member.role}</p>
                </div>
              ))}
            </div>
            <GoldRule className="mt-6" />
          </div>
        </Reveal>

        {/* Counts, on their own 3D plinth */}
        <RevealGroup
          stagger={0.1}
          className="mt-12 grid grid-cols-3 divide-x divide-navy-900/10 rounded-[3px] border border-navy-900/10 bg-mist"
        >
          {teamSummary.map((item) => (
            <RevealItem key={item.label} variants={blurUp}>
              <div className="group px-5 py-6 text-center transition-colors duration-500 hover:bg-white">
                <p className="font-display text-[2rem] leading-none font-semibold text-navy-950 transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-[2.6rem]">
                  {item.value}
                </p>
                <p className="eyebrow mt-3 text-[0.55rem] text-navy-500">{item.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
          {teamGroups.map((group) => {
            const members = team.filter((member) => member.category === group.category);
            if (!members.length) return null;

            return (
              <div key={group.category}>
                <RevealItem variants={blurUp} className="mb-8">
                  <div className="flex flex-col gap-2 border-b border-navy-900/10 pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                    <div className="flex items-baseline gap-4">
                      <h3 className="font-display text-2xl font-semibold text-navy-950">{group.title}</h3>
                      <span className="eyebrow text-[0.58rem] text-navy-400">
                        {String(members.length).padStart(2, "0")} members
                      </span>
                    </div>
                    <p className="max-w-md text-[0.85rem] text-navy-600">{group.blurb}</p>
                  </div>
                </RevealItem>

                <RevealGroup
                  stagger={0.05}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {members.map((member) => (
                    <RevealItem key={member.name + member.role} variants={blurUp} className="h-full">
                      <MemberCard member={member} compact={group.category === "Core Team"} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            );
          })}
        </div>
      </div>

      <FlowDivider className="mt-20 sm:mt-24" color="text-river-400/70" flip />
    </section>
  );
}
