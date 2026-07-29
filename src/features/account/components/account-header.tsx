"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useMyNotifications } from "@/features/account/api/use-notifications";
import { ACCOUNT_NAV } from "@/features/account/nav-config";

function usePageTitle() {
  const pathname = usePathname() ?? "/account";
  const segments = pathname.replace(/^\/account\/?/, "").split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  const match = ACCOUNT_NAV.find((item) => item.href === pathname);
  if (match) return match.label;
  return segments[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AccountHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { customer, logout } = useAuthModal();
  const title = usePageTitle();
  const { data } = useMyNotifications(1);

  const initials = customer?.name
    ? customer.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PD";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav}>
        <Menu className="size-5" />
      </Button>

      <h1 className="font-heading text-lg font-bold text-secondary">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/account/notifications" aria-label="Notifications">
            <Bell className="size-4.5" />
            {data && data.unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {data.unreadCount > 9 ? "9+" : data.unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{customer?.name ?? "Account"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>+91 {customer?.mobile}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                logout();
                window.location.href = "/";
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
