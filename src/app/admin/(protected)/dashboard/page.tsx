"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, IndianRupee, Loader2, UserSquare2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDashboardStats } from "@/features/admin/api/use-dashboard-stats";
import { BOOKING_STATUS_LABELS } from "@/features/admin/lib/booking-status";

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-secondary dark:text-brand-gold-soft">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4.5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load dashboard stats. Is the API running?</p>;
  }

  const { stats } = data;
  const chartData = [
    { name: "Bookings", value: stats.totalBookings },
    { name: "Active", value: stats.activeBookings },
    { name: "Completed", value: stats.completedBookings },
    { name: "Customers", value: stats.totalCustomers },
    { name: "Pandits", value: stats.totalPandits },
    { name: "Verified", value: stats.verifiedPandits },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Live overview of bookings, pandits, and revenue." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} hint={`${stats.activeBookings} active`} delay={0} />
        <StatCard
          label="Revenue Collected"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          hint="Sum of successful payments"
          delay={0.05}
        />
        <StatCard label="Customers" value={stats.totalCustomers} icon={Users} delay={0.1} />
        <StatCard
          label="Pandits"
          value={stats.totalPandits}
          icon={UserSquare2}
          hint={`${stats.verifiedPandits} verified · ${stats.pendingApplications} applications pending`}
          delay={0.15}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform snapshot</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/admin/bookings/offline/new" className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
              + Create offline booking
            </Link>
            <Link href="/admin/poojas/new" className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
              + Add new pooja
            </Link>
            <Link href="/admin/pandits/new" className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
              + Add new pandit
            </Link>
            <Link href="/admin/pandit-applications" className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
              Review pandit applications ({stats.pendingApplications})
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.28 }}
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentBookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
            {data.recentBookings.map((booking) => (
              <Link
                key={booking._id}
                href={`/admin/bookings/${booking._id}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div>
                  <p className="text-sm font-medium">{booking.bookingId}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.customerSnapshot?.name} · {booking.pooja?.name ?? booking.festival?.name ?? booking.status}
                  </p>
                </div>
                <Badge variant="outline">{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentAuditLogs.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
            {data.recentAuditLogs.map((log) => (
              <div key={log._id} className="rounded-lg border border-border px-3 py-2">
                <p className="text-sm">{log.description}</p>
                <p className="text-xs text-muted-foreground">
                  {log.adminName} · {new Date(log.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
