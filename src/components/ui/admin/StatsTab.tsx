import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useContent } from "../../../store/content";
import { Notice, ToolbarButton, field, labelClass } from "./ui";

type StatRow = { value: number; suffix: string; label: string; sublabel: string };

/** Impact numbers: the four counters in the "Our Impact" strip. */
export function StatsTab() {
  const { stats, setStats } = useContent();
  const [rows, setRows] = useState<StatRow[]>(() => stats.map((entry) => ({ ...entry })));
  const [notice, setNotice] = useState<string | null>(null);

  const update = (index: number, patch: Partial<StatRow>) => {
    setRows((current) =>
      current.map((entry, position) => (position === index ? { ...entry, ...patch } : entry)),
    );
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    setStats(
      rows.map((entry) => ({
        ...entry,
        value: Number.isFinite(entry.value) ? Math.max(0, Math.round(entry.value)) : 0,
      })),
    );
    setNotice("Impact numbers updated.");
  };

  return (
    <form onSubmit={save}>
      <p className="text-[0.85rem] text-navy-600">
        The counters in the “Our Impact” strip. Set a number to 0 to show a plain zero — the
        site starts everything at zero until the board records real figures.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {rows.map((row, index) => (
          <div key={index} className="rounded-[3px] border border-navy-900/10 bg-mist p-4">
            <div className="grid grid-cols-[5rem_4.5rem] gap-3">
              <label className={labelClass}>
                Number
                <input
                  className={field}
                  type="number"
                  min={0}
                  value={row.value}
                  onChange={(e) => update(index, { value: e.target.valueAsNumber })}
                />
              </label>
              <label className={labelClass}>
                Suffix
                <input
                  className={field}
                  value={row.suffix}
                  onChange={(e) => update(index, { suffix: e.target.value })}
                  placeholder="+"
                />
              </label>
            </div>
            <label className={cn(labelClass, "mt-3")}>
              Label
              <input
                className={field}
                value={row.label}
                onChange={(e) => update(index, { label: e.target.value })}
              />
            </label>
            <label className={cn(labelClass, "mt-3")}>
              Sub-label
              <input
                className={field}
                value={row.sublabel}
                onChange={(e) => update(index, { sublabel: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>

      {notice && <div className="mt-4"><Notice>{notice}</Notice></div>}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-navy-800"
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save numbers
        </button>
        <ToolbarButton
          onClick={() => {
            setRows(stats.map((entry) => ({ ...entry })));
            setNotice(null);
          }}
        >
          Undo changes
        </ToolbarButton>
      </div>
    </form>
  );
}
