"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-sidebar-border transition-[width] duration-150 md:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="fixed inset-y-0 left-0 z-30 h-screen w-64 transition-[width] duration-150" style={{ width: collapsed ? "4rem" : "16rem" }}>
          <AdminSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
        </div>
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar collapsed={false} onToggleCollapsed={() => {}} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
