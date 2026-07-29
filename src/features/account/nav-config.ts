import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarCheck,
  PackageCheck,
  Heart,
  Sparkles,
  MessageCircleQuestion,
  Wallet,
  FileText,
  MapPin,
  Star,
  Bell,
  LifeBuoy,
  UserCircle,
} from "lucide-react";

export interface AccountNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ACCOUNT_NAV: AccountNavItem[] = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "My Orders", href: "/account/orders", icon: PackageCheck },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "My Kundli", href: "/account/kundli", icon: Sparkles },
  { label: "Consultations", href: "/account/consultations", icon: MessageCircleQuestion },
  { label: "Payments", href: "/account/payments", icon: Wallet },
  { label: "Invoices", href: "/account/invoices", icon: FileText },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Reviews", href: "/account/reviews", icon: Star },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Support", href: "/account/support", icon: LifeBuoy },
  { label: "Profile", href: "/account/profile", icon: UserCircle },
];

export const ACCOUNT_MOBILE_NAV: AccountNavItem[] = [
  { label: "Home", href: "/account", icon: LayoutDashboard },
  { label: "Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "Orders", href: "/account/orders", icon: PackageCheck },
  { label: "Account", href: "/account/profile", icon: UserCircle },
];
