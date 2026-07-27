import type { ImageKey } from "@/lib/images";

export interface PoojaPackage {
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export interface PoojaDetail {
  slug: string;
  name: string;
  category: string;
  duration: string;
  location: string;
  price: number;
  marketPrice: number;
  image: ImageKey;
  galleryImages: ImageKey[];
  tag?: string;
  overview: string;
  benefits: string[];
  importance: string;
  whoShouldPerform: string;
  samagri: string[];
  vidhiSteps: { title: string; description: string }[];
  packages: PoojaPackage[];
  faq: { question: string; answer: string }[];
  relatedBlogSlugs: string[];
  relatedProductSlugs: string[];
}
