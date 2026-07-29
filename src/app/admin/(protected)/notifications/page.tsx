"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CalendarCheck, Loader2, MessageCircleQuestion, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/features/admin/api/use-notifications";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  booking: CalendarCheck,
  consultation: MessageCircleQuestion,
  order: PackageCheck,
  pandit_application: MessageCircleQuestion,
} as const;

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(page);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        description="Live events from the public website — new bookings, consultations and orders."
        actions={
          data && data.unreadCount > 0 ? (
            <Button variant="outline" onClick={() => markAllReadMutation.mutate()} disabled={markAllReadMutation.isPending}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="space-y-2">
            {data.items.map((notification) => {
              const Icon = TYPE_ICONS[notification.type] ?? Bell;
              const content = (
                <div
                  className={cn(
                    "flex items-start gap-3 mb-2 rounded-xl border px-4 py-3 transition-colors",
                    notification.read ? "border-border bg-card" : "border-primary/30 bg-primary/5",
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {new Date(notification.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        markReadMutation.mutate(notification._id);
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              );
              return notification.link ? (
                <Link key={notification._id} href={notification.link} onClick={() => !notification.read && markReadMutation.mutate(notification._id)}>
                  {content}
                </Link>
              ) : (
                <div key={notification._id}>{content}</div>
              );
            })}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Bell className="size-8 text-muted-foreground" />
            <p className="font-medium text-foreground">No notifications yet</p>
            <p className="max-w-md text-sm text-muted-foreground">
              New bookings, consultations and orders placed by customers will show up here in real time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
