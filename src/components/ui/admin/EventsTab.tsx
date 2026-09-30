import { useState, type FormEvent } from "react";
import {
  eventCategories,
  type ClubEvent,
  type EventCategory,
} from "../../../data/content";
import { Plus, Save, Trash2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useContent } from "../../../store/content";
import { ImageField, Notice, ToolbarButton, field, labelClass } from "./ui";

const CATEGORIES = eventCategories.filter((entry) => entry !== "All") as Exclude<
  EventCategory,
  "All"
>[];

/** Events CRUD: add, edit and remove upcoming or past events. */
export function EventsTab() {
  const { events, setEvents } = useContent();
  const [editing, setEditing] = useState<ClubEvent | null>(null);
  const [original, setOriginal] = useState<ClubEvent | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startNew = () => {
    const blank: ClubEvent = {
      title: "",
      date: "",
      dateISO: "",
      location: "",
      category: CATEGORIES[0],
      description: "",
      details: "",
      image: "",
      status: "upcoming",
    };
    setEditing(blank);
    setOriginal(null);
    setNotice(null);
  };

  const startEdit = (entry: ClubEvent) => {
    setEditing({ ...entry });
    setOriginal(entry);
    setNotice(null);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const clean: ClubEvent = {
      ...editing,
      title: editing.title.trim() || "Untitled event",
      date: editing.date.trim() || editing.dateISO,
    };
    const next = original
      ? events.map((entry) =>
          entry.title === original.title && entry.dateISO === original.dateISO ? clean : entry,
        )
      : [...events, clean];
    setEvents(next);
    setEditing(null);
    setOriginal(null);
    setNotice("Saved " + clean.title + ".");
  };

  const remove = (target: ClubEvent) => {
    setEvents(events.filter((entry) => !(entry.title === target.title && entry.dateISO === target.dateISO)));
    if (original && original.title === target.title && original.dateISO === target.dateISO) {
      setEditing(null);
      setOriginal(null);
    }
    setNotice("Removed " + target.title + ".");
  };

  const upcoming = events.filter((entry) => entry.status === "upcoming");
  const past = events.filter((entry) => entry.status === "past");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.85rem] text-navy-600">
          <strong className="text-navy-950">{upcoming.length}</strong> upcoming ·{" "}
          <strong className="text-navy-950">{past.length}</strong> past
        </p>
        <ToolbarButton tone="gold" onClick={startNew}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add event
        </ToolbarButton>
      </div>
      {notice && <div className="mt-3"><Notice>{notice}</Notice></div>}

      {editing && (
        <form onSubmit={save} className="mt-4 rounded-[3px] border border-navy-900/12 bg-mist p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Title
              <input
                className={field}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Coastal Clean-Up Drive"
              />
            </label>
            <label className={labelClass}>
              Category
              <select
                className={field}
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value as ClubEvent["category"] })
                }
              >
                {CATEGORIES.map((entry) => (
                  <option key={entry}>{entry}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Date shown on the card
              <input
                className={field}
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                placeholder="12 Oct 2026"
              />
            </label>
            <label className={labelClass}>
              ISO date (for sorting)
              <input
                className={field}
                type="date"
                value={editing.dateISO}
                onChange={(e) => setEditing({ ...editing, dateISO: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Location
              <input
                className={field}
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                placeholder="Versova Beach, Mumbai"
              />
            </label>
            <label className={labelClass}>
              Status
              <select
                className={field}
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as ClubEvent["status"] })
                }
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </label>
          </div>
          <label className={cn(labelClass, "mt-4")}>
            Short description (card)
            <textarea
              className={cn(field, "min-h-20")}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </label>
          <label className={cn(labelClass, "mt-4")}>
            Full details (opened from View Details)
            <textarea
              className={cn(field, "min-h-28")}
              value={editing.details}
              onChange={(e) => setEditing({ ...editing, details: e.target.value })}
            />
          </label>
          <ImageField
            value={editing.image}
            onChange={(dataUrl) => setEditing({ ...editing, image: dataUrl })}
            caption="Event photo"
          />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ToolbarButton onClick={() => setEditing(null)}>Cancel</ToolbarButton>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save event
            </button>
          </div>
        </form>
      )}

      {events.length === 0 && !editing && (
        <p className="mt-5 rounded-[3px] border border-dashed border-navy-900/20 px-4 py-6 text-center text-[0.85rem] text-navy-500">
          No events yet — add the first one with the button above.
        </p>
      )}

      <ul className="mt-5 space-y-2.5">
        {events.map((entry) => (
          <li
            key={entry.title + entry.dateISO}
            className="flex items-center gap-3 rounded-[3px] border border-navy-900/10 bg-white p-3"
          >
            <img
              src={entry.image || "/images/events/event-1.svg"}
              alt=""
              className="size-11 rounded-[2px] bg-mist object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-navy-950">{entry.title}</p>
              <p className="truncate text-[0.72rem] text-navy-500">
                {entry.date || "No date"} · {entry.category} · {entry.status}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <ToolbarButton onClick={() => startEdit(entry)}>Edit</ToolbarButton>
              <ToolbarButton tone="danger" onClick={() => remove(entry)} aria-label={"Remove " + entry.title}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </ToolbarButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
