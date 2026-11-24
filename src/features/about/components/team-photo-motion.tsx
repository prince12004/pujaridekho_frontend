"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Photo settles from a slight zoom as the card scrolls into view. */
export function TeamPhotoMotion({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute inset-0"
      initial={reduce ? false : { scale: 1.18, filter: "saturate(0.6)" }}
      whileInView={{ scale: 1, filter: "saturate(1)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
