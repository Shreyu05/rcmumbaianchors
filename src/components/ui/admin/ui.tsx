import type { ComponentProps, ReactNode } from "react";
import { useRef, type ChangeEvent } from "react";
import { cn } from "../../../lib/cn";
import { fileToDataUrl } from "../../../lib/image";
import { ImagePlus } from "lucide-react";

/** Shared form styling for the admin panel. */
export const field =
  "mt-1 w-full rounded-[3px] border border-navy-900/15 bg-white px-3 py-2 text-[0.88rem] text-navy-950 outline-none transition-colors placeholder:text-navy-300 focus:border-river-400";

export const labelClass = "block text-[0.78rem] font-semibold text-navy-800";

/** Small pill button used across the admin panel. */
export function ToolbarButton({
  tone = "quiet",
  className,
  ...rest
}: { tone?: "quiet" | "danger" | "gold" } & ComponentProps<"button">) {
  const tones = {
    quiet: "border-navy-900/15 text-navy-700 hover:border-navy-900/40 hover:bg-mist",
    danger: "border-red-300 text-red-600 hover:bg-red-50",
    gold: "border-gold-500/40 bg-gold-100 text-gold-700 hover:bg-gold-200/70",
  };
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.75rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}

/** Photo picker: stores a downscaled JPEG data URL so localStorage stays small. */
export function ImageField({
  value,
  onChange,
  caption,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  caption: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div className="mt-4">
      <span className={labelClass}>{caption}</span>
      <div className="mt-1 flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[3px] border border-navy-900/10 bg-mist text-navy-300">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : null}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton onClick={() => inputRef.current?.click()}>
            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            {value ? "Replace photo" : "Upload photo"}
          </ToolbarButton>
          {value && (
            <ToolbarButton onClick={() => onChange("")} tone="danger">
              Remove
            </ToolbarButton>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/** Labelled checkbox row for the member toggles. */
export function CheckboxRow({
  checked,
  onChange,
  caption,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  caption: string;
}) {
  return (
    <label className="flex items-center gap-2 text-[0.8rem] font-semibold text-navy-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-navy-900"
      />
      {caption}
    </label>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="rounded-[3px] bg-river-100 px-3 py-2 text-[0.8rem] text-river-700">{children}</p>;
}
