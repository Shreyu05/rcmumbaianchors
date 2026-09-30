/* ==========================================================================
   ALL WEBSITE CONTENT LIVES HERE.
   Edit the values in this file to update the site — no other file needs to
   change. Text in [square brackets] is a placeholder waiting for real club
   information, and every `image` path can be swapped for a real photo
   (e.g. "/images/events/beach-cleanup.jpg").
   ========================================================================== */

/**
 * The club motto, exactly as it is written on the official banner. The
 * Devanagari lines are set in "Noto Serif Devanagari" (see index.html), so any
 * component that prints them should use the `font-devanagari` utility.
 */
export const motto = {
  devanagari: "सतत प्रवाहः",
  devanagariFull: "अचलः संकल्पः । निरन्तरः प्रवाहः।",
  english: "Steadfast in Resolve. Unceasing in Flow.",
  englishLines: ["Steadfast in Resolve.", "Unceasing in Flow."],
};

export const site = {
  clubName: "Rotaract Club of Mumbai Anchors",
  shortName: "Mumbai Anchors",
  clubShortCode: "RAC Mumbai Anchors",
  /** Printed on the club banner beside the Rotary gear. */
  clubId: "91947",
  affiliation: "Rotaract — a Rotary International program for young leaders",
  district: "District 3141",
  /** The club that sponsors / guides Mumbai Anchors. */
  sponsorClub: "Rotary Club of Borivli",
  /** The Rotaract year this board serves. */
  term: "2026–27",
  foundingYear: "2024", // ← replace with your charter year
  email: "hello@mumbaianchors.org", // ← placeholder
  phone: "+91 98XXX XXXXX", // ← placeholder
  location: "Mumbai, Maharashtra, India",
  instagram: "https://instagram.com/", // ← replace with the club handle
  linkedin: "https://linkedin.com/", // ← replace with the club page
  // Replace with a Google Maps embed URL (Share → Embed a map → copy src)
  mapEmbedUrl: "",
  mapQuery: "Mumbai, Maharashtra, India",
  tagline: "Anchored in Purpose. Moving Towards Impact.",
  motto,
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Our Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Achievements", href: "#achievements" },
  { label: "Help Holders", href: "#help-holders" },
  { label: "Join Us", href: "#join" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: `Rotaract Club of Mumbai Anchors · ${site.district}`,
  headlineTop: "Anchored in Purpose.",
  headlineBottom: "Moving Towards Impact.",
  motto,
  subhead:
    "Rotaract Club of Mumbai Anchors — a community of young leaders driven by service, creativity and meaningful change.",
  primaryCta: { label: "Explore Our Journey", href: "#about" },
  secondaryCta: { label: "Join Mumbai Anchors", href: "#join" },
  /** Real club facts from the banner, shown as a rule under the hero copy. */
  badges: [
    `District 3141`,
    `Club ID ${site.clubId}`,
    `Sponsored by ${site.sponsorClub}`,
    "Mumbai, India",
  ],
  /** The official club banner, framed in the hero like a plaque. */
  banner: {
    src: "/images/brand/banner.jpg",
    srcSet: "/images/brand/banner-sm.jpg 960w, /images/brand/banner.jpg 1920w",
    width: 1920,
    height: 1280,
    caption: `Official club banner · ${site.term}`,
  },
};

export const about = {
  eyebrow: "Who We Are",
  title: "A young club with a deep-rooted resolve.",
  lead: "Mumbai Anchors is a Rotaract club built by young Mumbaikars who believe service should be visible, sustained and shared. We work at the intersection of community need and youthful energy.",
  paragraphs: [
    "We are students, early-career professionals and founders who meet as equals, plan with intent and show up for the city. From coastal clean-ups to literacy drives, mentorship circles to fellowship nights — everything we do is anchored to a purpose larger than ourselves.",
    "Being part of Rotaract means joining a global movement of young people who serve above self. It is where leadership is learned by doing, where friendships become networks, and where small consistent action compounds into lasting change.",
  ],
  pillars: [
    {
      title: "Our Vision",
      body: "A city where young people lead with empathy — where every neighbourhood feels the steady weight of collective responsibility.",
    },
    {
      title: "Our Mission",
      body: "To design and deliver service projects that create measurable impact, while building leaders who carry that habit of service for life.",
    },
    {
      title: "What Rotaract Means to Us",
      body: "Service above self, practised among friends. A place to grow, to lead early, and to belong to something that outlasts a single year.",
    },
  ],
  images: {
    main: "/images/about/about-main.svg",
    detail: "/images/about/about-detail.svg",
  },
  badge: { value: "10,000+", label: "Rotaract clubs worldwide" },
};

export const stats: {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}[] = [
  { value: 0, suffix: "+", label: "Members", sublabel: "Active anchors" },
  { value: 0, suffix: "+", label: "Events", sublabel: "Hosted and counting" },
  { value: 0, suffix: "+", label: "Community Initiatives", sublabel: "Across Mumbai" },
  { value: 0, suffix: "+", label: "Lives Impacted", sublabel: "Direct beneficiaries" },
];

export type TeamCategory = "Board of Directors" | "Core Team";

export type TeamMember = {
  name: string;
  role: string;
  category: TeamCategory;
  bio: string;
  image: string;
  /** Rendered as a larger, gold-accented card in the board grid. */
  officeBearers?: boolean;
  /** Named on the official club banner — shown in the team section's strip. */
  featured?: boolean;
  linkedin?: string;
  instagram?: string;
};

/** 11 board of directors + 9 core members = a 20-person leadership family. */
export const team: TeamMember[] = [
  /* ------------------------------------------------ Board of Directors (11) */
  {
    name: "Yakshesh Deepak Jadav",
    role: "President — 2026–27",
    category: "Board of Directors",
    bio: "Sets the club's direction and keeps every project anchored to purpose.",
    image: "/images/team/member-1.svg",
    officeBearers: true,
    featured: true,
  },
  {
    name: "Ananya Iyer",
    role: "Vice President",
    category: "Board of Directors",
    bio: "Builds the teams behind each initiative and mentors the incoming batch.",
    image: "/images/team/member-2.svg",
    officeBearers: true,
  },
  {
    name: "Atharva Satyavan Nikam",
    role: "Secretary — 2026–27",
    category: "Board of Directors",
    bio: "Keeps the club accountable — records, reporting and district compliance.",
    image: "/images/team/member-3.svg",
    officeBearers: true,
    featured: true,
  },
  {
    name: "Sanya Kulkarni",
    role: "Joint Secretary",
    category: "Board of Directors",
    bio: "Supports the secretariat, minutes and the club's documentation trail.",
    image: "/images/team/member-4.svg",
    officeBearers: true,
  },
  {
    name: "Kabir Nair",
    role: "Treasurer",
    category: "Board of Directors",
    bio: "Stewards every rupee raised so it reaches the community intact.",
    image: "/images/team/member-5.svg",
    officeBearers: true,
  },
  {
    name: "Ishita Rao",
    role: "Director — Community Service",
    category: "Board of Directors",
    bio: "Designs service projects with measurable, verifiable outcomes.",
    image: "/images/team/member-6.svg",
  },
  {
    name: "Vivaan Shah",
    role: "Director — Professional Development",
    category: "Board of Directors",
    bio: "Turns members' ambitions into skills through workshops and mentorship.",
    image: "/images/team/member-7.svg",
  },
  {
    name: "Meera Joshi",
    role: "Director — International Service",
    category: "Board of Directors",
    bio: "Connects Mumbai Anchors to Rotaract clubs and causes beyond the city.",
    image: "/images/team/member-8.svg",
  },
  {
    name: "Arjun Patil",
    role: "Director — Public Image",
    category: "Board of Directors",
    bio: "Tells the club's story with clarity, craft and consistency.",
    image: "/images/team/member-9.svg",
  },
  {
    name: "Diya Sharma",
    role: "Director — Fellowship",
    category: "Board of Directors",
    bio: "Protects the culture — making sure everyone belongs and stays.",
    image: "/images/team/member-10.svg",
  },
  {
    name: "Neel Kadam",
    role: "Director — Membership & Engagement",
    category: "Board of Directors",
    bio: "Welcomes new members and builds their first year of growth.",
    image: "/images/team/member-11.svg",
  },

  /* ------------------------------------------------------- Core Team (9) */
  {
    name: "Riya Bhatt",
    role: "Core Team — Projects",
    category: "Core Team",
    bio: "On-ground execution: logistics, partners and field coordination.",
    image: "/images/team/member-12.svg",
  },
  {
    name: "Aditya Kamat",
    role: "Core Team — Design",
    category: "Core Team",
    bio: "Shapes every visual the club puts into the world.",
    image: "/images/team/member-13.svg",
  },
  {
    name: "Sara Fernandes",
    role: "Core Team — Content & Social",
    category: "Core Team",
    bio: "Runs the club's words and channels, week after week.",
    image: "/images/team/member-14.svg",
  },
  {
    name: "Yash Thakur",
    role: "Core Team — Partnerships",
    category: "Core Team",
    bio: "Connects the club with NGOs, brands and civic partners.",
    image: "/images/team/member-15.svg",
  },
  {
    name: "Tanvi Sawant",
    role: "Core Team — Events",
    category: "Core Team",
    bio: "Turns ideas into calendars, run-sheets and flawless event days.",
    image: "/images/team/member-16.svg",
  },
  {
    name: "Dev Malhotra",
    role: "Core Team — Finance",
    category: "Core Team",
    bio: "Tracks budgets and receipts so every drive stays transparent.",
    image: "/images/team/member-17.svg",
  },
  {
    name: "Nikita Shetty",
    role: "Core Team — Outreach",
    category: "Core Team",
    bio: "Takes our causes to colleges, societies and neighbourhoods.",
    image: "/images/team/member-18.svg",
  },
  {
    name: "Ayaan Shaikh",
    role: "Core Team — Technology",
    category: "Core Team",
    bio: "Builds the tools and this website that keep the club running.",
    image: "/images/team/member-19.svg",
  },
  {
    name: "Priya Menon",
    role: "Core Team — Volunteer Coordination",
    category: "Core Team",
    bio: "Matches members to roles and keeps every volunteer energised.",
    image: "/images/team/member-20.svg",
  },
];

/**
 * The office bearers printed on the official club banner. Derived from `team`
 * so the names only ever live in one place.
 */
export const bannerBearers = team.filter((member) => member.featured);

export type PastPresident = {
  name: string;
  /** The Rotaract year this president led the club, e.g. "2024–25". */
  year: string;
  title: string;
  note: string;
  image: string;
};

/**
 * "The Help Holders" — the nine past presidents whose steady hands have held
 * the club since its charter.
 *
 * PLACEHOLDER DATA: the names, years and notes below are examples waiting to
 * be replaced with the real record of the club's leadership. Swap in the real
 * names and terms, and point `image` at each president's photo (a square crop
 * works best) — e.g. "/images/team/past-president-1.jpg".
 */
export const pastPresidents: PastPresident[] = [
  {
    name: "President One",
    year: "2024–25",
    title: "Charter President",
    note: "Held the club through its charter year — the first anchor dropped, the first projects rowed out.",
    image: "/images/team/past-president-1.svg",
  },
  {
    name: "President Two",
    year: "2024–25",
    title: "The Builder",
    note: "Turned early enthusiasm into working systems — rosters, records and the club's first traditions.",
    image: "/images/team/past-president-2.svg",
  },
  {
    name: "President Three",
    year: "2025–26",
    title: "The Connector",
    note: "Opened the club's doors to partner NGOs and sister clubs across the district.",
    image: "/images/team/past-president-3.svg",
  },
  {
    name: "President Four",
    year: "2025–26",
    title: "The Campaigner",
    note: "Led the flagship service drives that put Mumbai Anchors on the district map.",
    image: "/images/team/past-president-4.svg",
  },
  {
    name: "President Five",
    year: "2025–26",
    title: "The Mentor",
    note: "Grew the membership family and built the mentorship circles that still run today.",
    image: "/images/team/past-president-5.svg",
  },
  {
    name: "President Six",
    year: "2026–27",
    title: "The Strategist",
    note: "Set the club's first three-year plan — impact measured, documented and celebrated.",
    image: "/images/team/past-president-6.svg",
  },
  {
    name: "President Seven",
    year: "2026–27",
    title: "The Voice",
    note: "Told the club's story to the city — public image, press and the digital footprint.",
    image: "/images/team/past-president-7.svg",
  },
  {
    name: "President Eight",
    year: "2026–27",
    title: "The Steward",
    note: "Kept every rupee accounted for and every partnership honoured.",
    image: "/images/team/past-president-8.svg",
  },
  {
    name: "President Nine",
    year: "2026–27",
    title: "The Unifier",
    note: "Held nine presidents' worth of wisdom together — the steady hand behind the handover.",
    image: "/images/team/past-president-9.svg",
  },
];

export const teamGroups: { title: string; category: TeamCategory; blurb: string }[] = [
  {
    title: "Board of Directors",
    category: "Board of Directors",
    blurb: "Eleven office bearers and directors who carry the club's mandate for the year.",
  },
  {
    title: "Core Team",
    category: "Core Team",
    blurb: "Nine core members — the engine room of execution, design and outreach.",
  },
];

/** Headline counts echoed in the team section header. */
export const teamSummary = [
  { value: "11", label: "Board of Directors" },
  { value: "09", label: "Core Members" },
  { value: "100+", label: "Members strong" },
];

export const eventCategories = [
  "All",
  "Community Service",
  "Professional Development",
  "Fellowship",
  "Leadership",
  "Social Impact",
] as const;

export type EventCategory = (typeof eventCategories)[number];

export type ClubEvent = {
  title: string;
  date: string;
  dateISO: string;
  location: string;
  category: Exclude<EventCategory, "All">;
  description: string;
  details: string;
  image: string;
  status: "upcoming" | "past";
};

/**
 * The live event list, managed by the board through the admin panel and stored
 * in the visitor's browser. It starts empty — events are added in the admin
 * panel without touching the codebase.
 */
export const events: ClubEvent[] = [];

export const projects: {
  title: string;
  tagline: string;
  problem: string;
  action: string;
  impact: string;
  tags: string[];
  image: string;
}[] = [
  {
    title: "Anchored Shores",
    tagline: "Restoring Mumbai's coastline, one shoreline at a time.",
    problem:
      "Plastic and mixed waste accumulates on Mumbai's beaches faster than municipal teams can clear it, harming marine life and nearby fishing livelihoods.",
    action:
      "We built a recurring clean-up model with waste segregation at source, resident awareness walks, and a partner NGO handling recycling of collected material.",
    impact:
      "Over 1,200 kg of waste diverted across multiple drives, with four local partner groups continuing monthly clean-ups independently.",
    tags: ["Environment", "Community Service"],
    image: "/images/projects/project-1.svg",
  },
  {
    title: "Learning Lighthouse",
    tagline: "Bridging the after-school learning gap.",
    problem:
      "Children in underserved neighbourhoods lose academic ground because affordable, consistent after-school support simply does not exist nearby.",
    action:
      "We set up weekly learning circles with volunteer mentors, a structured curriculum for language and maths, and reading kits for every child enrolled.",
    impact:
      "150+ children supported through weekly sessions, with measurable reading-level improvement across the cohort.",
    tags: ["Education", "Youth"],
    image: "/images/projects/project-2.svg",
  },
  {
    title: "Health on Wheels",
    tagline: "Bringing basic healthcare closer to home.",
    problem:
      "Routine health checks, screenings and awareness are often out of reach for families who cannot afford travel or time away from work.",
    action:
      "In partnership with medical volunteers, we ran neighbourhood health camps offering screenings, hygiene kits and counselling referrals.",
    impact:
      "900+ residents screened, with at-risk cases referred to partner hospitals for follow-up care.",
    tags: ["Health", "Social Impact"],
    image: "/images/projects/project-3.svg",
  },
  {
    title: "SkillSet Mumbai",
    tagline: "Employability skills for first-generation professionals.",
    problem:
      "Many capable young people from low-income households are filtered out of entry-level roles for lack of interview practice, communication skills and networks.",
    action:
      "We ran a bootcamp on communication, workplace basics and interview readiness, paired with mock interviews and a mentor for every participant.",
    impact:
      "60+ participants trained; a majority reported interviews or job offers within three months of completing the program.",
    tags: ["Livelihood", "Professional Development"],
    image: "/images/projects/project-4.svg",
  },
];

export const galleryCategories = [
  "All",
  "Events",
  "Community Service",
  "Celebrations",
  "Team",
  "Fellowship",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export const gallery: {
  src: string;
  caption: string;
  category: Exclude<GalleryCategory, "All">;
  aspect: "portrait" | "landscape" | "square";
}[] = [
  {
    src: "/images/gallery/gallery-1.svg",
    caption: "Sunrise clean-up at the shoreline",
    category: "Community Service",
    aspect: "portrait",
  },
  {
    src: "/images/gallery/gallery-2.svg",
    caption: "Leadership session in progress",
    category: "Events",
    aspect: "landscape",
  },
  {
    src: "/images/gallery/gallery-3.svg",
    caption: "Charter night celebrations",
    category: "Celebrations",
    aspect: "square",
  },
  {
    src: "/images/gallery/gallery-4.svg",
    caption: "Learning circle volunteers",
    category: "Community Service",
    aspect: "portrait",
  },
  {
    src: "/images/gallery/gallery-5.svg",
    caption: "The board at work",
    category: "Team",
    aspect: "landscape",
  },
  {
    src: "/images/gallery/gallery-6.svg",
    caption: "Fellowship along the bay",
    category: "Fellowship",
    aspect: "square",
  },
  {
    src: "/images/gallery/gallery-7.svg",
    caption: "District assembly delegates",
    category: "Events",
    aspect: "landscape",
  },
  {
    src: "/images/gallery/gallery-8.svg",
    caption: "Diwali drive distribution",
    category: "Celebrations",
    aspect: "portrait",
  },
  {
    src: "/images/gallery/gallery-9.svg",
    caption: "Core team offsite",
    category: "Team",
    aspect: "square",
  },
  {
    src: "/images/gallery/gallery-10.svg",
    caption: "Road trip fellowship weekend",
    category: "Fellowship",
    aspect: "landscape",
  },
  {
    src: "/images/gallery/gallery-11.svg",
    caption: "Health camp screening",
    category: "Community Service",
    aspect: "portrait",
  },
  {
    src: "/images/gallery/gallery-12.svg",
    caption: "Annual day on stage",
    category: "Celebrations",
    aspect: "square",
  },
];

export const achievements: {
  year: string;
  title: string;
  description: string;
  tag: string;
}[] = [
  {
    year: "2024",
    title: "Club Charter & First Board",
    description:
      "Mumbai Anchors is chartered with a founding board and 30+ enthusiastic charter members.",
    tag: "Milestone",
  },
  {
    year: "2025",
    title: "Major Community Initiative",
    description:
      "Launched our flagship clean-up and learning programs, reaching the first 500 beneficiaries.",
    tag: "Community",
  },
  {
    year: "2025",
    title: "District Recognition",
    description:
      "Recognised by the district for outstanding community service in our first full year of operation.",
    tag: "Recognition",
  },
  {
    year: "2026",
    title: "New Leadership Chapter",
    description:
      "A new board takes charge with expanded projects, stronger partnerships and a 100+ member family.",
    tag: "Growth",
  },
  {
    year: "2026",
    title: "1,000 Lives Impacted",
    description:
      "Crossed 1,000 direct beneficiaries across health, education, environment and livelihood initiatives.",
    tag: "Impact",
  },
];

export const join = {
  eyebrow: "Join Us",
  title: "Your Journey Starts Here.",
  body: "Be part of a community where ideas become action, friendships become networks, and service creates lasting impact.",
  primaryCta: { label: "Become a Member", href: "#contact" },
  secondaryCta: { label: "Contact Us", href: "#contact" },
  highlights: [
    "Open to students and young professionals aged 18–30",
    "No prior experience — just intent",
    "Fellowship, mentorship and real leadership",
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Let's build something meaningful.",
  lead: "Questions, collaborations or a project idea — write to us and a member of the board will get back within two working days.",
  channels: [
    { key: "instagram", label: "Instagram", value: "@mumbaianchors", href: site.instagram },
    { key: "email", label: "Email", value: site.email, href: `mailto:${site.email}` },
    { key: "linkedin", label: "LinkedIn", value: "Rotaract Club of Mumbai Anchors", href: site.linkedin },
    { key: "location", label: "Location", value: site.location, href: "" },
    { key: "phone", label: "Phone", value: site.phone, href: "" },
  ],
  // Shown on the map card while `site.mapEmbedUrl` is empty.
  // Add a Google Maps embed URL above to replace the illustration with a live map.
  mapNote: "We meet across Mumbai — write to us and we'll share the next meet-up location.",
};

export const footer = {
  blurb:
    "A Rotaract club of young leaders serving Mumbai with steady intent — rooted in purpose, moving towards impact.",
  columns: {
    quickLinks: "Quick Links",
    contact: "Contact",
    affiliation: "Affiliation",
  },
  quickLinks: [
    { label: "About Us", href: "#about" },
    { label: "Our Team", href: "#team" },
    { label: "Events", href: "#events" },
    { label: "Projects", href: "#projects" },
    { label: "Gallery", href: "#gallery" },
    { label: "Achievements", href: "#achievements" },
    { label: "Help Holders", href: "#help-holders" },
  ],
  legal: `© ${new Date().getFullYear()} Rotaract Club of Mumbai Anchors. All rights reserved.`,
  credit: "Service above self.",
};
