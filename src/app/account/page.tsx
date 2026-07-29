"use client";

import Link from "next/link";
import {
  CalendarCheck,
  PackageCheck,
  MessageCircleQuestion,
  ArrowRight,
  PhoneCall,
  Heart,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useMyDashboard } from "@/features/account/api/use-dashboard";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { BOOKING_STATUS_LABELS, badgeToneForStatus } from "@/features/account/lib/status-labels";
import { formatCurrency, formatDate } from "@/features/account/lib/format";

const QUICK_ACTIONS = [
  { label: "Book a Pooja", href: "/poojas", icon: CalendarCheck },
  { label: "Book a Pandit", href: "/pandits", icon: PhoneCall },
  { label: "My Kundli", href: "/account/kundli", icon: Sparkles },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Support", href: "/account/support", icon: LifeBuoy },
];

export default function AccountDashboardPage() {
  const { customer } = useAuthModal();
  const { data, isLoading, isError, refetch } = useMyDashboard();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-secondary px-5 py-6 text-secondary-foreground md:px-8 md:py-8">
        <p className="font-heading text-xl font-bold md:text-2xl">Namaste, {customer?.name ?? "Devotee"} 🙏</p>
        <p className="mt-1 text-sm text-secondary-foreground/80">
          Here&apos;s what&apos;s happening with your bookings and services.
        </p>
      </div>

      {isLoading && <AccountLoadingSkeleton rows={2} />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={CalendarCheck} label="Total Bookings" value={data.stats.totalBookings} href="/account/bookings" />
            <StatCard icon={PackageCheck} label="Total Orders" value={data.stats.totalOrders} href="/account/orders" />
            <StatCard icon={MessageCircleQuestion} label="Consultations" value={data.stats.totalConsultations} href="/account/consultations" />
          </div>

          {data.nextBooking ? (
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <Badge variant={badgeToneForStatus(data.nextBooking.status)} className="mb-2">
                    {BOOKING_STATUS_LABELS[data.nextBooking.status] ?? data.nextBooking.status}
                  </Badge>
                  <p className="font-heading text-lg font-bold text-secondary">
                    {data.nextBooking.pooja?.name ?? data.nextBooking.festival?.name ?? "Upcoming Pooja"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(data.nextBooking.poojaDate)}
                    {data.nextBooking.poojaTime ? ` · ${data.nextBooking.poojaTime}` : ""}
                    {data.nextBooking.city ? ` · ${data.nextBooking.city}` : ""}
                  </p>
                  {data.nextBooking.pandit && <p className="mt-1 text-sm text-muted-foreground">Pandit: {data.nextBooking.pandit.fullName}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="font-ui font-bold">
                    <Link href={`/account/bookings/${data.nextBooking._id}`}>View Booking</Link>
                  </Button>
                  <Button asChild variant="outline" className="font-ui font-bold">
                    <Link href={`/account/bookings/${data.nextBooking._id}`}>Track Status</Link>
                  </Button>
                  <Button asChild variant="ghost" className="font-ui font-bold">
                    <Link href="/account/support">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-sm text-muted-foreground">No upcoming Puja booking yet.</p>
                <Button asChild className="font-ui font-bold">
                  <Link href="/poojas">Explore Poojas</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div>
            <p className="mb-3 font-heading text-sm font-bold text-secondary">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <action.icon className="size-4.5" />
                  </span>
                  <span className="text-xs font-medium text-secondary">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
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
                <p className="rounded-2xl border border-dashed border-border bg-card py-8 text-center text-sm text-muted-foreground">
                  No recent activity yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, href }: { icon: typeof CalendarCheck; label: string; value: number; href: string }) {
  return (
    <Link href={href}>
      <Card className="transition hover:border-primary/40">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-heading text-2xl font-bold text-secondary">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityRow({ icon: Icon, label, sub, href }: { icon: typeof CalendarCheck; label: string; sub: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/40"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-secondary">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
