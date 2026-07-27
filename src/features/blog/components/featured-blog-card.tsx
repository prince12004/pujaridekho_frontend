import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { images } from "@/lib/images";
import type { BlogPost } from "@/features/blog/types";

export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] p-8 text-white shadow-lg sm:p-10"
    >
      <Image
        src={images[post.image]}
        alt={post.title}
        fill
        priority
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/55 to-transparent" />
      <Badge className="relative mb-4 w-fit bg-primary font-ui text-[11px] font-bold">Featured</Badge>
      <div className="relative flex items-center gap-3 text-xs font-semibold text-brand-cream/80">
        <span>{post.category}</span>
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {post.readTime}
        </span>
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
