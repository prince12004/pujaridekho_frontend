// Server-only base URL for fetches made from Server Components/route handlers
// (never bundled to the browser, unlike NEXT_PUBLIC_API_URL). Set API_INTERNAL_URL
// to a same-box address (e.g. http://localhost:5001/api/v1) in production so
// server-side rendering doesn't round-trip through the public domain. Falls
// back to the public URL when unset, which is exactly right for local dev
// where both already point at the same local backend.
export const SERVER_API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
