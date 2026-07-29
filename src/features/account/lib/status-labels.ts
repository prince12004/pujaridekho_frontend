export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  payment_received: "Payment Received",
  booking_confirmed: "Booking Confirmed",
  pandit_assignment_pending: "Pandit Assignment Pending",
  pandit_assigned: "Pandit Assigned",
  pandit_accepted: "Pandit Accepted",
  pandit_on_the_way: "Pandit On The Way",
  pooja_started: "Pooja Started",
  pooja_completed: "Pooja Completed",
  closed: "Closed",
  cancelled: "Cancelled",
  refund_requested: "Refund Requested",
  refunded: "Refunded",
  rescheduled: "Rescheduled",
};

export const BOOKING_TIMELINE_ORDER = [
  "pending_payment",
  "payment_received",
  "booking_confirmed",
  "pandit_assignment_pending",
  "pandit_assigned",
  "pandit_accepted",
  "pandit_on_the_way",
  "pooja_started",
  "pooja_completed",
  "closed",
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const CONSULTATION_STATUS_LABELS: Record<string, string> = {
  new: "Requested",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function badgeToneForStatus(status: string): "default" | "outline" | "secondary" | "destructive" {
  if (["pooja_completed", "closed", "delivered", "completed", "payment_received", "booking_confirmed"].includes(status)) return "default";
  if (["cancelled", "refunded", "refund_requested", "returned"].includes(status)) return "destructive";
  if (["pending_payment", "pending", "new"].includes(status)) return "outline";
  return "secondary";
}
