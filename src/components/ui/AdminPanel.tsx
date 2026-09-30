import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Crown, Database, Hash, Users, X } from "lucide-react";
import { useState } from "react";
import { easeOut } from "../../lib/motion";
import { useAuth } from "../../store/auth";
import { Crest } from "../motifs/Logo";
import { AccountsDataTab } from "./admin/AccountsDataTab";
import { EventsTab } from "./admin/EventsTab";
import { PresidentsTab } from "./admin/PresidentsTab";
import { StatsTab } from "./admin/StatsTab";
import { TeamTab } from "./admin/TeamTab";

/**
 * The board's admin panel. Everything edited here — events, the team, the past
 * presidents, the impact numbers — renders straight onto the site without
 * touching the codebase. Open from the user menu in the navbar; admin role
 * required.
 */

const TABS = [
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "team", label: "Team", icon: Users },
  { id: "presidents", label: "Past Presidents", icon: Crown },
  { id: "stats", label: "Impact Numbers", icon: Hash },
  { id: "data", label: "Accounts & Data", icon: Database },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminPanel({
  open,
  onClose,
  onOpenAuth,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}) {
  const { session } = useAuth();
  const [tab, setTab] = useState<TabId>("events");
  const isAdmin = session?.role === "admin";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[85] bg-navy-950/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Admin panel"
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.985 }}
            transition={{ duration: 0.4, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
            className="gold-frame mx-auto flex h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-[4px] bg-white shadow-[0_60px_120px_-60px_rgba(3,12,24,0.95)]"
          >
            {!isAdmin ? (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <Crest tone="dark" className="mx-auto h-14 w-auto" />
                  <h2 className="mt-4 font-display text-2xl font-semibold text-navy-950">
                    Admin access
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-navy-600">
                    Sign in with the club admin account to manage events, the team, past
                    presidents and impact numbers.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="mt-6 rounded-full bg-navy-900 px-6 py-2.5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-navy-900/10 px-5 py-4 sm:px-7">
                  <div>
                    <p className="eyebrow text-[0.55rem] text-gold-700">Admin panel</p>
                    <p className="mt-0.5 font-display text-lg font-semibold text-navy-950">
                      Manage site content
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close admin panel"
                    className="grid size-10 place-items-center rounded-full text-navy-500 transition-colors hover:bg-mist hover:text-navy-900"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                  <nav
                    aria-label="Admin sections"
                    className="flex shrink-0 gap-1 overflow-x-auto border-b border-navy-900/10 px-4 py-3 sm:w-48 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0 sm:px-3 sm:py-4"
                  >
                    {TABS.map((entry) => {
                      const active = entry.id === tab;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setTab(entry.id)}
                          aria-current={active ? "true" : undefined}
                          className={
                            "flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8rem] font-semibold whitespace-nowrap transition-colors sm:rounded-[3px] " +
                            (active
                              ? "bg-navy-950 text-white"
                              : "text-navy-600 hover:bg-mist hover:text-navy-950")
                          }
                        >
                          <entry.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {entry.label}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
                    {tab === "events" && <EventsTab />}
                    {tab === "team" && <TeamTab />}
                    {tab === "presidents" && <PresidentsTab />}
                    {tab === "stats" && <StatsTab />}
                    {tab === "data" && <AccountsDataTab />}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
