import { usePrefs } from "@/lib/preferences";
import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";
import { VintageClock } from "./VintageClock";
import { GlassClock } from "./GlassClock";
import { TradingClock } from "./TradingClock";

export function MainClock({ tz, label }: { tz: string; label: string }) {
  const { prefs } = usePrefs();
  const key = prefs.theme;

  return (
    <div
      key={key}
      className={prefs.animations ? "animate-fade-in" : ""}
    >
      {key === "digital" && <DigitalClock tz={tz} label={label} />}
      {key === "analog" && <AnalogClock tz={tz} label={label} />}
      {key === "vintage" && <VintageClock tz={tz} label={label} />}
      {key === "glass" && <GlassClock tz={tz} label={label} />}
      {key === "trading" && <TradingClock tz={tz} label={label} />}
    </div>
  );
}
