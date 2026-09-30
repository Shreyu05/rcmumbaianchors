export type ClassValue = string | false | null | undefined;

/** Tiny class-name joiner (keeps components readable without extra deps). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
