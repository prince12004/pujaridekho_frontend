"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/shared/container";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryPills } from "@/components/shared/category-pills";
import { Pagination } from "@/components/shared/pagination";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { ArrowRight } from "lucide-react";
import { images } from "@/lib/images";
import { BlogSidebarList } from "@/features/blog/components/blog-sidebar-list";
import { blogCategories } from "@/features/blog/data";
import type { BlogPost } from "@/features/blog/types";

const POSTS_PER_PAGE = 6;

export function BlogListingClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPosts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const popular = posts.filter((post) => post.popular).slice(0, 4);
  const recent = [...posts].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1)).slice(0, 4);

  return (
    <Container>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills
          categories={blogCategories}
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
          {currentPosts.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No articles match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {currentPosts.map((post) => (
                <MediaCard key={post.slug} href={`/blog/${post.slug}`}>
                  <MediaCardImage src={images[post.image]} alt={post.title} height="h-44" />
                  <MediaCardBody>
                    <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
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
          <BlogSidebarList title="Popular Articles" posts={popular} />
          <BlogSidebarList title="Recent Posts" posts={recent} />
        </aside>
      </div>
    </Container>
  );
}
