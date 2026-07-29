"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AccountSidebar } from "./account-sidebar";
import { AccountHeader } from "./account-header";
import { AccountMobileBottomNav } from "./account-mobile-bottom-nav";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AccountShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={cn("flex min-h-screen bg-muted")}>
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <div className="fixed inset-y-0 left-0 z-30 h-screen w-64">
          <AccountSidebar />
        </div>
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AccountSidebar onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AccountHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      <AccountMobileBottomNav />
    </div>
  );
}
