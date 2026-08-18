export interface PriceablePackage {
  price: number;
  cityPrices?: { city: string; price: number }[];
}

/** Mirrors apps/api/src/lib/pooja-pricing.ts — the package's own city
 * override wins when it matches the customer's selected city, otherwise
 * falls back to the package's base price. */
export function resolvePackagePrice(pkg: PriceablePackage, city?: string | null): number {
  if (!city) return pkg.price;
  const override = pkg.cityPrices?.find((cp) => cp.city.trim().toLowerCase() === city.trim().toLowerCase());
  return override?.price ?? pkg.price;
}
