import type { ImageKey } from "@/lib/images";

export interface Pooja {
  slug: string;
  name: string;
  duration: string;
  location: string;
  price: number;
  marketPrice?: number;
  image: ImageKey;
  tag?: string;
}

export interface Festival {
  slug: string;
  name: string;
  dateLabel: string;
  image: ImageKey;
}

export interface ShopCategory {
  slug: string;
  name: string;
  itemCount: string;
  icon: "kit" | "incense" | "murti" | "book" | "yantra" | "rudraksha" | "mala" | "havan";
}

export interface City {
  slug: string;
  name: string;
  panditCount: string;
}

export interface Pandit {
  slug: string;
  name: string;
  initials: string;
  specialization: string;
  experience: string;
  languages: string;
  rating: number;
  completedPoojas: string;
}

export interface Product {
  slug: string;
  name: string;
  price: number;
  image: ImageKey;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: ImageKey;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
}
