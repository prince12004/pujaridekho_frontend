import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarPlus,
  Sparkles,
  PartyPopper,
  Users,
  UserSquare2,
  MessageCircleQuestion,
  ShoppingBag,
  Tags,
  PackageCheck,
  Ticket,
  Newspaper,
  FolderTree,
  MapPin,
  Star,
  Quote,
  LayoutTemplate,
  FileText,
  Image as ImageIcon,
  Search,
  Globe2,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  ScrollText,
  Mail,
  Clock,
  ClipboardList,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  comingSoon?: boolean;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Bookings",
    items: [
      { label: "All Bookings", href: "/admin/bookings", icon: CalendarCheck, permission: "bookings:view" },
      { label: "Create Offline Booking", href: "/admin/bookings/offline/new", icon: CalendarPlus, permission: "bookings:create" },
    ],
  },
  {
    title: "Poojas",
    items: [
      { label: "All Poojas", href: "/admin/poojas", icon: Sparkles, permission: "poojas:view" },
      { label: "Pooja Categories", href: "/admin/pooja-categories", icon: FolderTree, permission: "poojas:view" },
      { label: "Samagri Templates", href: "/admin/samagri-templates", icon: ClipboardList, permission: "poojas:view" },
      { label: "Festival Poojas", href: "/admin/festivals", icon: PartyPopper, permission: "festivals:manage" },
      { label: "Muhurat Management", href: "/admin/muhurats", icon: Clock, permission: "poojas:manage" },
    ],
  },
  {
    title: "Pandits",
    items: [
      { label: "All Pandits", href: "/admin/pandits", icon: UserSquare2, permission: "pandits:view" },
      { label: "Pandit Applications", href: "/admin/pandit-applications", icon: MessageCircleQuestion, permission: "pandit_applications:manage" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users, permission: "customers:view" },
      { label: "Consultations", href: "/admin/consultations", icon: MessageCircleQuestion, permission: "consultations:manage" },
    ],
  },
  {
    title: "Ecommerce",
    items: [
      { label: "Products", href: "/admin/products", icon: ShoppingBag, permission: "ecommerce:manage" },
      { label: "Product Categories", href: "/admin/product-categories", icon: Tags, permission: "ecommerce:manage" },
      { label: "Orders", href: "/admin/orders", icon: PackageCheck, permission: "ecommerce:manage" },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket, permission: "coupons:manage" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blogs", href: "/admin/blogs", icon: Newspaper, permission: "content:manage" },
      { label: "Blog Categories", href: "/admin/blog-categories", icon: FolderTree, permission: "content:manage" },
      { label: "Cities & Service Areas", href: "/admin/cities", icon: MapPin, permission: "settings:manage" },
      { label: "Reviews", href: "/admin/reviews", icon: Star, permission: "reviews:manage" },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote, permission: "reviews:manage" },
      { label: "Newsletter Subscribers", href: "/admin/newsletter", icon: Mail, permission: "content:manage" },
    ],
  },
  {
    title: "Website CMS",
    items: [
      { label: "Homepage CMS", href: "/admin/cms/homepage", icon: LayoutTemplate, permission: "cms:manage" },
      { label: "Pages CMS", href: "/admin/cms/pages", icon: FileText, permission: "cms:manage" },
      { label: "Media Library", href: "/admin/cms/media", icon: ImageIcon, permission: "media:manage" },
    ],
  },
  {
    title: "SEO",
    items: [
      { label: "SEO Manager", href: "/admin/seo", icon: Search, permission: "seo:manage" },
      { label: "Advanced SEO (City × Pooja)", href: "/admin/seo/advanced", icon: Globe2, permission: "seo:manage" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3, permission: "reports:view" },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck, permission: "users:manage" },
      { label: "Website Settings", href: "/admin/settings", icon: Settings, permission: "settings:manage" },
      { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText, permission: "audit:view" },
    ],
  },
];
