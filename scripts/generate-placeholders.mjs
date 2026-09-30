/**
 * Generates the site's placeholder artwork.
 *
 * Everything is drawn as cohesive navy / sunrise-gold scenes — the palette of
 * the club's official banner (deep navy peaks, warm dawn light, pale white
 * water) — so the placeholders already feel like the club's visual identity.
 * To use real club photos instead, drop your own files into `public/images/...`
 * using the same filenames (see README) — no code changes are required.
 *
 * Run with:  npm run generate:images
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const OUT = resolve(process.cwd(), "public", "images");

/* ------------------------------------------------------------------ utils */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n) => Math.round(n * 100) / 100;

/** Sharp triangular mountain ridge, closed to the bottom edge. */
function ridgePath(w, h, { baseY, count, height, seed, feather = 0.14 }) {
  const rand = rng(seed);
  const peaks = [];
  for (let i = 0; i < count; i++) {
    peaks.push(0.42 + rand() * 0.58);
  }
  let d = `M -30 ${round(h + 30)} L -30 ${round(baseY)}`;
  const span = w + 60;
  for (let i = 0; i < count; i++) {
    const x0 = (span / count) * i - 30;
    const x1 = (span / count) * (i + 1) - 30;
    const peakX = x0 + (x1 - x0) * (0.32 + rand() * 0.36);
    d += ` L ${round(peakX)} ${round(baseY - height * peaks[i])}`;
    d += ` L ${round(x1)} ${round(baseY - height * feather * rand())}`;
  }
  d += ` L ${round(w + 30)} ${round(baseY + height * 0.25)} L ${round(w + 30)} ${round(h + 30)} Z`;
  return d;
}

/** Soft rolling ridge drawn with quadratic smoothing. */
function rollingPath(w, h, { baseY, amp, seed, steps = 7 }) {
  const rand = rng(seed);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (w / steps) * i;
    const y =
      baseY -
      amp * (0.55 + 0.45 * Math.sin(t * Math.PI * 1.3 + rand() * 2)) -
      amp * 0.22 * Math.sin(t * Math.PI * 3.7);
    pts.push([x, y]);
  }
  let d = `M -30 ${round(h + 30)} L -30 ${round(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q ${round(px)} ${round(py)} ${round((px + x) / 2)} ${round((py + y) / 2)}`;
  }
  d += ` L ${round(w + 30)} ${round(h + 30)} Z`;
  return d;
}

function flowingLines(w, h, { seed, count = 5, color, baseY, spread, maxOpacity = 0.75 }) {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const y = baseY + (i / count) * spread + (rand() - 0.5) * spread * 0.18;
    const bend = (rand() - 0.5) * h * 0.16;
    const sw = 1 + rand() * 3.2;
    const op = maxOpacity * (0.28 + rand() * 0.72);
    out += `<path d="M ${round(-w * 0.1)} ${round(y)} C ${round(w * 0.22)} ${round(
      y - bend,
    )}, ${round(w * 0.62)} ${round(y + bend)}, ${round(w * 1.1)} ${round(y - bend * 0.4)}" stroke="${color}" stroke-width="${round(
      sw,
    )}" stroke-linecap="round" fill="none" opacity="${round(op)}"/>`;
  }
  return out;
}

function stars(w, h, seed, count, color = "#EAF4FF") {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h * 0.62;
    const r = 0.6 + rand() * 1.9;
    out += `<circle cx="${round(x)}" cy="${round(y)}" r="${round(r)}" fill="${color}" opacity="${round(
      0.12 + rand() * 0.45,
    )}"/>`;
  }
  return out;
}

const ANCHOR_PATH = `M0 -74 a 20 20 0 1 0 0 40 a 20 20 0 1 0 0 -40 M0 -34 L0 66 M-30 -34 L30 -34 M0 66 C 20 66 44 50 56 14 M0 66 C -20 66 -44 50 -56 14 M56 14 l 14 -18 M56 14 l -20 -4 M-56 14 l -14 -18 M-56 14 l 20 -4`;

