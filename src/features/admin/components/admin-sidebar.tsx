"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/features/admin/nav-config";
import { useAdminAuth } from "@/features/admin/auth/admin-auth-context";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/layout/logo";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapsed, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAdminAuth();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-20 items-center gap-2 border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <LogoMark light className="h-6 w-auto" />
        ) : (
          <div className="min-w-0">
            <Link href="/admin/dashboard">
            <LogoMark light className="h-7 w-35" />
            </Link>
            
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {ADMIN_NAV.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-2 text-[11px] font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                if (item.permission && !hasPermission(item.permission) && !item.comingSoon) return null;
                const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.comingSoon && (
                        <Badge variant="outline" className="ml-auto shrink-0 border-sidebar-foreground/20 text-[10px] text-sidebar-foreground/50">
                          Soon
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        onClick={onToggleCollapsed}
        className="hidden items-center justify-center gap-2 border-t border-sidebar-border py-3 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground md:flex"
      >
        {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        {!collapsed && "Collapse"}
      </button>
    </div>
  );
}
