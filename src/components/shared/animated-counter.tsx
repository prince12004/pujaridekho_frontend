"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Shows a stat string (e.g. "1,000+", "4.9★", "24×7") and, in the browser,
 * animates the numeric portion of a stat string (e.g. "1,000+", "4.9★", "24×7")
 * from 0 up to its target while preserving whatever prefix/suffix surrounds it.
 */
export function AnimatedCounter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // Start from the real value so the server-rendered HTML (what Google, link
  // previews and no-JS visitors see) shows the actual number — never "0+".
  // The count-up animation only runs in the browser once the stat scrolls into view.
  const [display, setDisplay] = useState(value);

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
