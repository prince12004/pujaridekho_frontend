"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ACCOUNT_MOBILE_NAV } from "@/features/account/nav-config";

export function AccountMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.12)] backdrop-blur-sm md:hidden">
      {ACCOUNT_MOBILE_NAV.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/account" && pathname?.startsWith(item.href + "/"));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors duration-200 active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
            <Icon className={cn("size-5 transition-transform duration-200", isActive && "scale-110")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