function anchorMark(x, y, scale, color, opacity) {
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${scale})" opacity="${opacity}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"><path d="${ANCHOR_PATH}"/></g>`;
}

/* --------------------------------------------------------------- palettes */

const PALETTES = {
  deep: {
    sky: ["#0A1A2E", "#123A5C", "#2C5F7E"],
    glow: "#EFC98F",
    ridges: ["#1B4560", "#123049", "#0A1E33"],
    water: "#BFDCE8",
    star: "#FBF3E4",
  },
  harbour: {
    sky: ["#0C1F33", "#1B4A6E", "#3A7794"],
    glow: "#F3D3A0",
    ridges: ["#22536F", "#143A57", "#0A1D30"],
    water: "#CADFE9",
    star: "#FDF6EA",
  },
  monsoon: {
    sky: ["#0B1B2C", "#183C55", "#2E6577"],
    glow: "#EDC085",
    ridges: ["#1F4B5F", "#123449", "#091B2A"],
    water: "#B9D8E2",
    star: "#F9F1E3",
  },
  indigo: {
    sky: ["#0B1730", "#1E3763", "#33547F"],
    glow: "#F0CD9A",
    ridges: ["#28406F", "#182A50", "#0A1430"],
    water: "#C6DCEC",
    star: "#FBF4EA",
  },
  ember: {
    sky: ["#101A2A", "#2E4059", "#7A5C34"],
    glow: "#F6D2A2",
    ridges: ["#31405A", "#1E2A3D", "#0C1421"],
    water: "#D3E0E4",
    star: "#FFF6E9",
  },
};

const PALETTE_ORDER = ["deep", "harbour", "indigo", "monsoon", "ember"];

/* ---------------------------------------------------------------- scenes */

