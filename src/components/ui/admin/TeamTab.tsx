import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, UserRound } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useContent } from "../../../store/content";
import { CheckboxRow, ImageField, Notice, ToolbarButton, field, labelClass } from "./ui";

type Category = "Board of Directors" | "Core Team";

/** Team CRUD: edit names, designations, bios, photos, categories and order. */
export function TeamTab() {
  const { team, setTeam } = useContent();
  const [editing, setEditing] = useState<TeamMemberDraft | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "All">("All");
  const [notice, setNotice] = useState<string | null>(null);

  const startNew = () => {
    setEditing({ name: "", role: "", category: "Board of Directors", bio: "", image: "", officeBearers: false, featured: false });
    setOriginalName(null);
    setNotice(null);
  };

  const startEdit = (member: TeamMemberDraft) => {
    setEditing({ ...member });
    setOriginalName(member.name);
    setNotice(null);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const clean: TeamMemberDraft = {
      ...editing,
      name: editing.name.trim() || "New Member",
      role: editing.role.trim() || "Member",
      bio: editing.bio.trim(),
    };
    const withNew = originalName
      ? team.map((entry) => (entry.name === originalName ? clean : entry))
      : [...team, clean];
    // Members without a photo fall back to a matching placeholder portrait.
    const next = withNew.map((entry, index) =>
      entry.image
        ? entry
        : { ...entry, image: "/images/team/member-" + (index + 1) + ".svg" },
    );
    setTeam(next);
    setEditing(null);
    setOriginalName(null);
    setNotice("Saved " + clean.name + ".");
  };

  const remove = (target: TeamMemberDraft) => {
    setTeam(team.filter((entry) => entry.name !== target.name));
    if (originalName === target.name) {
      setEditing(null);
      setOriginalName(null);
    }
    setNotice("Removed " + target.name + ".");
  };

  const move = (member: TeamMemberDraft, direction: -1 | 1) => {
    const index = team.findIndex((entry) => entry.name === member.name);
    const to = index + direction;
    if (index < 0 || to < 0 || to >= team.length) return;
    const next = [...team];
    const [entry] = next.splice(index, 1);
    next.splice(to, 0, entry);
    setTeam(next);
  };

  const visible = filter === "All" ? team : team.filter((entry) => entry.category === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.85rem] text-navy-600">
          <strong className="text-navy-950">{team.length}</strong> members listed
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter members by category"
            className="rounded-[3px] border border-navy-900/15 bg-white px-2.5 py-1.5 text-[0.78rem] text-navy-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Category | "All")}
          >
            <option value="All">All categories</option>
            <option value="Board of Directors">Board of Directors</option>
            <option value="Core Team">Core Team</option>
          </select>
          <ToolbarButton tone="gold" onClick={startNew}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add member
          </ToolbarButton>
        </div>
      </div>
      {notice && <div className="mt-3"><Notice>{notice}</Notice></div>}

      {editing && (
        <form
          onSubmit={save}
          className="mt-4 rounded-[3px] border border-navy-900/12 bg-mist p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Name
              <input
                className={field}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Full name"
              />
            </label>
            <label className={labelClass}>
              Designation (role)
              <input
                className={field}
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                placeholder="President — 2026–27"
              />
            </label>
            <label className={labelClass}>
              Category
              <select
                className={field}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as Category })}
              >
                <option value="Board of Directors">Board of Directors</option>
                <option value="Core Team">Core Team</option>
              </select>
            </label>
            <label className={labelClass}>
              LinkedIn URL (optional)
              <input
                className={field}
                value={editing.linkedin ?? ""}
                onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/…"
              />
            </label>
            <label className={cn(labelClass, "sm:col-span-2")}>
              Instagram URL (optional)
              <input
                className={field}
                value={editing.instagram ?? ""}
                onChange={(e) => setEditing({ ...editing, instagram: e.target.value })}
                placeholder="https://instagram.com/…"
              />
            </label>
          </div>
          <label className={cn(labelClass, "mt-4")}>
            Bio
            <textarea
              className={cn(field, "min-h-20")}
              value={editing.bio}
              onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            />
          </label>
          <ImageField
            value={editing.image}
            onChange={(dataUrl) => setEditing({ ...editing, image: dataUrl })}
            caption="Portrait"
          />
          <div className="mt-4 flex flex-wrap gap-5">
            <CheckboxRow
              checked={Boolean(editing.officeBearers)}
              onChange={(checked) => setEditing({ ...editing, officeBearers: checked })}
              caption="Office bearer badge"
            />
            <CheckboxRow
              checked={Boolean(editing.featured)}
              onChange={(checked) => setEditing({ ...editing, featured: checked })}
              caption="Show on the banner strip"
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ToolbarButton onClick={() => setEditing(null)}>Cancel</ToolbarButton>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save member
            </button>
          </div>
        </form>
      )}

      <ul className="mt-5 space-y-2.5">
        {visible.map((member) => (
          <li
            key={member.name}
            className="flex items-center gap-3 rounded-[3px] border border-navy-900/10 bg-white p-3"
          >
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[2px] bg-mist text-navy-300">
              {member.image ? (
                <img src={member.image} alt="" className="size-full object-cover" />
              ) : (
                <UserRound className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-navy-950">{member.name}</p>
              <p className="truncate text-[0.72rem] text-navy-500">
                {member.role} · {member.category}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <ToolbarButton onClick={() => startEdit(member)}>Edit</ToolbarButton>
              <ToolbarButton onClick={() => move(member, -1)} aria-label={"Move " + member.name + " up"}>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton onClick={() => move(member, 1)} aria-label={"Move " + member.name + " down"}>
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton tone="danger" onClick={() => remove(member)} aria-label={"Remove " + member.name}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type TeamMemberDraft = {
  name: string;
  role: string;
  category: Category;
  bio: string;
  image: string;
  officeBearers?: boolean;
  featured?: boolean;
  linkedin?: string;
  instagram?: string;
};
