"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { siteConfig } from "@/lib/constants";

const links = [
  { label: "Home", href: "/" },
  { label: "Poojas", href: "/poojas" },
  { label: "Pandit Ji", href: "/pandits" },
  { label: "Festival Pooja", href: "/festivals" },
  { label: "Consultation", href: "/consultation" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, mobile, openLogin } = useAuthModal();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-secondary lg:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[85%] flex-col border-none bg-brand-purple-deep p-0 text-brand-cream sm:max-w-sm"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Logo light onClick={() => setOpen(false)} />
        </div>

        <nav className="flex flex-col overflow-y-auto px-5 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-heading border-b border-white/8 py-3.5 text-lg text-brand-cream transition-colors hover:text-brand-gold-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 px-5 py-6">
          {isLoggedIn ? (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3 transition-colors hover:bg-white/5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                {mobile?.slice(0, 2)}
              </span>
              <div>
                <div className="text-sm font-bold">+91 {mobile}</div>
                <div className="text-xs text-brand-cream/60">Logged in</div>
              </div>
            </Link>
          ) : (
            <Button
              className="font-ui bg-gradient-to-r from-accent to-brand-gold-soft font-bold text-secondary hover:opacity-90"
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
            >
              <User /> Login
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="main_books border-white/25 bg-transparent font-ui font-bold text-brand-cream hover:bg-white/10"
          >
            <Link href="#book" onClick={() => setOpen(false)}>
              Book Now
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/25 bg-transparent font-ui font-bold text-brand-cream hover:bg-white/10"
          >
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>
              <Phone /> {siteConfig.contact.phone}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
