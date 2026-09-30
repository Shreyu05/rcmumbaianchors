# Rotaract Club of Mumbai Anchors — Official Website

A premium, animated, fully responsive single-page website for the **Rotaract Club of Mumbai Anchors**.

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lucide icons**.

Design language: taken from the club's **official banner** — sunrise gold over deep navy peaks, snow
on the ridgelines, pale white water and gold filigree ornament. An anchor (stability), mountains
(ambition) and a flowing river (progress) are woven through the site as background motifs, dividers
and animations — never as cartoon graphics. The club crest and the banner itself are used as real
theme elements (see [The club's brand assets](#the-clubs-brand-assets)).

---

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build
```

Optional: regenerate the placeholder artwork at any time with `npm run generate:images` (the
placeholders are drawn in the banner's palette), or rebuild the club logo/banner/Favicon/OG assets
from the source images with `python scripts/brand-assets.py` (requires Pillow).

---

## Editing the website (no code knowledge needed)

**All text, numbers, people, events and images live in one file:**

### `src/data/content.ts`

| What you want to change | Where in the file |
| --- | --- |
| Club name, email, phone, location, social links, district, club ID, sponsor club, charter year | `site` |
| The club motto (Devanagari + English) | `motto` (also re-exported as `site.motto`) |
| Navigation menu items | `navLinks` |
| Hero headline, sub-text, buttons and the banner plaque | `hero` |
| About copy, vision, mission, "what Rotaract means" | `about` |
| Impact counters (members, events, initiatives, lives impacted) | `stats` |
| Team members, roles, bios and grouping | `team` + `teamGroups` + `teamSummary` |
| The two office bearers named on the banner | `team` entries marked `featured: true` → `bannerBearers` |
| Events (name, date, venue, category, description, details) | `events` |
| Projects (title, problem, what we did, impact, tags) | `projects` |
| Gallery images and captions | `gallery` |
| Achievements timeline milestones | `achievements` |
| "The Help Holders" — the nine past presidents | `pastPresidents` |
| Events, team, past presidents and impact counters at runtime | the **admin panel** (sign in as the admin → Admin panel) — stored in the browser, no code changes needed |
| "Join Us" section copy | `join` |
| Contact channels + map note | `contact` |
| Footer links, blurb and affiliation | `footer` |

Anything written in `[square brackets]` is a placeholder waiting for real club information.

### Replacing the placeholder images

Placeholder artwork lives in `public/images/` and is generated in the club's colours so the site
looks finished from day one. To use real photos, **drop your files in using the same names** — no
code changes needed:

```
public/images/events/event-1.svg      →  event-1.jpg   (also update the path in content.ts if you change the extension)
public/images/projects/project-1.svg
public/images/gallery/gallery-1.svg
public/images/team/member-1.svg       (square portrait, e.g. 800×1000 — member-1 … member-20)
public/images/about/about-main.svg
public/images/about/about-detail.svg
```

Or point the `image` fields at your own files/CDN URLs — any path works.

Recommended sizes: event/project images **16:10** (e.g. 1600×1000), team portraits **4:5**
(e.g. 800×1000), gallery images any of 4:5, 3:2 or 1:1.

### The club's brand assets

The real club artwork lives in `public/images/brand/` and is already wired into the site:

| File | Used for |
| --- | --- |
| `logo-crest.png` / `logo-crest-ink.png` | The crest beside the club name — white cut for navy surfaces, navy cut for pale ones (`motifs/Logo`) |
| `logo-lockup.png` | Crest **plus** the club's own wordmark, displayed on the Join Us section |
| `favicon.png`, `apple-touch-icon.png` | Browser tab / home-screen icons (crest on a navy tile) |
| `banner.jpg`, `banner-sm.jpg` | The official club banner — the gold-framed plaque in the hero (1920w / 960w `srcSet`) |
| `og-image.jpg` | 1200×630 social-sharing card, cropped from the banner |

The source logo is a white-on-black JPEG, so its luminance became the alpha channel — the black
background drops out and the anti-aliased edges survive. `scripts/brand-assets.py` does that and
regenerates every file above (it needs Pillow: `python scripts/brand-assets.py`). Drop in better
source art later and re-run it, or replace the PNGs outright — as long as the filenames and
proportions stay the same, nothing else needs to change.

### The team structure

The club's leadership is presented as **two groups**:

- **Board of Directors** — 11 people. The five office bearers (President, Vice President,
  Secretary, Joint Secretary, Treasurer) are marked `officeBearers: true`, which adds the gold
  "Office Bearer" chip to their card. The remaining six are functional directors.
- **Core Team** — 9 people, rendered as slightly more compact cards.

Adding or removing a person is just a `team` entry: set `category` to either
`"Board of Directors"` or `"Core Team"`. The group headings, per-group member counts and the
01/09/100+ summary strip all read from the data, so nothing else needs editing. `teamSummary`
holds the three headline numbers; avatars are generated for `member-1.svg` … `member-20.svg`.

The parchment strip above the groups is the banner's name bar, rebuilt in CSS: it shows every
member marked `featured: true` (currently the President and Secretary, exactly as they are lettered
on the official banner). Mark a different pair and the strip follows.

### Turning on the live map

1. Open Google Maps → search your club's location → **Share → Embed a map → Copy HTML**.
2. Copy only the `src="..."` URL into `site.mapEmbedUrl` in `src/data/content.ts`.
3. The stylised map illustration is replaced by the live embed automatically.

### Making the contact form actually send

The form is front-end only (it validates and shows a success message). Connect one of:

- **Formspree** — set `action="https://formspree.io/f/your-id"` and `method="POST"` on the `<form>`.
- **EmailJS / Resend / your own API** — call it inside `handleSubmit` in `src/components/Contact.tsx`.

### SEO / social preview

Update `index.html`: title, description, `canonical`, Open Graph/Twitter tags and the
`schema.org` block (club email, founding date, social profiles, office bearers). The link preview
already points at the real banner crop, `public/images/brand/og-image.jpg` — a 1200×630 JPEG, which
is what social platforms expect.

---

## Project structure

```
src/
├─ data/content.ts          ← all editable content
├─ App.tsx                  ← page composition (section order)
├─ index.css                ← design tokens: colours, fonts, keyframes, base styles
├─ lib/                     ← class-name helper, motion variants
├─ hooks/                   ← useActiveSection, useFinePointer (pointer-reactive effects)
└─ components/
   ├─ Navbar / Hero / About / Stats / Team / Events / Projects /
   │  Gallery / Achievements / HelpHolders / JoinUs / Contact / Footer
   ├─ motifs/               ← AnchorGlyph, AnchorOrbit (3D), Constellation3D (3D star
   │                          field), CompassRose, Snowfall, Logo/Crest, MountainRange,
   │                          RiverLines, Particles, Ornament (gold filigree frame,
   │                          gold rule, corner flourishes)
   └─ ui/                   ← Reveal, WordReveal, SectionHeading, MagneticButton,
                              Counter, TiltCard (3D), Marquee, Cursor (custom cursor),
                              IntroSplash (logo zoom-in intro)
```

### Motion, 3D and the reduced-motion contract

Every effect is decorative and layered on top of static content:

- **3D tilt cards** (`ui/TiltCard`) lean toward the pointer with a specular glare. Children can
  set their own `translateZ` for parallax depth.
- **`motifs/Constellation3D`** — a three-plane star field that separates in real parallax as the
  pointer moves; the hero and the impact strip sit under its skies.
- **`motifs/CompassRose`** — the banner's compass star, its layers counter-rotating; watch it
  half-buried in About and behind the Join Us heading.
- **`motifs/Snowfall`** — seeded flakes that fall and sway on the Join Us summit.- **A member sign-in and admin panel** — members register through **Sign In** in the navbar; the
  seeded admin account (`admin@mumbaianchors.org` / `anchors-admin` — change it) manages **events,
  team members, past presidents and the impact numbers** from the browser. Content persists in
  localStorage and can be exported/imported as JSON from the panel. This is demo-grade,
  browser-local auth — a real backend is the natural next step for production.
- **The intro splash** (`ui/IntroSplash`) — on every load the official crest zooms out of the
  dark and the curtain opens to reveal the site. The page renders underneath from the first
  frame; the overlay self-removes when done and skips to a calm cross-fade for reduced motion.
- **The hero is a 3D diorama** — the club banner sits in a gold-framed plaque in front of a
  sunrise landscape, and the river, snow-lit ridges and rising embers each sit at a different
  depth while the whole scene leans with the pointer and drifts on scroll.
- **The banner's ornament is reusable** — `motifs/Ornament` exports the four-corner filigree frame
  (`FiligreeFrame`, with an optional inner gold rule), and the hairline-diamond `GoldRule` divider.
- **`motifs/AnchorOrbit`** is a CSS-3D gyroscope: three rings orbit the club's anchor, which
  never moves.
- **Buttons** carry a rotating gradient hairline, corner brackets that fold in, a satellite dot
  orbiting the edge, a letter-by-letter rolling label, a light sweep, a ripple from the click
  point and an icon that swaps itself by sliding down.
- **A custom cursor** (`ui/Cursor`) — a precise gold dot, a lagging ring that widens into a
  warm lens over images, the club's anchor emblem over anything interactive, a wake of golden
  embers that scatters behind fast movement, and a ripple that rings out on every press. Fine
  pointers only; touch and reduced-motion visitors keep the native cursor.
- **"The Help Holders"** — the nine past presidents strung on a gold chain that fills as the
  section scrolls past; each portrait is lit in turn, one after another, earliest first.
- **Scroll work** — masked word-by-word headings, drift parallax on About/Stats/Projects, a
  timeline rail that fills as the achievements list scrolls past, and two infinite marquees.

All of it is driven by transforms and CSS animations. `prefers-reduced-motion: reduce` disables the
CSS animations globally (`src/index.css`), and every pointer-reactive component checks
`hooks/useFinePointer` — so touch and reduced-motion visitors get a completely static, cheap page.

### Design tokens

Colours and fonts are defined once in `src/index.css` under `@theme`:

- `navy-*` — deep ocean blues, sampled from the banner's peaks (text, dark sections)
- `sun-*` — sunrise light: cream through to amber (the banner's sky)
- `gold-*` — the metallic gold of the frame, motto and CTAs
- `pine-*` — the banner's forest treeline, a cooler counterweight
- `river-*` — water tones for the river motif and links
- `mist`, `cloud`, `cream`, `parchment`, `snow` — warm paper surfaces and highlights
- Fonts: **Fraunces** (display serif), **Manrope** (UI sans) and **Noto Serif Devanagari**
  (`font-devanagari`, used only for the club motto)

Surface treatments that carry the banner's look are plain CSS classes next to the tokens:
`.gold-frame` (gold hairline + inner rule), `.parchment-panel` (the cream name strip),
`.sunrise-wash` (the dawn light layer) and `.gold-text` (molten-gold type — never split into
child spans, since a clipped background only clips against its own glyphs).

Change a token there and every component follows.

---

## Animation & accessibility notes

- **Smooth scrolling**, sticky nav, scroll reveals, parallax hero, animated counters, hover
  transitions, magnetic CTAs, event/gallery modals and a scroll-progress bar.
- Every animation is **transform/opacity based** (cheap to composite) and decorative motifs are
  `aria-hidden`.
- `prefers-reduced-motion` is respected: reveals, parallax, counters and CSS keyframes are
  disabled for visitors who ask for calm.
- Keyboard support: skip link, visible focus rings, `Esc` closes modals/lightbox, arrow keys move
  through the gallery lightbox, `aria-pressed` on filters, `<time>` elements for event dates.

## Deployment

`npm run build` outputs a static site in `dist/` — deploy to Netlify, Vercel, Cloudflare Pages or
any static host. No server or environment variables are required.
