// Trading session definitions in UTC hours
export interface Session {
  name: string;
  city: string;
  tz: string; // IANA timezone
  openUTC: number; // hour
  closeUTC: number;
  accent: "gold" | "neon" | "blue";
}

export const SESSIONS: Session[] = [
  { name: "Sydney",  city: "Sydney",   tz: "Australia/Sydney",  openUTC: 22, closeUTC: 7,  accent: "blue" },
  { name: "Tokyo",   city: "Tokyo",    tz: "Asia/Tokyo",        openUTC: 0,  closeUTC: 9,  accent: "neon" },
  { name: "London",  city: "London",   tz: "Europe/London",     openUTC: 8,  closeUTC: 17, accent: "gold" },
  { name: "New York",city: "New York", tz: "America/New_York",  openUTC: 13, closeUTC: 22, accent: "neon" },
];

export function isSessionOpen(s: Session, now: Date) {
  const h = now.getUTCHours() + now.getUTCMinutes() / 60;
  if (s.openUTC < s.closeUTC) return h >= s.openUTC && h < s.closeUTC;
  return h >= s.openUTC || h < s.closeUTC; // wraps midnight
}

export function nextEvent(s: Session, now: Date) {
  const open = isSessionOpen(s, now);
  const target = open ? s.closeUTC : s.openUTC;
  const next = new Date(now);
  next.setUTCMinutes(0, 0, 0);
  next.setUTCHours(target);
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  const diff = next.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  return { open, label: open ? "Closes in" : "Opens in", h, m, s: sec };
}

export function formatInTz(date: Date, tz: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour12: false, ...opts }).format(date);
}

export function timeInTz(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour12: false,
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "00";
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

export function dateInTz(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "short", day: "2-digit", month: "short", year: "numeric",
  }).format(date);
}
