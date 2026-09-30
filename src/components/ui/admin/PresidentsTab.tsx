import { useState, type FormEvent } from "react";
import { Crown, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { PastPresident } from "../../../data/content";
import { useContent } from "../../../store/content";
import { ImageField, Notice, ToolbarButton, field, labelClass } from "./ui";

/** Past presidents CRUD: name, year, title, note and portrait. */
export function PresidentsTab() {
  const { pastPresidents, setPastPresidents } = useContent();
  const [editing, setEditing] = useState<PastPresident | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startNew = () => {
    setEditing({ name: "", year: "", title: "", note: "", image: "" });
    setOriginalName(null);
    setNotice(null);
  };

  const startEdit = (entry: PastPresident) => {
    setEditing({ ...entry });
    setOriginalName(entry.name);
    setNotice(null);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const clean: PastPresident = {
      ...editing,
      name: editing.name.trim() || "Past President",
      year: editing.year.trim() || "—",
    };
    const withEdits = originalName
      ? pastPresidents.map((entry) => (entry.name === originalName ? clean : entry))
      : [...pastPresidents, clean];
    // Presidents without a photo fall back to a matching placeholder portrait.
    const next = withEdits.map((entry, index) =>
      entry.image
        ? entry
        : { ...entry, image: "/images/team/past-president-" + (index + 1) + ".svg" },
    );
    setPastPresidents(next);
    setEditing(null);
    setOriginalName(null);
    setNotice("Saved " + clean.name + ".");
  };

  const remove = (target: PastPresident) => {
    setPastPresidents(pastPresidents.filter((entry) => entry.name !== target.name));
    if (originalName === target.name) {
      setEditing(null);
      setOriginalName(null);
    }
    setNotice("Removed " + target.name + ".");
  };

  const move = (target: PastPresident, direction: -1 | 1) => {
    const index = pastPresidents.findIndex((entry) => entry.name === target.name);
    const to = index + direction;
    if (index < 0 || to < 0 || to >= pastPresidents.length) return;
    const next = [...pastPresidents];
    const [entry] = next.splice(index, 1);
    next.splice(to, 0, entry);
    setPastPresidents(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.85rem] text-navy-600">
          <strong className="text-navy-950">{pastPresidents.length}</strong> past presidents ·
          shown one after another in this order
        </p>
        <ToolbarButton tone="gold" onClick={startNew}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add president
        </ToolbarButton>
      </div>
      {notice && <div className="mt-3"><Notice>{notice}</Notice></div>}

      {editing && (
        <form onSubmit={save} className="mt-4 rounded-[3px] border border-navy-900/12 bg-mist p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Name
              <input
                className={field}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Rtr. Full Name"
              />
            </label>
            <label className={labelClass}>
              Term / year
              <input
                className={field}
                value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                placeholder="2024–25"
              />
            </label>
            <label className={labelClass}>
              Title (e.g. Charter President)
              <input
                className={field}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Charter President"
              />
            </label>
          </div>
          <label className={cn(labelClass, "mt-4")}>
            Note
            <textarea
              className={cn(field, "min-h-20")}
              value={editing.note}
              onChange={(e) => setEditing({ ...editing, note: e.target.value })}
              placeholder="What their presidency gave the club…"
            />
          </label>
          <ImageField
            value={editing.image}
            onChange={(dataUrl) => setEditing({ ...editing, image: dataUrl })}
            caption="Portrait"
          />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ToolbarButton onClick={() => setEditing(null)}>Cancel</ToolbarButton>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save president
            </button>
          </div>
        </form>
      )}

      <ul className="mt-5 space-y-2.5">
        {pastPresidents.map((entry, index) => (
          <li
            key={entry.name}
            className="flex items-center gap-3 rounded-[3px] border border-navy-900/10 bg-white p-3"
          >
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[2px] bg-mist text-navy-300">
              {entry.image ? (
                <img src={entry.image} alt="" className="size-full object-cover" />
              ) : (
                <Crown className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-navy-950">
                {index + 1}. {entry.name}
              </p>
              <p className="truncate text-[0.72rem] text-navy-500">
                {entry.year} · {entry.title}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <ToolbarButton onClick={() => startEdit(entry)}>Edit</ToolbarButton>
              <ToolbarButton onClick={() => move(entry, -1)} aria-label={"Move " + entry.name + " up"}>
                ↑
              </ToolbarButton>
              <ToolbarButton onClick={() => move(entry, 1)} aria-label={"Move " + entry.name + " down"}>
                ↓
              </ToolbarButton>
              <ToolbarButton tone="danger" onClick={() => remove(entry)} aria-label={"Remove " + entry.name}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
