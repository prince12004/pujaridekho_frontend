export interface CheckoutPackageSelection {
  name: string;
  price: number;
}

export interface CheckoutSamagriItem {
  name: string;
  price: number;
}

export interface CheckoutPrefill {
  name?: string;
  mobile?: string;
  city?: string;
  address?: string;
  date?: string;
  muhuratSlotId?: string;
  muhuratLabel?: string;
  selectedPackage?: CheckoutPackageSelection | null;
  selectedSamagri?: CheckoutSamagriItem[];
  /** Which pooja/festival slug the booking-specific fields above (date,
   * muhurat, package, samagri) were saved for — used to detect "this prefill
   * is from a different service" so a stale date/package doesn't silently
   * carry over into an unrelated booking. */
  slug?: string;
  /** Timestamp of the last save — stale entries (an old test booking left
   * open in this tab from a while ago) shouldn't silently resurface as if
   * the customer had just filled them in. */
  savedAt?: number;
}

// Session-scoped handoff between the homepage widget / a pooja-detail "Book
// Now" click and the /checkout page — a full page navigation unmounts any
// React context those pages held the selection in, so it can't survive the
// trip any other way. Reads merge onto whatever's already stored so a
// homepage-entered name/mobile isn't wiped out by a later package pick made
// on the pooja detail page in the same session, and vice versa.
const STORAGE_KEY = "pujaridekho_checkout_prefill";

// A tab can sit open for hours across unrelated visits — past that window,
// a saved name/mobile/address stops being "what the customer just entered"
// and starts being stale data from a different, long-finished attempt.
const PREFILL_TTL_MS = 30 * 60 * 1000;

export function saveCheckoutPrefill(patch: CheckoutPrefill) {
  if (typeof window === "undefined") return;
  const existing = readCheckoutPrefill() ?? {};
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...patch, savedAt: Date.now() }));
}

export function readCheckoutPrefill(): CheckoutPrefill | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CheckoutPrefill;
    // No timestamp at all means this was written before TTL tracking existed
    // — treat it the same as expired rather than trusting it indefinitely.
    if (!parsed.savedAt || Date.now() - parsed.savedAt > PREFILL_TTL_MS) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearCheckoutPrefill() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

/** Reads the prefill for a specific pooja/festival — if what's stored was
 * saved while booking a DIFFERENT service (or nothing's tagged with a slug
 * at all), it's someone else's booking attempt as far as this one's
 * concerned, so the form starts from a clean slate rather than silently
 * showing a name/mobile/date nobody just typed for THIS booking. */
export function readCheckoutPrefillForSlug(slug: string | undefined): CheckoutPrefill | null {
  const stored = readCheckoutPrefill();
  if (!stored || !slug || typeof window === "undefined") return stored;
  if (stored.slug === slug) return stored;

  window.sessionStorage.removeItem(STORAGE_KEY);
  return null;
}
