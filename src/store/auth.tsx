import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { hashPassword } from "../lib/hash";
import { uid } from "../lib/id";

/**
 * Client-side accounts for the club site.
 *
 * The site ships as a static app with no server, so accounts live in the
 * visitor's own browser (localStorage). The admin account is seeded on first
 * run; members can register through the sign-in dialog. Roles:
 *  · "admin"   — full access to the admin panel
 *  · "member"  — signed-in member (can be granted admin by the admin)
 */

export type Role = "admin" | "member";

export type Account = {
  id: string;
  name: string;
  email: string;
  passHash: string;
  role: Role;
  createdAt: string;
};

export type Session = { accountId: string; role: Role; name: string; email: string };

const ACCOUNTS_KEY = "rcma.accounts.v1";
const SESSION_KEY = "rcma.session.v1";

/** The board's admin account, created on first run. Change the password after
 *  first sign-in by removing the account in the admin panel and re-registering
 *  (see README for the demo-auth caveats). */
const SEED_ADMIN = {
  name: "Club Admin",
  email: "rtr.shreyansoswal@gmail.com",
  password: "Admin123",
  role: "admin" as Role,
};

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Account[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

type AuthValue = {
  session: Session | null;
  accounts: Account[];
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (name: string, email: string, password: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
  setRole: (accountId: string, role: Role) => void;
  removeAccount: (accountId: string) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const existing = readAccounts();
    if (!existing.some((account) => account.email === SEED_ADMIN.email)) {
      const admin: Account = {
        id: uid(),
        name: SEED_ADMIN.name,
        email: SEED_ADMIN.email,
        passHash: hashPassword(SEED_ADMIN.email, SEED_ADMIN.password),
        role: SEED_ADMIN.role,
        createdAt: new Date().toISOString(),
      };
      writeAccounts([admin, ...existing]);
      return [admin, ...existing];
    }
    return existing;
  });
  const [session, setSession] = useState<Session | null>(() => readSession());

  useEffect(() => {
    const onStorage = () => setAccounts(readAccounts());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Account[]) => {
    setAccounts(next);
    writeAccounts(next);
  }, []);

  const signIn = useCallback<AuthValue["signIn"]>(
    (email, password) => {
      const key = email.trim().toLowerCase();
      const account = readAccounts().find((entry) => entry.email === key);
      if (!account) return { ok: false, error: "No account with that email. Members can register below." };
      if (account.passHash !== hashPassword(key, password)) {
        return { ok: false, error: "That password doesn't match." };
      }
      const next: Session = { accountId: account.id, role: account.role, name: account.name, email: account.email };
      setSession(next);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return { ok: true };
    },
    [],
  );

  const register = useCallback<AuthValue["register"]>((name, email, password) => {
    const key = email.trim().toLowerCase();
    if (!name.trim()) return { ok: false, error: "Please tell us your name." };
    if (!key.includes("@")) return { ok: false, error: "Please enter a valid email." };
    if (password.length < 6) return { ok: false, error: "Password needs at least 6 characters." };
    const current = readAccounts();
    if (current.some((account) => account.email === key)) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const account: Account = {
      id: uid(),
      name: name.trim(),
      email: key,
      passHash: hashPassword(key, password),
      role: "member",
      createdAt: new Date().toISOString(),
    };
    persist([...current, account]);
    const next: Session = { accountId: account.id, role: account.role, name: account.name, email: account.email };
    setSession(next);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return { ok: true };
  }, [persist]);

  const signOut = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const setRole = useCallback<AuthValue["setRole"]>(
    (accountId, role) => {
      persist(readAccounts().map((account) => (account.id === accountId ? { ...account, role } : account)));
      setSession((current) =>
        current && current.accountId === accountId ? { ...current, role } : current,
      );
    },
    [persist],
  );

  const removeAccount = useCallback<AuthValue["removeAccount"]>(
    (accountId) => {
      persist(readAccounts().filter((account) => account.id !== accountId));
      setSession((current) => (current && current.accountId === accountId ? null : current));
    },
    [persist],
  );

  const value = useMemo(
    () => ({ session, accounts, signIn, register, signOut, setRole, removeAccount }),
    [session, accounts, signIn, register, signOut, setRole, removeAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
