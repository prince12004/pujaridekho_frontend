import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicBlog } from "@/features/blog/api/use-blogs";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200&auto=format&fit=crop";

export function FeaturedBlogCard({ post }: { post: PublicBlog }) {
  const category = typeof post.category === "object" ? post.category?.name : post.category;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] p-8 text-white shadow-lg sm:p-10"
    >
      <img
        src={post.coverImage ?? FALLBACK_IMAGE}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/55 to-transparent" />
      <Badge className="relative mb-4 w-fit bg-primary font-ui text-[11px] font-bold">Featured</Badge>
      <div className="relative flex items-center gap-3 text-xs font-semibold text-brand-cream/80">
        {category && <span>{category}</span>}
        {post.PublishedAt && (
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(post.PublishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
      </div>
      <h2 className="relative mt-3 max-w-2xl text-balance font-heading text-2xl font-bold text-brand-cream sm:text-3xl">
        {post.title}
      </h2>
      <p className="relative mt-2 max-w-xl text-sm text-brand-cream/85">{post.excerpt}</p>
      <span className="relative mt-4 inline-flex items-center gap-1.5 font-ui text-sm font-bold text-brand-gold-soft">
        Read Full Article <ArrowRight size={14} />
      </span>
    </Link>
  );
}
