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

export async function middleware(request: NextRequest) {
  if (!API_URL) return NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const rules = await loadRules();
  const rule = rules.get(path.toLowerCase());
  if (!rule) return NextResponse.next();

  const target = rule.toPath.startsWith("http") ? new URL(rule.toPath) : new URL(rule.toPath, request.nextUrl.origin);
  if (!rule.toPath.startsWith("http")) target.search = request.nextUrl.search;
  return NextResponse.redirect(target, rule.statusCode);
}

export const config = {
  // Public pages only — never admin, account, API, Next internals or files.
  matcher: ["/((?!_next|api|admin|account|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\.[a-z0-9]+$).*)"],
};
