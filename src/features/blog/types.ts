import type { ImageKey } from "@/lib/images";

export interface BlogAuthor {
  name: string;
  role: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: ImageKey;
  publishDate: string;
  author: BlogAuthor;
  featured?: boolean;
  popular?: boolean;
  contentHtml: string;
  faq: { question: string; answer: string }[];
  relatedPoojaSlugs: string[];
  relatedProductSlugs: string[];
}
