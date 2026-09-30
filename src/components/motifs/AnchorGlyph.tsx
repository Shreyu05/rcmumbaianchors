import { cn } from "../../lib/cn";

/**
 * The club's anchor mark: a hand-drawn line-art anchor with a subtle
 * current of water beneath it. Used in the logo, watermarks and section accents.
 */
export function AnchorGlyph({
  className,
  strokeWidth = 6,
  withCurrent = false,
}: {
  className?: string;
  strokeWidth?: number;
  withCurrent?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("h-6 w-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* ring */}
      <circle cx="100" cy="34" r="17" />
      {/* shank */}
      <path d="M100 51 V206" />
      {/* stock */}
      <path d="M64 74 H136" />
      {/* crown + arms */}
      <path d="M100 206 C 128 206 158 184 170 142" />
      <path d="M100 206 C 72 206 42 184 30 142" />
      {/* flukes */}
      <path d="M170 142 L184 124 M170 142 L148 137" />
      <path d="M30 142 L16 124 M30 142 L52 137" />
      {withCurrent && <path d="M22 226 C 62 214 138 236 178 222" opacity="0.6" strokeWidth={strokeWidth * 0.7} />}
    </svg>
  );
}
