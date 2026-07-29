"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ACCOUNT_MOBILE_NAV } from "@/features/account/nav-config";

export function AccountMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden">
      {ACCOUNT_MOBILE_NAV.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/account" && pathname?.startsWith(item.href + "/"));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
