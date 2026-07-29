import type { Metadata } from "next";
import { RequireCustomerAuth } from "@/features/account/components/require-customer-auth";
import { AccountShell } from "@/features/account/components/account-shell";

// Private account pages — never indexed, regardless of the root layout's defaults.
export const metadata: Metadata = {
  title: "My Account | PujariDekho",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireCustomerAuth>
      <AccountShell>{children}</AccountShell>
    </RequireCustomerAuth>
  );
}
