"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCOUNT_NAV } from "@/features/account/nav-config";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { LogoMark } from "@/components/layout/logo";

export function AccountSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuthModal();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/" className="flex items-center">
          <LogoMark className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {ACCOUNT_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/account" && pathname?.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4.5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4.5" />
          Logout
        </button>
      </div>
    </div>
  );
}
