"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LogOut, Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdminAuth } from "@/features/admin/auth/admin-auth-context";
import { useAdminSearch } from "@/features/admin/api/use-admin-search";
import { useMarkNotificationRead, useNotifications } from "@/features/admin/api/use-notifications";

function useBreadcrumb() {
  const pathname = usePathname() ?? "/admin";
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = "/admin/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });
  return crumbs;
}

export function AdminHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const crumbs = useBreadcrumb();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: searchResults, isFetching: isSearching } = useAdminSearch(searchQuery);
  const { data: notificationData } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav}>
        <Menu className="size-5" />
      </Button>

      <div className="hidden min-w-0 items-center gap-1 text-sm text-muted-foreground md:flex">
        <Link href="/admin/dashboard" className="hover:text-foreground">
          Admin
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            <Link href={crumb.href} className="truncate hover:text-foreground">
              {crumb.label}
            </Link>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search poojas, pandits, bookings..."
                className="w-56 pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(e.target.value.trim().length >= 2);
                }}
                onFocus={() => setSearchOpen(searchQuery.trim().length >= 2)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-1.5">
            {isSearching ? (
              <p className="px-2.5 py-2 text-sm text-muted-foreground">Searching…</p>
            ) : searchResults && searchResults.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto">
                {searchResults.map((result, i) => (
                  <li key={`${result.type}-${result.href}-${i}`}>
                    <Link
                      href={result.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
                    >
                      <span className="truncate">{result.label}</span>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {result.type}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2.5 py-2 text-sm text-muted-foreground">No results found.</p>
            )}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" title="Notifications">
              <Bell className="size-4.5" />
              {notificationData && notificationData.unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {notificationData.unreadCount > 9 ? "9+" : notificationData.unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationData && notificationData.items.length > 0 ? (
              notificationData.items.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  onSelect={() => {
                    if (!notification.read) markReadMutation.mutate(notification._id);
                    if (notification.link) router.push(notification.link);
                  }}
                  className="flex flex-col items-start gap-0.5 whitespace-normal"
                >
                  <span className={notification.read ? "text-sm" : "text-sm font-semibold"}>{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.message}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">No notifications yet.</p>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/admin/notifications")}>View all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-tight">{admin?.name ?? "Admin"}</p>
                <p className="text-xs leading-tight text-muted-foreground">{admin?.roleName ?? admin?.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{admin?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-1" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                logout();
                router.replace("/admin/login");
              }}
            >
              <LogOut className="mr-1" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
