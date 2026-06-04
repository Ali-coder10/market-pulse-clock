import { useState } from "react";

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
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function Converter() {
  const local = localTz();
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState(local);

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

  const swap = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const fromOptions = [
    { label: `Your local — ${local}`, tz: local },
    ...ZONES,
  ];
  const toOptions = [
    { label: `Your local — ${local}`, tz: local },
    ...ZONES,
  ];

  const targetTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: toTz, hour12: false, hour: "2-digit", minute: "2-digit",
  }).format(convertDate);
  const targetDay = new Intl.DateTimeFormat("en-US", {
    timeZone: toTz, weekday: "short", day: "2-digit", month: "short",
  }).format(convertDate);

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      {/* Inputs */}
      <div className="grid md:grid-cols-[1fr_1.3fr_auto_1.3fr] gap-4 items-end">
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
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">From</label>
          <select
            value={fromTz}
            onChange={e => setFromTz(e.target.value)}
            className="w-full bg-background/40 border border-border rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-gold transition-colors"
          >
            {fromOptions.map(z => <option key={`from-${z.tz}`} value={z.tz}>{z.label}</option>)}
          </select>
        </div>
        <button
          onClick={swap}
          aria-label="Swap timezones"
          className="h-[50px] px-4 rounded-xl glass-gold font-mono text-sm hover:scale-105 transition-transform"
          title="Swap From / To"
        >
          ⇄
        </button>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">To</label>
          <select
            value={toTz}
            onChange={e => setToTz(e.target.value)}
            className="w-full bg-background/40 border border-border rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-gold transition-colors"
          >
            {toOptions.map(z => <option key={`to-${z.tz}`} value={z.tz}>{z.label}</option>)}
          </select>
        </div>
      </div>

      {/* Primary result */}
      <div className="mt-8 rounded-2xl glass-gold p-6 md:p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {time} in {fromTz} equals
        </div>
        <div className="font-mono text-5xl md:text-6xl text-gold mt-3 tabular-nums font-light">
          {targetTime}
        </div>
        <div className="text-xs text-muted-foreground font-mono mt-2">
          {targetDay} · {toTz}
        </div>
      </div>

      {/* Grid of all zones */}
      <div className="mt-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 font-mono">
          All major markets
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
    </div>
  );
}
