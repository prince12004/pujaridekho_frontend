import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";
import type { SeoSettings as SeoSettingsType } from "@/features/seo-pages/api";

const BASE = "/seo-management";

export const SEO_LOCATION_TYPES = [
  { value: "city", label: "Cities", singular: "City" },
  { value: "sector", label: "Sectors", singular: "Sector" },
  { value: "locality", label: "Localities", singular: "Locality" },
  { value: "commercial", label: "Commercial Areas", singular: "Commercial Area" },
  { value: "society", label: "Societies", singular: "Society" },
] as const;
export type SeoLocationType = (typeof SEO_LOCATION_TYPES)[number]["value"];

export const SEO_PAGE_TYPES = [
  { value: "location", label: "Location Pages" },
  { value: "office_location", label: "Office Puja Pages" },
  { value: "service", label: "Puja Service Pages" },
] as const;
export type SeoPageType = (typeof SEO_PAGE_TYPES)[number]["value"];

export const DIRECTORY_SECTIONS = [
  { value: "main", label: "Main city page" },
  { value: "sectors", label: "Sectors" },
  { value: "localities", label: "Localities" },
  { value: "commercial", label: "Commercial areas" },
  { value: "societies", label: "Societies" },
  { value: "office", label: "Office puja" },
] as const;

export interface SeoLocation {
  _id: string;
  type: SeoLocationType;
  name: string;
  slug: string;
  city?: { _id: string; name: string; slug: string } | null;
  parent?: { _id: string; name: string; slug: string; type: string } | null;
  areaLabel?: string;
  pincode?: string;
  sortOrder?: number;
  isActive: boolean;
  pages?: { _id: string; pageType: SeoPageType; slug: string; status: string; indexable: boolean }[];
}

export interface SeoPageListItem {
  _id: string;
  pageType: SeoPageType;
  slug: string;
  name: string;
  h1?: string;
  metaTitle?: string;
  status: "draft" | "published";
  indexable: boolean;
  showInDirectory: boolean;
  directorySection: string;
  directoryOrder: number;
  location?: { _id: string; name: string; type: string; slug: string; city?: { name: string } | null } | null;
  wordCount: number;
  eligible: boolean;
  updatedAt: string;
}

export interface SeoPageDetail extends Omit<SeoPageListItem, "location"> {
  location?: { _id: string; name: string; type: string; slug: string } | null;
  metaDescription?: string;
  intro?: string;
  content?: string;
  bannerImage?: string;
  images: string[];
  heroTagline?: string;
  services: { label: string; pooja?: string | null; url?: string; note?: string }[];
  faqs: { question: string; answer: string }[];
  internalLinks: { label: string; url: string }[];
  nearbyLocations: string[];
  coverageNote?: string;
  canonicalUrl?: string;
  minWords: number;
}

export type SeoPageInput = Partial<Omit<SeoPageDetail, "_id" | "wordCount" | "eligible" | "updatedAt" | "minWords" | "location">> & {
  location?: string | null;
};

export const FOOTER_GROUP_KINDS = [
  { value: "links", label: "Links column (manual list)" },
  { value: "tags", label: "Tag links beside the logo (manual list)" },
  { value: "categories", label: "Puja categories (one automatic column per category)" },
  { value: "poojas", label: "Pujas (one automatic column)" },
  { value: "blogs", label: "Latest blogs (automatic)" },
  { value: "text", label: "Text block (heading + paragraph)" },
] as const;

export interface FooterGroupAdmin {
  _id?: string;
  key: string;
  title: string;
  isActive: boolean;
  kind?: "links" | "tags" | "categories" | "poojas" | "blogs" | "text";
  body?: string;
  limit?: number;
  links: { _id?: string; label: string; url: string; isActive: boolean }[];
}

export interface SeoRedirect {
  _id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302 | 308;
  isActive: boolean;
  note?: string;
  createdAt: string;
}

const key = (...parts: unknown[]) => ["admin", "seo-management", ...parts];

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: key() });
}

// ---- Locations
export function useSeoLocations(params: { type?: string; city?: string; search?: string } = {}) {
  return useQuery({
    queryKey: key("locations", params),
    queryFn: async () => (await adminApiClient.get<{ data: SeoLocation[] }>(`${BASE}/locations`, { params })).data.data,
  });
}

export function useSaveSeoLocation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: Record<string, unknown> }) =>
      id
        ? (await adminApiClient.patch(`${BASE}/locations/${id}`, input)).data.data
        : (await adminApiClient.post(`${BASE}/locations`, input)).data.data,
    onSuccess: invalidate,
  });
}

