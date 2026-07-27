export interface MuhuratSlot {
  id: string;
  name: string;
  timeRange: string;
}

const MUHURAT_POOL = [
  { name: "Abhijit Muhurat", startMin: 11 * 60 + 45, durationMin: 48 },
  { name: "Amrit Kaal", startMin: 6 * 60 + 10, durationMin: 90 },
  { name: "Brahma Muhurat", startMin: 4 * 60 + 30, durationMin: 48 },
  { name: "Godhuli Muhurat", startMin: 18 * 60 + 40, durationMin: 24 },
  { name: "Vijay Muhurat", startMin: 14 * 60 + 15, durationMin: 48 },
  { name: "Labh Muhurat", startMin: 10 * 60 + 30, durationMin: 90 },
  { name: "Shubh Muhurat", startMin: 9 * 60, durationMin: 90 },
  { name: "Char Muhurat", startMin: 16 * 60, durationMin: 90 },
];

// Deterministic per-date PRNG (mulberry32) so the same date always yields the
// same muhurat slots — this is a demo generator, not real Panchang data;
// swap for a real ephemeris/astrology API when one is wired up.
function seededRandom(seed: number) {
  let t = seed;
  return function random() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function formatMinutes(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function getMuhuratsForDate(dateStr: string): MuhuratSlot[] {
  if (!dateStr) return [];

  const random = seededRandom(hashString(dateStr));
  const pool = [...MUHURAT_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool
    .slice(0, 3)
    .map((slot) => {
      const jitter = Math.floor((random() - 0.5) * 20);
      const start = slot.startMin + jitter;
      const end = start + slot.durationMin;
      return {
        id: slot.name.toLowerCase().replace(/\s+/g, "-"),
        name: slot.name,
        timeRange: `${formatMinutes(start)} – ${formatMinutes(end)}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
