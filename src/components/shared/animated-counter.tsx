"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates the numeric portion of a stat string (e.g. "10,000+", "4.9★", "24×7")
 * from 0 up to its target while preserving whatever prefix/suffix surrounds it.
 */
export function AnimatedCounter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(() => zeroed(value));

  useEffect(() => {
    if (!inView) return;

    const match = value.match(/[\d,.]+/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const numStr = match[0];
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numStr.length);
    const start = performance.now();

    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString("en-IN");
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function zeroed(value: string): string {
  const match = value.match(/[\d,.]+/);
  if (!match) return value;
  const numStr = match[0];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const zero = decimals > 0 ? (0).toFixed(decimals) : "0";
  return `${value.slice(0, match.index)}${zero}${value.slice((match.index ?? 0) + numStr.length)}`;
}
