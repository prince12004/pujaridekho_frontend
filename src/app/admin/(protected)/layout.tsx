"use client";

import { RequireAdminAuth } from "@/features/admin/auth/require-admin-auth";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdminAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAdminAuth>
  );
}
