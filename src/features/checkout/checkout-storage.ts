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
  slug?: string;
  savedAt?: number;
}

const STORAGE_KEY = "pujaridekho_checkout_prefill";

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

export function readCheckoutPrefillForSlug(slug: string | undefined): CheckoutPrefill | null {
  const stored = readCheckoutPrefill();
  if (!stored || !slug || typeof window === "undefined") return stored;
  if (stored.slug === slug) return stored;

  window.sessionStorage.removeItem(STORAGE_KEY);
  return null;
}
