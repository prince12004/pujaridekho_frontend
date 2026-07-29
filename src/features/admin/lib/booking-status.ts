export const BOOKING_STATUSES = [
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
  "cancelled",
  "refund_requested",
  "refunded",
  "rescheduled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

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

export const BOOKING_SERVICE_TYPES = ["pooja", "pandit", "festival", "consultation", "other"] as const;
export const BOOKING_SOURCES = [
  "website",
  "phone",
  "whatsapp",
  "walk_in",
  "admin",
  "referral",
  "repeat_customer",
  "other",
] as const;
export const PAYMENT_METHODS = ["razorpay", "cash", "upi", "bank_transfer", "card", "other"] as const;
