"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryPills } from "@/components/shared/category-pills";
import { Pagination } from "@/components/shared/pagination";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { useBlogCategories, useBlogs, type PublicBlog } from "@/features/blog/api/use-blogs";

const POSTS_PER_PAGE = 6;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&auto=format&fit=crop";

function categoryName(post: PublicBlog) {
  return typeof post.category === "object" ? post.category?.name : post.category;
}

export function BlogListingClient({ excludeSlug }: { excludeSlug?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBlogs({ limit: 100 });
  const { data: categories } = useBlogCategories();

  const posts = (data?.items ?? []).filter((post) => post.slug !== excludeSlug);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = category === "All" || categoryName(post) === category;
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPosts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const recent = [...posts]
    .sort((a, b) => (a.PublishedAt && b.PublishedAt ? (a.PublishedAt < b.PublishedAt ? 1 : -1) : 0))
    .slice(0, 4);

  return (
    <Container>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills
          categories={["All", ...(categories ?? []).map((c) => c.name)]}
          active={category}
          onChange={(c) => {
            setCategory(c);
            setPage(1);
          }}
        />
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search articles…"
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          {isLoading ? (
            <p className="py-16 text-center text-muted-foreground">Loading articles…</p>
          ) : currentPosts.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No articles match your search yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {currentPosts.map((post) => (
                <MediaCard key={post.slug} href={`/blog/${post.slug}`}>
                  <MediaCardImage src={post.coverImage ?? FALLBACK_IMAGE} alt={post.title} height="h-55" />
                  <MediaCardBody>
                    <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                      <span>{categoryName(post) ?? "General"}</span>
                    </div>
                    <h3 className="font-heading text-lg leading-snug">{post.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Read More <ArrowRight size={14} />
                    </span>
                  </MediaCardBody>
                </MediaCard>
              ))}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
        </div>

        <aside className="flex flex-col gap-10">
          {recent.length > 0 && (
            <div>
              <h3 className="font-heading mb-4 text-lg">Recent Posts</h3>
              <ul className="flex flex-col gap-4">
                {recent.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <img src={post.coverImage ?? FALLBACK_IMAGE} alt={post.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-semibold text-muted-foreground">{categoryName(post) ?? "General"}</span>
                        <span className="font-heading text-sm leading-snug transition-colors group-hover:text-primary">
                          {post.title}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
