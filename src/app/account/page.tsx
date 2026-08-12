"use client";

import Link from "next/link";
import {
  CalendarCheck,
  PackageCheck,
  MessageCircleQuestion,
  ArrowRight,
  ArrowUpRight,
  PhoneCall,
  Heart,
  Sparkles,
  LifeBuoy,
  MapPin,
  Clock3,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useMyDashboard } from "@/features/account/api/use-dashboard";
import { AccountErrorState } from "@/features/account/components/state-blocks";
import { BOOKING_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate } from "@/features/account/lib/format";

const QUICK_ACTIONS = [
  { label: "Book a Pooja", href: "/poojas", icon: CalendarCheck, tone: "from-primary to-primary/70" },
  { label: "Book a Pandit", href: "/pandits", icon: PhoneCall, tone: "from-secondary to-secondary/70" },
  { label: "My Kundli", href: "/account/kundli", icon: Sparkles, tone: "from-accent to-accent/70" },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart, tone: "from-rose-500 to-rose-400" },
  { label: "Support", href: "/account/support", icon: LifeBuoy, tone: "from-sky-500 to-sky-400" },
];

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function AccountDashboardPage() {
  const { customer } = useAuthModal();
  const { data, isLoading, isError, refetch } = useMyDashboard();

  const nextBookingPaid = data?.nextBooking
    ? data.nextBooking.payments.filter((p) => p.status !== "failed").reduce((sum, p) => sum + p.amount, 0)
    : 0;
  const nextBookingBalance = data?.nextBooking
    ? Math.max((data.nextBooking.pricing?.finalAmount ?? 0) - nextBookingPaid, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-secondary px-5 py-7 text-secondary-foreground shadow-sm md:px-8 md:py-9">
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-secondary-foreground/60 uppercase">{greetingForNow()}</p>
            <p className="font-heading mt-1 text-xl font-bold md:text-2xl">Namaste, {customer?.name ?? "Devotee"} 🙏</p>
            <p className="mt-1.5 text-sm text-secondary-foreground/75">Here&apos;s what&apos;s happening with your bookings and services.</p>
          </div>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm ring-1 ring-white/10">
            🪔
          </span>
        </div>
      </div>

      {isLoading && <DashboardSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={CalendarCheck}
              label="Total Bookings"
              value={data.stats.totalBookings}
              href="/account/bookings"
              delay={0}
            />
            <StatCard
              icon={PackageCheck}
              label="Total Orders"
              value={data.stats.totalOrders}
              href="/account/orders"
              delay={60}
            />
            <StatCard
              icon={MessageCircleQuestion}
              label="Consultations"
              value={data.stats.totalConsultations}
              href="/account/consultations"
              delay={120}
            />
          </div>

          {data.nextBooking ? (
            <Card
              className="animate-fade-up overflow-hidden border-0 py-0 shadow-sm ring-1 ring-border transition-shadow duration-300 hover:shadow-md"
              style={{ animationDelay: "160ms" }}
            >
              <div className="flex flex-col gap-5 p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={badgeToneForStatus(data.nextBooking.status)}>
                        {BOOKING_STATUS_LABELS[data.nextBooking.status] ?? data.nextBooking.status}
                      </Badge>
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Upcoming</span>
                    </div>
                    <p className="font-heading mt-2 truncate text-lg font-bold text-secondary md:text-xl">
                      {data.nextBooking.pooja?.name ?? data.nextBooking.festival?.name ?? "Upcoming Pooja"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-primary" />
                        {formatDate(data.nextBooking.poojaDate)}
                        {data.nextBooking.poojaTime ? ` · ${data.nextBooking.poojaTime}` : ""}
                      </span>
                      {data.nextBooking.city && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary" />
                          {data.nextBooking.city}
                        </span>
                      )}
                      {data.nextBooking.pandit && (
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="size-3.5 text-primary" />
                          Pandit {data.nextBooking.pandit.fullName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 rounded-xl bg-muted/60 px-3.5 py-2.5">
                    <Wallet className="size-4 text-primary" />
                    <div className="text-right">
                      <p className="text-[11px] leading-tight text-muted-foreground">
                        {nextBookingBalance > 0 ? "Balance Due" : "Paid in Full"}
                      </p>
                      <p className="font-heading text-sm font-bold text-secondary">
                        {nextBookingBalance > 0 ? formatCurrency(nextBookingBalance) : formatCurrency(nextBookingPaid)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button asChild className="font-ui font-bold">
                    <Link href={`/account/bookings/${data.nextBooking._id}`}>
                      View Booking <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="font-ui font-bold">
                    <Link href="/account/support">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card
              className="animate-fade-up border-dashed shadow-none"
              style={{ animationDelay: "160ms" }}
            >
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarCheck className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-secondary">No upcoming Puja booking yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Book a pooja and we&apos;ll show it right here.</p>
                </div>
                <Button asChild className="mt-1 font-ui font-bold">
                  <Link href="/poojas">Explore Poojas</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="animate-fade-up" style={{ animationDelay: "220ms" }}>
            <p className="mb-3 font-heading text-sm font-bold text-secondary">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {QUICK_ACTIONS.map((action, index) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group animate-fade-up flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md active:translate-y-0 active:shadow-sm"
                  style={{ animationDelay: `${240 + index * 40}ms` }}
                >
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.tone} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}
                  >
                    <action.icon className="size-4.5" />
                  </span>
                  <span className="text-xs font-medium text-secondary">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "280ms" }}>
            <p className="mb-3 font-heading text-sm font-bold text-secondary">Recent Activity</p>
            <div className="space-y-2">
              {data.recentActivity.recentBooking && (
                <ActivityRow
                  icon={CalendarCheck}
                  label={data.recentActivity.recentBooking.pooja?.name ?? data.recentActivity.recentBooking.festival?.name ?? "Pooja Booking"}
                  sub={`${BOOKING_STATUS_LABELS[data.recentActivity.recentBooking.status] ?? data.recentActivity.recentBooking.status} · ${formatDate(data.recentActivity.recentBooking.createdAt)}`}
                  href={`/account/bookings/${data.recentActivity.recentBooking._id}`}
                />
              )}
              {data.recentActivity.recentOrder && (
                <ActivityRow
                  icon={PackageCheck}
                  label={`Order ${data.recentActivity.recentOrder.orderId}`}
                  sub={`${formatCurrency(data.recentActivity.recentOrder.total)} · ${formatDate(data.recentActivity.recentOrder.createdAt)}`}
                  href={`/account/orders/${data.recentActivity.recentOrder._id}`}
                />
              )}
              {data.recentActivity.recentConsultation && (
                <ActivityRow
                  icon={MessageCircleQuestion}
                  label="Astrology Consultation"
                  sub={formatDate(data.recentActivity.recentConsultation.createdAt)}
                  href={`/account/consultations/${data.recentActivity.recentConsultation._id}`}
                />
              )}
              {!data.recentActivity.recentBooking && !data.recentActivity.recentOrder && !data.recentActivity.recentConsultation && (
                <div className="rounded-2xl border border-dashed border-border bg-card py-10 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  delay,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: number;
  href: string;
  delay: number;
}) {
  return (
    <Link href={href} className="group animate-fade-up block" style={{ animationDelay: `${delay}ms` }}>
      <Card className="border-0 shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold text-secondary tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityRow({ icon: Icon, label, sub, href }: { icon: typeof CalendarCheck; label: string; sub: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:translate-x-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-secondary">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[76px] w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[168px] w-full rounded-xl" />
      <div>
        <Skeleton className="mb-3 h-4 w-28 rounded-md" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[96px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-4 w-32 rounded-md" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[60px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
