"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useReportsOverview } from "@/features/admin/api/use-reports";
import { BOOKING_STATUS_LABELS } from "@/features/admin/lib/booking-status";

function mergeByMonth(a: { _id: string; total: number }[], b: { _id: string; total: number }[]) {
  const map = new Map<string, { month: string; bookings: number; orders: number }>();
  for (const row of a) map.set(row._id, { month: row._id, bookings: row.total, orders: map.get(row._id)?.orders ?? 0 });
  for (const row of b) {
    const existing = map.get(row._id);
    map.set(row._id, { month: row._id, bookings: existing?.bookings ?? 0, orders: row.total });
  }
  return Array.from(map.values()).sort((x, y) => x.month.localeCompare(y.month));
}

export default function ReportsPage() {
  const { data, isLoading, isError } = useReportsOverview();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load reports. Is the API running?</p>;
  }

  const revenueByMonth = mergeByMonth(data.bookingRevenueByMonth, data.orderRevenueByMonth);
  const bookingsByStatus = data.bookingsByStatus.map((row) => ({
    status: BOOKING_STATUS_LABELS[row._id as keyof typeof BOOKING_STATUS_LABELS] ?? row._id,
    count: row.count,
  }));
  const ordersByStatus = data.ordersByStatus.map((row) => ({ status: row._id, count: row.count }));

  return (
    <div>
      <AdminPageHeader title="Reports" description="Real-time booking, order and revenue reports computed from live data." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
            <p className="mt-1 font-heading text-2xl font-bold text-secondary dark:text-brand-gold-soft">{data.totals.totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
            <p className="mt-1 font-heading text-2xl font-bold text-secondary dark:text-brand-gold-soft">{data.totals.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground">Total Customers</p>
            <p className="mt-1 font-heading text-2xl font-bold text-secondary dark:text-brand-gold-soft">{data.totals.totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue — Last 12 Months (Bookings vs Orders)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="var(--color-primary)" strokeWidth={2} name="Booking Revenue" />
              <Line type="monotone" dataKey="orders" stroke="var(--color-accent)" strokeWidth={2} name="Order Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByStatus} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={140} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByStatus} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Poojas by Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.topPoojas.length === 0 && <p className="text-sm text-muted-foreground">No booking data yet.</p>}
            {data.topPoojas.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span>{row.name}</span>
                <span className="font-semibold text-primary">{row.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.topProducts.length === 0 && <p className="text-sm text-muted-foreground">No order data yet.</p>}
            {data.topProducts.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span>{row.name}</span>
                <span className="font-semibold text-primary">{row.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
