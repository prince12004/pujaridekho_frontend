"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import { useAdminAuth } from "@/features/admin/auth/admin-auth-context";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const sessionExpired = searchParams.get("session") === "expired";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.replace("/admin/dashboard");
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid email or password";
      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-cocoa-deep via-brand-cocoa to-brand-cocoa-deep p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] bg-card shadow-2xl ring-1 ring-white/10 md:grid-cols-2"
      >
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6">
            <LogoMark className="h-9 w-auto" />
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin Panel</p>
          </div>

          <h1 className="font-heading text-2xl font-bold text-secondary">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to access the admin dashboard.</p>

          {sessionExpired && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Your session has expired. Please sign in again.
            </p>
          )}
          {serverError && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" autoComplete="username" placeholder="admin@pujaridekho.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-ui font-bold">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Sign In to Dashboard
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            For security purposes, only authorized administrators can access this panel.
          </p>
        </div>

        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-accent to-primary p-10 text-center text-primary-foreground md:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1.4px, transparent 1.6px)",
              backgroundSize: "22px 22px",
            }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative flex size-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
          >
            <Sparkles size={36} />
          </motion.div>
          <h2 className="relative mt-6 font-heading text-2xl font-bold">Welcome Back!</h2>
          <p className="relative mt-3 max-w-xs text-sm text-white/85">
            Manage pandits, bookings and services from your secure admin dashboard.
          </p>
          <div className="relative mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
            <ShieldCheck size={14} /> Your session is protected with role-based access control
          </div>
        </div>
      </motion.div>
    </div>
  );
}
