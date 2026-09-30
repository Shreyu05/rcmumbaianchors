import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { navLinks, site } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import { cn } from "../lib/cn";
import { easeOut } from "../lib/motion";
import { useAuth } from "../store/auth";
import { Logo } from "./motifs/Logo";
import { MagneticButton } from "./ui/MagneticButton";

const panelList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const panelItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

/** Sticky navigation: floats over the hero, then settles into a frosted bar. */
export function Navbar({
  onOpenAuth,
  onOpenAdmin,
}: {
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { session, signOut } = useAuth();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 30));

  const sectionIds = useMemo(() => navLinks.map((link) => link.href.replace("#", "")), []);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const dark = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled && !open
          ? "border-b border-navy-900/10 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo tone={dark ? "dark" : "light"} />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = active === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[0.82rem] font-semibold tracking-tight transition-colors duration-300",
                  dark ? "text-navy-700 hover:text-navy-950" : "text-navy-100/75 hover:text-white",
                  isActive && (dark ? "text-navy-950" : "text-white"),
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ duration: 0.45, ease: easeOut }}
                    className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-river-400 to-gold-400"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Sign in / session menu */}
          <div className="relative">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className={cn(
                    "flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-[0.78rem] font-semibold transition-colors",
                    dark
                      ? "border-navy-900/15 bg-white text-navy-800 hover:border-navy-900/35"
                      : "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-full text-[0.62rem] font-bold uppercase",
                      dark ? "bg-navy-950 text-gold-200" : "bg-gold-300 text-navy-950",
                    )}
                    aria-hidden="true"
                  >
                    {session.name.slice(0, 2)}
                  </span>
                  <span className="hidden max-w-[7rem] truncate sm:block">{session.name}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <button
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                      />
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-[4px] border border-navy-900/10 bg-white shadow-[0_30px_60px_-30px_rgba(10,26,46,0.5)]"
                      >
                        <div className="border-b border-navy-900/10 px-4 py-3">
                          <p className="truncate text-[0.85rem] font-semibold text-navy-950">{session.name}</p>
                          <p className="truncate text-[0.7rem] text-navy-500">{session.email}</p>
                          <p className="eyebrow mt-1.5 text-[0.52rem] text-gold-700">{session.role}</p>
                        </div>
                        {session.role === "admin" && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              onOpenAdmin();
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[0.82rem] font-semibold text-navy-800 transition-colors hover:bg-mist"
                          >
                            <LayoutDashboard className="h-4 w-4 text-river-600" aria-hidden="true" />
                            Admin panel
                          </button>
                        )}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setMenuOpen(false);
                            signOut();
                          }}
                          className="flex w-full items-center gap-2.5 border-t border-navy-900/10 px-4 py-3 text-left text-[0.82rem] font-semibold text-navy-800 transition-colors hover:bg-mist"
                        >
                          <LogOut className="h-4 w-4 text-river-600" aria-hidden="true" />
                          Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.78rem] font-semibold transition-colors",
                  dark
                    ? "border-navy-900/15 bg-white text-navy-800 hover:border-navy-900/35"
                    : "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
                )}
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                Sign In
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <MagneticButton
              href="#join"
              variant={dark ? "primary" : "light"}
              size="md"
              className="text-[0.82rem]"
              icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
            >
              Join Us
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "relative grid size-11 place-items-center rounded-full border transition-colors duration-300 lg:hidden",
              dark
                ? "border-navy-900/15 bg-white text-navy-900"
                : "border-white/25 bg-white/10 text-white backdrop-blur",
            )}
          >
            <span className="sr-only">Menu</span>
            <span
              className={cn(
                "absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-out",
                open ? "rotate-45" : "-translate-y-[5px]",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-[18px] rounded-full bg-current transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-out",
                open ? "-rotate-45" : "translate-y-[5px]",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-navy-950/97 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              variants={panelList}
              initial="hidden"
              animate="show"
              aria-label="Mobile"
              className="mx-auto max-w-7xl px-5 pt-6 pb-12 sm:px-8"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.li key={link.href} variants={panelItem}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
                    >
                      <span className="font-display text-[1.6rem] font-semibold text-white transition-colors group-hover:text-river-200">
                        {link.label}
                      </span>
                      <span className="eyebrow text-[0.55rem] text-river-300/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={panelItem} className="mt-8">
                {session ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (session.role === "admin") {
                        onOpenAdmin();
                      } else {
                        signOut();
                      }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {session.role === "admin" ? (
                      <>
                        <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Admin panel ({session.name})
                      </>
                    ) : (
                      <>
                        <UserRound className="h-4 w-4" aria-hidden="true" /> Signed in as {session.name} — sign out
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenAuth();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" /> Member Sign In
                  </button>
                )}
                <div className="mt-3">
                  <MagneticButton
                    href="#join"
                    variant="gold"
                    size="lg"
                    block
                    onClick={() => setOpen(false)}
                    icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    Become a Member
                  </MagneticButton>
                </div>
                <p className="mt-5 text-sm text-navy-100/60">
                  {site.location} · {site.email}
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
