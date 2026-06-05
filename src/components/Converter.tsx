import { useEffect, useState } from "react";

const ZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "New York (EST/EDT)", tz: "America/New_York" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Frankfurt (CET)", tz: "Europe/Berlin" },
  { label: "Hong Kong (HKT)", tz: "Asia/Hong_Kong" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
];

function localTz() {
  if (typeof window === "undefined") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function Converter() {
  const [local, setLocal] = useState("UTC");
  const [time, setTime] = useState("12:00");
  const [fromTz, setFromTz] = useState("UTC");

  useEffect(() => {
    const browserTz = localTz();
    const d = new Date();
    setLocal(browserTz);
    setFromTz(browserTz);
    setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
  }, []);

  // Build a Date that represents `time` interpreted in `fromTz`, today
  const convertDate = (() => {
    const [hh, mm] = time.split(":").map(Number);
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: fromTz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(now);
    const get = (t: string) => Number(fmt.find(p => p.type === t)?.value);
    const tzNow = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    const offsetMs = tzNow - now.getTime();
    const utcMs = Date.UTC(get("year"), get("month") - 1, get("day"), hh, mm) - offsetMs;
    return new Date(utcMs);
  })();

  const fromOptions = [
    { label: `Your local — ${local}`, tz: local },
    ...ZONES.filter(z => z.tz !== local),
  ];

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="grid md:grid-cols-[1fr_2fr_auto] gap-4 items-end">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full bg-background/40 border border-border rounded-xl px-4 py-3 font-mono text-xl focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">From timezone</label>
          <select
            value={fromTz}
            onChange={e => setFromTz(e.target.value)}
            className="w-full bg-background/40 border border-border rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-gold transition-colors"
          >
            {fromOptions.map(z => <option key={z.tz} value={z.tz}>{z.label}</option>)}
          </select>
        </div>
        <div className="text-xs font-mono text-muted-foreground border border-border rounded-xl px-4 py-3 text-center">
          Live conversion
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
        {ZONES.map(z => {
          const out = new Intl.DateTimeFormat("en-GB", {
            timeZone: z.tz, hour12: false, hour: "2-digit", minute: "2-digit",
          }).format(convertDate);
          const day = new Intl.DateTimeFormat("en-US", {
            timeZone: z.tz, weekday: "short", day: "2-digit", month: "short",
          }).format(convertDate);
          return (
            <div key={z.tz} className="bg-background/30 border border-border rounded-xl p-4 hover:border-gold/50 transition-colors">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{z.label}</div>
              <div className="font-mono text-2xl text-gold mt-1 tabular-nums">{out}</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-1">{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
