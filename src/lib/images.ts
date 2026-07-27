/**
 * Curated photography for the homepage, sourced from Unsplash (free license,
 * commercial use permitted, no attribution required — credited below anyway).
 * Swap these for CMS-managed media in the Admin Panel phase.
 */
function unsplash(id: string, params = "w=1600&q=80&auto=format&fit=crop") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

export const images = {
  heroTemple: unsplash("1742315600604-17924e6dd13b", "w=2400&q=80&auto=format&fit=crop"), // Nikhil Patil — Sun Temple, Modhera
  incenseSmoke: unsplash("1758903846845-e8ae224a5047"), // Liana S
  marigold: unsplash("1574267498814-ebfb802ec01e"), // pineapple pizza
  holiColors: unsplash("1756661921244-35636963e096"), // Dibakar Roy
  citySkyline: unsplash("1589829973523-e4ddcbbd40e7"), // Sooraj Dev — Gurugram
  candleBrownHolder: unsplash("1605292356183-a77d0a9c9d1d"), // Umesh Soni
  bowlWoodenTable: unsplash("1602305361939-806b254e9f47"), // Sonika Agarwal
  threeCandlesBowl: unsplash("1636619773834-c7e0762ddfe1"), // Rajyavardhan Singh
  whiteRoundLight: unsplash("1605378229010-11aedbb01b24"), // Ashwini Chaudhary
  tealightCandle: unsplash("1575989762363-c7ce0137427a"), // Manoj kumar kasirajan
  candleGroupTable: unsplash("1636737512034-518389c47764"), // VD Photography
  roundBowlCandle: unsplash("1551077095-ba46221b51ee"), // CHIRAG K
  candleGroup2: unsplash("1662720868850-e60cefb03201"), // Joshi Milestoner
  candleDarkTable: unsplash("1636266513371-acdf50931253"), // Rishabh dev
  candlesCircleFloor: unsplash("1635192592106-77a5aacbe1a3"), // Suchandra Roy Chowdhury
  handHoldingCandle: unsplash("1700403455026-3559b076ff03"), // Janardan Mahto
  scentedCandle: unsplash("1574266742257-41460b7992ee"), // Madhav
  ganeshIdol: unsplash("1759674885815-14f62ee2802b"), // Sonika Agarwal
  brassBells: unsplash("1523613002-bbcd22be7f02"), // Lisheng Chang
} as const;

export type ImageKey = keyof typeof images;
