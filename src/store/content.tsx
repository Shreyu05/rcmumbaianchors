import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  events as seedEvents,
  pastPresidents as seedPresidents,
  stats as seedStats,
  team as seedTeam,
  type ClubEvent,
  type PastPresident,
  type TeamMember,
} from "../data/content";

/**
 * The club's live content store.
 *
 * The board manages events, the team, the past presidents and the impact
 * counters through the admin panel — no codebase changes needed. Everything
 * persists in this visitor's browser (localStorage) and falls back to the
 * seed data in `src/data/content.ts` until the admin saves something.
 *
 * NOTE: like the sign-in, this is browser-local by design for now — every
 * visitor sees the seed content until they import a shared JSON. A backend
 * (or a static JSON file checked into the repo) is the natural next step.
 */

const CONTENT_KEY = "rcma.content.v1";

export type StoredContent = {
  events: ClubEvent[];
  team: TeamMember[];
  pastPresidents: PastPresident[];
  stats: { value: number; suffix: string; label: string; sublabel: string }[];
};

const EMPTY: StoredContent = { events: [], team: [], pastPresidents: [], stats: [] };

function readStored(): StoredContent {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<StoredContent>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : EMPTY.events,
      team: Array.isArray(parsed.team) ? parsed.team : EMPTY.team,
      pastPresidents: Array.isArray(parsed.pastPresidents) ? parsed.pastPresidents : EMPTY.pastPresidents,
      stats: Array.isArray(parsed.stats) ? parsed.stats : EMPTY.stats,
    };
  } catch {
    return EMPTY;
  }
}

/** The first non-empty source wins: admin edits → seed data. */
function pick<T>(stored: T[], seed: T[]): T[] {
  return stored.length > 0 ? stored : seed;
}

type ContentValue = {
  content: StoredContent;
  /** The merged view the site renders: admin edits first, then seed data. */
  events: ClubEvent[];
  team: TeamMember[];
  pastPresidents: PastPresident[];
  stats: { value: number; suffix: string; label: string; sublabel: string }[];
  teamSummary: { value: string; label: string }[];
  bannerBearers: TeamMember[];
  setEvents: (events: ClubEvent[]) => void;
  setTeam: (team: TeamMember[]) => void;
  setPastPresidents: (presidents: PastPresident[]) => void;
  setStats: (stats: StoredContent["stats"]) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => { ok: true } | { ok: false; error: string };
};

const ContentContext = createContext<ContentValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredContent>(() => readStored());

  useEffect(() => {
    const onStorage = () => setStored(readStored());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: StoredContent) => {
    setStored(next);
    localStorage.setItem(CONTENT_KEY, JSON.stringify(next));
  }, []);

  const setEvents = useCallback((events: ClubEvent[]) => persist({ ...stored, events }), [persist, stored]);
  const setTeam = useCallback((team: TeamMember[]) => persist({ ...stored, team }), [persist, stored]);
  const setPastPresidents = useCallback(
    (pastPresidents: PastPresident[]) => persist({ ...stored, pastPresidents }),
    [persist, stored],
  );
  const setStats = useCallback((stats: StoredContent["stats"]) => persist({ ...stored, stats }), [persist, stored]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(CONTENT_KEY);
    setStored(EMPTY);
  }, []);

  const exportJson = useCallback(() => JSON.stringify(stored, null, 2), [stored]);

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw) as Partial<StoredContent>;
      persist({
        events: Array.isArray(parsed.events) ? parsed.events : stored.events,
        team: Array.isArray(parsed.team) ? parsed.team : stored.team,
        pastPresidents: Array.isArray(parsed.pastPresidents) ? parsed.pastPresidents : stored.pastPresidents,
        stats: Array.isArray(parsed.stats) ? parsed.stats : stored.stats,
      });
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "That doesn't look like valid JSON." };
    }
  }, [persist, stored]);

  const value = useMemo<ContentValue>(() => {
    const content = stored;
    const events = pick(stored.events, seedEvents);
    const team = pick(stored.team, seedTeam);
    const pastPresidents = pick(stored.pastPresidents, seedPresidents);
    const stats = pick(stored.stats, seedStats);
    const bannerBearers = team.filter((member) => member.featured);
    const boardCount = team.filter((member) => member.category === "Board of Directors").length;
    const coreCount = team.filter((member) => member.category === "Core Team").length;
    return {
      content,
      events,
      team,
      pastPresidents,
      stats,
      bannerBearers,
      teamSummary: [
        { value: String(boardCount).padStart(2, "0"), label: "Board of Directors" },
        { value: String(coreCount).padStart(2, "0"), label: "Core Members" },
        { value: `${stats[0]?.value ?? 0}${stats[0]?.suffix ?? ""}`, label: "Members strong" },
      ],
      setEvents,
      setTeam,
      setPastPresidents,
      setStats,
      resetAll,
      exportJson,
      importJson,
    };
  }, [stored, setEvents, setTeam, setPastPresidents, setStats, resetAll, exportJson, importJson]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useContent must be used inside <ContentProvider>");
  return value;
}
