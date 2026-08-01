"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MegaMenuContent } from "@/components/layout/mega-menu-content";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/shared/search-overlay";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useCart } from "@/features/cart/cart-context";
import { shopCategories } from "@/features/home/data";

const poojaColumns = [
  {
    heading: "Popular Poojas",
    links: [
      { label: "Satyanarayan Puja", href: "/poojas/satyanarayan-puja" },
      { label: "Griha Pravesh Puja", href: "/poojas/griha-pravesh" },
      { label: "Ganesh Puja", href: "/poojas/ganesh-puja" },
      { label: "Lakshmi Puja", href: "/poojas/lakshmi-puja" },
    ],
  },
  {
    heading: "By Occasion",
    links: [
      { label: "Vastu Shanti", href: "/poojas/vastu-shanti" },
      { label: "Navgraha Shanti", href: "/poojas/navgraha-shanti" },
      { label: "Marriage Puja", href: "/poojas/marriage-puja" },
      { label: "Office Opening Puja", href: "/poojas/office-puja" },
    ],
  },
];

const shopColumns = [
  {
    heading: "Shop by Category",
    links: shopCategories.slice(0, 4).map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
  },
  {
    heading: "More Categories",
    links: shopCategories.slice(4, 9).map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
  },
];

const navLinks = [
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Consultation", href: "/consultation" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isLoggedIn, mobile, openLogin } = useAuthModal();
  const { count: cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[74px] w-[90%] max-w-[1600px] items-center justify-between gap-6">
        <Logo />

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-ui bg-transparent text-[0.92rem] font-semibold">
                Poojas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuContent
                  columns={poojaColumns}
                  promo={{
                    title: "Festival Poojas",
                    description: "Book ahead for upcoming festivals",
                    href: "/festivals",
                    image: "candlesCircleFloor",
                  }}
                />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.slice(0, 2).map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className="font-ui inline-flex h-9 items-center rounded-lg px-2.5 text-[0.92rem] font-semibold transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-ui bg-transparent text-[0.92rem] font-semibold">
                Products
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuContent
                  columns={shopColumns}
                  promo={{
                    title: "Puja Essentials",
                    description: "Temple-grade samagri, delivered",
                    href: "/products",
                    image: "brassBells",
                  }}
                />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.slice(2).map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className="font-ui inline-flex h-9 items-center rounded-lg px-2.5 text-[0.92rem] font-semibold transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-secondary sm:inline-flex"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
          </Button>
          <div className="relative hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="text-secondary" aria-label="Cart" asChild>
              <Link href="/cart">
                <ShoppingCart />
              </Link>
            </Button>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-full bg-muted py-1 pl-1 pr-3 sm:inline-flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-white">
                {mobile?.slice(0, 2)}
              </span>
              <span className="font-ui text-xs font-bold">My Account</span>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-secondary sm:inline-flex"
              aria-label="Login"
              onClick={() => openLogin()}
            >
              <User />
            </Button>
          )}
          <Button className="main_books font-ui hidden font-bold sm:inline-flex" asChild>
            <Link href="#book">Book Now</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