export function useDeleteSeoLocation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => adminApiClient.delete(`${BASE}/locations/${id}`),
    onSuccess: invalidate,
  });
}

// ---- Pages
export function useSeoPages(params: { pageType?: string; status?: string; city?: string; search?: string; needsContent?: string } = {}) {
  return useQuery({
    queryKey: key("pages", params),
    queryFn: async () => (await adminApiClient.get<{ data: SeoPageListItem[] }>(`${BASE}/pages`, { params })).data.data,
  });
}

export function useSeoPage(id?: string) {
  return useQuery({
    queryKey: key("page", id),
    enabled: !!id,
    queryFn: async () => (await adminApiClient.get<{ data: SeoPageDetail }>(`${BASE}/pages/${id}`)).data.data,
  });
}

export function useSaveSeoPage() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: SeoPageInput }) =>
      id
        ? (await adminApiClient.patch(`${BASE}/pages/${id}`, input)).data.data
        : (await adminApiClient.post(`${BASE}/pages`, input)).data.data,
    onSuccess: invalidate,
  });
}

export function useDeleteSeoPage() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => adminApiClient.delete(`${BASE}/pages/${id}`),
    onSuccess: invalidate,
  });
}

// ---- Directory
export function useUpdateDirectory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (items: { id: string; showInDirectory?: boolean; directorySection?: string; directoryOrder?: number }[]) =>
      adminApiClient.patch(`${BASE}/directory`, { items }),
    onSuccess: invalidate,
  });
}

// ---- Footer
export function useFooterGroups() {
  return useQuery({
    queryKey: key("footer"),
    queryFn: async () => (await adminApiClient.get<{ data: FooterGroupAdmin[] }>(`${BASE}/footer`)).data.data,
  });
}

export function useSaveFooterGroups() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (groups: FooterGroupAdmin[]) => (await adminApiClient.put(`${BASE}/footer`, { groups })).data.data,
    onSuccess: invalidate,
  });
}

// ---- Redirects
export function useSeoRedirects() {
  return useQuery({
    queryKey: key("redirects"),
    queryFn: async () => (await adminApiClient.get<{ data: SeoRedirect[] }>(`${BASE}/redirects`)).data.data,
  });
}

export function useSaveSeoRedirect() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: Partial<SeoRedirect> }) =>
      id ? adminApiClient.patch(`${BASE}/redirects/${id}`, input) : adminApiClient.post(`${BASE}/redirects`, input),
    onSuccess: invalidate,
  });
}

export function useDeleteSeoRedirect() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => adminApiClient.delete(`${BASE}/redirects/${id}`),
    onSuccess: invalidate,
  });
}

// ---- Sitemap report
export function useSitemapReport() {
  return useQuery({
    queryKey: key("sitemap"),
    queryFn: async () =>
      (
        await adminApiClient.get<{
          data: { included: { slug: string; name: string }[]; excluded: { slug: string; name: string; reason: string }[]; minWords: number };
        }>(`${BASE}/sitemap`)
      ).data.data,
  });
}

// ---- Page content settings (shared copy on landing pages, directory, footer)
export type { SeoSettings } from "@/features/seo-pages/api";

export function useSeoSettings() {
  return useQuery({
    queryKey: key("settings"),
    queryFn: async () => (await adminApiClient.get<{ data: SeoSettingsType }>(`${BASE}/settings`)).data.data,
  });
}

export function useSaveSeoSettings() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (input: SeoSettingsType) => (await adminApiClient.put(`${BASE}/settings`, input)).data.data as SeoSettingsType,
    onSuccess: invalidate,
  });
}

export function useResetSeoSettings() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async () => (await adminApiClient.post(`${BASE}/settings/reset`)).data.data as SeoSettingsType,
    onSuccess: invalidate,
  });
}

// ---- Optional starter data import
export interface StarterImportReport {
  dryRun: boolean;
  locations: number;
  draftPages: number;
  published: number;
  skippedExisting: number;
  notPublished: string[];
  footer: "created" | "kept-existing" | "skipped";
  footerLinksOff: string[];
  unmatchedPoojas: string[];
}

export function useImportStarterData() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (options: { dryRun?: boolean; locations?: boolean; pages?: boolean; footer?: boolean }) =>
      (await adminApiClient.post<{ data: StarterImportReport }>(`${BASE}/import-starter`, options)).data.data,
    onSuccess: invalidate,
  });
}
