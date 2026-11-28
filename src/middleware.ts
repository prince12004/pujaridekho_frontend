import { NextResponse, type NextRequest } from "next/server";

// Applies the 301/302 redirects managed in Admin → SEO Management →
// Redirects. The list is cached in memory and refreshed at most once a
// minute; if the API is unreachable the site simply carries on unredirected.
interface RedirectRule {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
const TTL_MS = 60_000;
let cache: { at: number; rules: Map<string, RedirectRule> } | null = null;
let inflight: Promise<Map<string, RedirectRule>> | null = null;

async function loadRules(): Promise<Map<string, RedirectRule>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rules;
  if (!inflight) {
    inflight = (async () => {
      try {
        const res = await fetch(`${API_URL}/seo-pages/redirects`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { data: RedirectRule[] };
        const rules = new Map(json.data.map((r) => [r.fromPath.toLowerCase(), r]));
        cache = { at: Date.now(), rules };
        return rules;
      } catch {
        // Keep serving the last known rules; retry after the TTL.
        cache = { at: Date.now(), rules: cache?.rules ?? new Map() };
        return cache.rules;
      } finally {
        inflight = null;
      }
    })();
  }
  return inflight;
}

// ---------------------------------------------------------------- Legacy URLs
// URLs from the previous website that Google still has indexed. Each goes to
// its exact new page when one exists, otherwise to the closest parent page
// (never blindly to the homepage). Results are cached per path.
const legacyCache = new Map<string, { at: number; to: string }>();

/** true / false when the API answered; null when it could not be reached. */
async function exists(apiPath: string): Promise<boolean | null> {
  try {
    const res = await fetch(`${API_URL}${apiPath}`, { cache: "no-store" });
    if (res.ok) return true;
    return res.status === 404 ? false : null;
  } catch {
    return null;
  }
}

async function resolveLegacy(path: string): Promise<string | null> {
  const p = path.toLowerCase();
  if (p === "/about-us") return "/about";
  if (p === "/blogs" || p === "/blogs/read") return "/blog";
  if (p === "/contact-us") return "/contact";
  // "Noida Extension" is the common name for Greater Noida West.
  if (p === "/pandit-in-noida-extension") return "/pandit-in-greater-noida-west";

  let candidate: { to: string; check: string; fallback: string } | null = null;
  const blog = /^\/blogs?\/read\/([a-z0-9-]+)$/.exec(p) ?? /^\/blogs\/([a-z0-9-]+)$/.exec(p);
  if (blog) candidate = { to: `/blog/${blog[1]}`, check: `/blogs/${blog[1]}`, fallback: "/blog" };
  const sector = /^\/panditji-sector-(\d+)-([a-z-]+)$/.exec(p);
  if (sector) {
    const slug = `pandit-in-sector-${sector[1]}-${sector[2]}`;
    candidate = { to: `/${slug}`, check: `/seo-pages/by-slug/${slug}`, fallback: `/pandit-in-${sector[2]}` };
  }
  const area = !sector && /^\/panditji-([a-z0-9-]+)$/.exec(p);
  if (area) candidate = { to: `/pandit-in-${area[1]}`, check: `/seo-pages/by-slug/pandit-in-${area[1]}`, fallback: "/seo-pages" };
  if (!candidate) return null;

  const hit = legacyCache.get(p);
  if (hit && Date.now() - hit.at < 10 * TTL_MS) return hit.to;
  const found = await exists(candidate.check);
  const to = found === false ? candidate.fallback : candidate.to;
  // Only remember real answers — an API hiccup must not pin the fallback.
  if (found !== null) legacyCache.set(p, { at: Date.now(), to });
  return to;
}

export async function middleware(request: NextRequest) {
  if (!API_URL) return NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const rules = await loadRules();
  const rule = rules.get(path.toLowerCase());
  if (!rule) {
    const legacy = await resolveLegacy(path);
    if (!legacy) return NextResponse.next();
    const target = new URL(legacy, request.nextUrl.origin);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 301);
  }

  const target = rule.toPath.startsWith("http") ? new URL(rule.toPath) : new URL(rule.toPath, request.nextUrl.origin);
  if (!rule.toPath.startsWith("http")) target.search = request.nextUrl.search;
  return NextResponse.redirect(target, rule.statusCode);
}

export const config = {
  // Public pages only — never admin, account, API, Next internals or files.
  matcher: ["/((?!_next|api|admin|account|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\.[a-z0-9]+$).*)"],
};
