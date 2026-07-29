"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { createQueryClient } from "@/lib/query-client";
import { AuthModalProvider } from "@/providers/auth-modal-provider";
import { CartProvider } from "@/features/cart/cart-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthModalProvider>
          <CartProvider>{children}</CartProvider>
        </AuthModalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
