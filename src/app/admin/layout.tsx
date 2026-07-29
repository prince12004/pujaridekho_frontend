import type { Metadata } from "next";
import { AdminAuthProvider } from "@/features/admin/auth/admin-auth-context";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | PujariDekho Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
