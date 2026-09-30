/**
 * Demo-grade password hash for the club's client-side sign-in.
 *
 * This is NOT production security — the site is a static app with no server,
 * so any "account" lives in the visitor's own browser. It exists so the board
 * can gate the admin panel and let members sign in for demos. Never ask
 * members to reuse a real password here.
 */
export function hashPassword(email: string, password: string): string {
  const input = `rcma::${email.trim().toLowerCase()}::${password}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0xdeadbeef;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ (c + i), 0x85ebca6b) >>> 0;
  }
  return `v1:${h1.toString(16).padStart(8, "0")}:${h2.toString(16).padStart(8, "0")}`;
}
