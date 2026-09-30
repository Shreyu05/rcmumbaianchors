import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShieldCheck, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { easeOut } from "../../lib/motion";
import { useAuth } from "../../store/auth";

/**
 * The sign-in dialog: existing members and the admin sign in, new members
 * register, and a signed-in visitor can review or end their session.
 */
export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session, signIn, register, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode("signin");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = mode === "signin" ? signIn(email, password) : register(name, email, password);
    if (result.ok) {
      setError(null);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const field =
    "mt-1 w-full rounded-[3px] border border-navy-900/15 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy-950 outline-none transition-colors placeholder:text-navy-300 focus:border-river-400";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={session ? "Your session" : mode === "signin" ? "Sign in" : "Register"}
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.4, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
            className="gold-frame relative w-full max-w-sm rounded-[4px] bg-white p-7 shadow-[0_50px_100px_-50px_rgba(3,12,24,0.9)] sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-navy-500 transition-colors hover:bg-mist hover:text-navy-900"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {session ? (
              <div className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-river-100 text-river-600">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold text-navy-950">You're signed in</h2>
                <p className="mt-2 text-[0.9rem] text-navy-600">{session.name}</p>
                <p className="text-[0.8rem] text-navy-500">{session.email}</p>
                <p className="eyebrow mt-3 text-[0.58rem] text-gold-700">{session.role}</p>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-navy-800"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow text-[0.58rem] text-gold-700">
                  {mode === "signin" ? "Member sign in" : "New member"}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">
                  {mode === "signin" ? "Welcome back, anchor." : "Join the crew."}
                </h2>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  {mode === "register" && (
                    <label className="block text-[0.8rem] font-semibold text-navy-800">
                      Full name
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        autoComplete="name"
                        className={field}
                        placeholder="Your name"
                      />
                    </label>
                  )}
                  <label className="block text-[0.8rem] font-semibold text-navy-800">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      className={field}
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="block text-[0.8rem] font-semibold text-navy-800">
                    Password
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      className={field}
                      placeholder={mode === "signin" ? "Your password" : "At least 6 characters"}
                    />
                  </label>

                  {error && (
                    <p role="alert" className="rounded-[3px] border border-gold-500/30 bg-gold-100 px-3 py-2 text-[0.8rem] text-gold-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-full bg-navy-900 px-5 py-3 text-[0.88rem] font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                </form>

                <p className="mt-5 text-center text-[0.8rem] text-navy-500">
                  {mode === "signin" ? "New to the club?" : "Already a member?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "register" : "signin");
                      setError(null);
                    }}
                    className="font-semibold text-river-600 underline-offset-4 hover:underline"
                  >
                    {mode === "signin" ? "Register instead" : "Sign in instead"}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