function scene({ w, h, seed, palette: paletteName = "deep", variant = "peaks", label = "" }) {
  const p = PALETTES[paletteName];
  const rand = rng(seed + 7);
  const horizon = h * (variant === "flow" ? 0.34 : 0.56);
  const sunX = w * (0.62 + rand() * 0.2);
  const sunY = h * (0.2 + rand() * 0.12);
  const sunR = Math.min(w, h) * (0.14 + rand() * 0.07);

  const far = ridgePath(w, h, {
    baseY: horizon + h * 0.1,
    count: 3 + Math.round(rand() * 3),
    height: h * 0.16,
    seed: seed + 11,
  });
  const mid = ridgePath(w, h, {
    baseY: horizon + h * 0.22,
    count: 3 + Math.round(rand() * 3),
    height: h * 0.24,
    seed: seed + 23,
  });
  const near = rollingPath(w, h, {
    baseY: horizon + h * 0.4,
    amp: h * 0.13,
    seed: seed + 31,
  });

  const ridges =
    variant === "flow"
      ? `<path d="${rollingPath(w, h, { baseY: horizon + h * 0.06, amp: h * 0.09, seed: seed + 5 })}" fill="${p.ridges[1]}" opacity="0.85"/>
         <path d="${rollingPath(w, h, { baseY: horizon + h * 0.16, amp: h * 0.07, seed: seed + 17 })}" fill="${p.ridges[2]}" opacity="0.95"/>`
      : `<path d="${far}" fill="${p.ridges[0]}" opacity="0.75"/>
         <path d="${mid}" fill="${p.ridges[1]}" opacity="0.9"/>
         <path d="${near}" fill="${p.ridges[2]}"/>`;

  const water = flowingLines(w, h, {
    seed: seed + 41,
    count: variant === "flow" ? 9 : 6,
    color: p.water,
    baseY: variant === "flow" ? h * 0.46 : h * 0.68,
    spread: h * (variant === "flow" ? 0.46 : 0.28),
    maxOpacity: variant === "flow" ? 0.5 : 0.62,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}"><defs>
<linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="0.55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${p.glow}" stop-opacity="0.95"/><stop offset="0.45" stop-color="${p.glow}" stop-opacity="0.35"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="0.5" cy="0.45" r="0.78"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
<linearGradient id="waterfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.water}" stop-opacity="0"/><stop offset="1" stop-color="${p.water}" stop-opacity="0.16"/></linearGradient>
<filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${round(Math.min(w, h) * 0.05)}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky)"/>
${stars(w, h, seed + 3, Math.round((w * h) / 26000), p.star)}
<circle cx="${round(sunX)}" cy="${round(sunY)}" r="${round(sunR * 2.4)}" fill="url(#sun)" filter="url(#blur)"/>
<circle cx="${round(sunX)}" cy="${round(sunY)}" r="${round(sunR * 0.42)}" fill="${p.glow}" opacity="0.55"/>
${ridges}
<rect width="${w}" height="${h}" fill="url(#waterfade)"/>
${water}
${anchorMark(w * 0.16, h * 0.34, Math.min(w, h) / 520, p.water, 0.14)}
<rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

function avatar({ name, seed, palette: paletteName = "deep" }) {
  const p = PALETTES[paletteName];
  const size = 720;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Portrait placeholder for ${name}"><defs>
<linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[0]}"/></linearGradient>
<linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.water}" stop-opacity="0.9"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0.9"/></linearGradient>
<radialGradient id="halo" cx="0.5" cy="0.38" r="0.6"><stop offset="0" stop-color="${p.glow}" stop-opacity="0.35"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
<clipPath id="clip"><rect width="${size}" height="${size}"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${size}" height="${size}" fill="url(#bg)"/>
<circle cx="${size * 0.5}" cy="${size * 0.34}" r="${size * 0.52}" fill="url(#halo)"/>
<path d="${rollingPath(size, size, { baseY: size * 0.82, amp: size * 0.09, seed: seed + 9 })}" fill="${p.ridges[1]}" opacity="0.65"/>
<path d="${rollingPath(size, size, { baseY: size * 0.92, amp: size * 0.07, seed: seed + 19 })}" fill="${p.ridges[2]}" opacity="0.85"/>
${flowingLines(size, size, { seed: seed + 29, count: 3, color: p.water, baseY: size * 0.86, spread: size * 0.1, maxOpacity: 0.4 })}
${anchorMark(size * 0.5, size * 0.46, size / 620, p.water, 0.16)}
<circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.28}" fill="#000" opacity="0.16"/>
<circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.28}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.012}"/>
<text x="${size * 0.5}" y="${size * 0.46}" text-anchor="middle" dominant-baseline="central" font-family="Fraunces, Georgia, 'Times New Roman', serif" font-size="${size * 0.22}" font-weight="600" fill="#F6FAFF" letter-spacing="2">${initials}</text>
</g>
</svg>`;
}

/* -------------------------------------------------------------- the plan */

const IMAGES = [
  // Events (16:10)
  { file: "events/event-1.svg", w: 1400, h: 900, seed: 101, palette: "deep", label: "Community service event" },
  { file: "events/event-2.svg", w: 1400, h: 900, seed: 202, palette: "harbour", label: "Professional development event" },
  { file: "events/event-3.svg", w: 1400, h: 900, seed: 303, palette: "indigo", variant: "flow", label: "Fellowship event" },
  { file: "events/event-4.svg", w: 1400, h: 900, seed: 404, palette: "monsoon", label: "Leadership event" },
  { file: "events/event-5.svg", w: 1400, h: 900, seed: 505, palette: "ember", variant: "flow", label: "Social impact event" },
  { file: "events/event-6.svg", w: 1400, h: 900, seed: 606, palette: "harbour", label: "Community service event" },
  // Projects (6:5)
  { file: "projects/project-1.svg", w: 1200, h: 1000, seed: 711, palette: "deep", label: "Coastal clean-up initiative" },
  { file: "projects/project-2.svg", w: 1200, h: 1000, seed: 822, palette: "indigo", label: "Learning for all initiative" },
  { file: "projects/project-3.svg", w: 1200, h: 1000, seed: 933, palette: "harbour", variant: "flow", label: "Community health initiative" },
  { file: "projects/project-4.svg", w: 1200, h: 1000, seed: 1044, palette: "ember", label: "Livelihood initiative" },
  // Gallery — mixed aspect ratios for the masonry grid
  { file: "gallery/gallery-1.svg", w: 1200, h: 1500, seed: 1101, palette: "deep", label: "Gallery photo" },
  { file: "gallery/gallery-2.svg", w: 1400, h: 950, seed: 1202, palette: "harbour", label: "Gallery photo" },
  { file: "gallery/gallery-3.svg", w: 1200, h: 1200, seed: 1303, palette: "indigo", label: "Gallery photo" },
  { file: "gallery/gallery-4.svg", w: 1200, h: 1500, seed: 1404, palette: "monsoon", variant: "flow", label: "Gallery photo" },
  { file: "gallery/gallery-5.svg", w: 1400, h: 950, seed: 1505, palette: "ember", label: "Gallery photo" },
  { file: "gallery/gallery-6.svg", w: 1200, h: 1200, seed: 1606, palette: "deep", variant: "flow", label: "Gallery photo" },
  { file: "gallery/gallery-7.svg", w: 1400, h: 950, seed: 1707, palette: "harbour", label: "Gallery photo" },
  { file: "gallery/gallery-8.svg", w: 1200, h: 1500, seed: 1808, palette: "indigo", label: "Gallery photo" },
  { file: "gallery/gallery-9.svg", w: 1200, h: 1200, seed: 1909, palette: "monsoon", label: "Gallery photo" },
  { file: "gallery/gallery-10.svg", w: 1400, h: 950, seed: 2010, palette: "ember", label: "Gallery photo" },
  { file: "gallery/gallery-11.svg", w: 1200, h: 1500, seed: 2111, palette: "deep", variant: "flow", label: "Gallery photo" },
  { file: "gallery/gallery-12.svg", w: 1200, h: 1200, seed: 2212, palette: "harbour", label: "Gallery photo" },
  // About
  { file: "about/about-main.svg", w: 1100, h: 1400, seed: 3100, palette: "deep", label: "Mumbai Anchors at work" },
  { file: "about/about-detail.svg", w: 1000, h: 900, seed: 3200, palette: "harbour", variant: "flow", label: "Mumbai Anchors community" },
  // The social-sharing card is no longer generated here: the real club banner
  // is cropped to 1200x630 by `scripts/brand-assets.py` instead.
];

const TEAM = [
  // Board of Directors (11)
  "Yakshesh Deepak Jadav",
  "Ananya Iyer",
  "Atharva Satyavan Nikam",
  "Sanya Kulkarni",
  "Kabir Nair",
  "Ishita Rao",
  "Vivaan Shah",
  "Meera Joshi",
  "Arjun Patil",
  "Diya Sharma",
  "Neel Kadam",
  // Core Team (9)
  "Riya Bhatt",
  "Aditya Kamat",
  "Sara Fernandes",
  "Yash Thakur",
  "Tanvi Sawant",
  "Dev Malhotra",
  "Nikita Shetty",
  "Ayaan Shaikh",
  "Priya Menon",
];

// "The Help Holders" — the nine past presidents (placeholder names; swap in
// the real ones here and in `src/data/content.ts` when you have the record).
const PAST_PRESIDENTS = [
  "President One",
  "President Two",
  "President Three",
  "President Four",
  "President Five",
  "President Six",
  "President Seven",
  "President Eight",
  "President Nine",
];

let count = 0;
for (const image of IMAGES) {
  const target = resolve(OUT, image.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, scene(image), "utf8");
  count += 1;
}

TEAM.forEach((name, index) => {
  const target = resolve(OUT, "team", `member-${index + 1}.svg`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    avatar({
      name,
      seed: 5000 + index * 37,
      palette: PALETTE_ORDER[index % PALETTE_ORDER.length],
    }),
    "utf8",
  );
  count += 1;
});

PAST_PRESIDENTS.forEach((name, index) => {
  const target = resolve(OUT, "team", `past-president-${index + 1}.svg`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    avatar({
      name,
      seed: 6400 + index * 41,
      palette: PALETTE_ORDER[(index + 2) % PALETTE_ORDER.length],
    }),
    "utf8",
  );
  count += 1;
});

console.log(`Generated ${count} placeholder images into public/images`);
