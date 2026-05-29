import { useEffect, useState } from "react";

export function useNow(intervalMs = 1000) {
  // Start null to avoid SSR/client hydration mismatch from Date.now()
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now ?? new Date(0);
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
