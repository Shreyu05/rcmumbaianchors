import { useRef, useState, type ChangeEvent } from "react";
import { Download, RotateCcw, ShieldCheck, Trash2, Upload, UserRound } from "lucide-react";
import { useAuth, type Role } from "../../../store/auth";
import { useContent } from "../../../store/content";
import { Notice, ToolbarButton } from "./ui";

/** Member accounts (roles) plus export / import / reset of all site content. */
export function AccountsDataTab() {
  const { session, accounts, setRole, removeAccount } = useAuth();
  const { exportJson, importJson, resetAll } = useContent();
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const changeRole = (accountId: string, role: Role) => {
    if (session && accountId === session.accountId) {
      setNotice("You can't change your own role.");
      return;
    }
    setRole(accountId, role);
    setNotice("Role updated.");
  };

  const remove = (accountId: string, name: string) => {
    if (session && accountId === session.accountId) {
      setNotice("You can't remove your own account.");
      return;
    }
    removeAccount(accountId);
    setNotice("Removed " + name + "'s account.");
  };

  const exportFile = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rcma-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Content exported as rcma-content.json.");
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const text = await file.text();
    const result = importJson(text);
    setNotice(result.ok ? "Content imported from " + file.name + "." : result.error);
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="accounts-heading">
        <h3 id="accounts-heading" className="flex items-center gap-2 font-display text-lg font-semibold text-navy-950">
          <ShieldCheck className="h-4.5 w-4.5 text-river-600" aria-hidden="true" />
          Member accounts
        </h3>
        <p className="mt-1 text-[0.82rem] text-navy-600">
          Members register through Sign In. Grant the admin role to give full panel access.
        </p>

        {notice && <div className="mt-3"><Notice>{notice}</Notice></div>}

        <ul className="mt-4 space-y-2.5">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex flex-wrap items-center gap-3 rounded-[3px] border border-navy-900/10 bg-white p-3"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-navy-400">
                <UserRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9rem] font-semibold text-navy-950">
                  {account.name}
                  {session && account.id === session.accountId && (
                    <span className="ml-2 text-[0.62rem] font-bold tracking-[0.16em] text-gold-700 uppercase">
                      you
                    </span>
                  )}
                </p>
                <p className="truncate text-[0.72rem] text-navy-500">{account.email}</p>
              </div>
              <select
                aria-label={"Role for " + account.name}
                className="rounded-[3px] border border-navy-900/15 bg-white px-2.5 py-1.5 text-[0.78rem] text-navy-800 disabled:opacity-50"
                value={account.role}
                disabled={Boolean(session && account.id === session.accountId)}
                onChange={(e) => changeRole(account.id, e.target.value as Role)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <ToolbarButton
                tone="danger"
                disabled={Boolean(session && account.id === session.accountId)}
                onClick={() => remove(account.id, account.name)}
                aria-label={"Remove " + account.name}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="data-heading" className="border-t border-navy-900/10 pt-6">
        <h3 id="data-heading" className="font-display text-lg font-semibold text-navy-950">
          Site content data
        </h3>
        <p className="mt-1 text-[0.82rem] text-navy-600">
          Everything the board saves lives in this browser. Export the JSON to share it (or commit
          it to the repo) and import it on any other device to publish the same content.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ToolbarButton onClick={exportFile}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export JSON
          </ToolbarButton>
          <ToolbarButton onClick={() => fileRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" aria-hidden="true" /> Import JSON
          </ToolbarButton>
          <ToolbarButton
            tone="danger"
            onClick={() => {
              if (window.confirm("Reset all site content back to the seeded defaults?")) {
                resetAll();
                setNotice("Site content reset to the seeded defaults.");
              }
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset to seeds
          </ToolbarButton>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importFile} />
        </div>
      </section>
    </div>
  );
}
