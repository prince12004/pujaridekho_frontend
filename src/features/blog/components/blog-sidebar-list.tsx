import Link from "next/link";
import Image from "next/image";
import { images } from "@/lib/images";
import type { BlogPost } from "@/features/blog/types";

export function BlogSidebarList({ title, posts }: { title: string; posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h3 className="font-heading mb-4 text-lg">{title}</h3>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={images[post.image]} alt={post.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold text-muted-foreground">{post.readTime}</span>
                <span className="font-heading text-sm leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
