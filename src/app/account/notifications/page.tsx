"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Bell, PackageCheck, CalendarCheck, MessageCircleQuestion, Tag, Info, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import {
  type CustomerNotificationType,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/features/account/api/use-notifications";
import { formatDateTime } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const ICON_BY_TYPE: Record<CustomerNotificationType, typeof Bell> = {
  booking: CalendarCheck,
  payment: Tag,
  pandit_assignment: ShieldCheck,
  booking_reminder: CalendarCheck,
  order: PackageCheck,
  consultation: MessageCircleQuestion,
  offer: Tag,
  system: Info,
};

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useMyNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  async function handleMarkAllRead() {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not mark notifications as read"));
    }
  }

  return (
    <div>
      <AccountPageHeader
        title="Notifications"
        description={data && data.unreadCount > 0 ? `${data.unreadCount} unread` : "You're all caught up."}
        actions={
          data && data.unreadCount > 0 ? (
            <Button variant="outline" size="sm" className="font-ui font-bold" onClick={handleMarkAllRead} disabled={markAllReadMutation.isPending}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <AccountEmptyState icon={Bell} title="No notifications yet." description="We'll notify you about bookings, payments and offers here." />
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-2">
          {data.items.map((notification) => {
            const Icon = ICON_BY_TYPE[notification.type] ?? Bell;
            const content = (
              <Card key={notification._id} className={notification.read ? "" : "border-primary/30 bg-primary/5  mb-2 "}>
                <CardContent
                  className="flex cursor-pointer items-start gap-3 p-4"
                  onClick={() => !notification.read && markReadMutation.mutate(notification._id)}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-secondary">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(notification.createdAt)}</p>
                  </div>
                  {!notification.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
                </CardContent>
              </Card>
            );
            return notification.link ? (
              <Link key={notification._id} href={notification.link}>
                {content}
              </Link>
            ) : (
              content
            );
          })}
        </div>
      )}
    </div>
  );
}
