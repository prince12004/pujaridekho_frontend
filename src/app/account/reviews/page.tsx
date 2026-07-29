"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { type SubmitReviewInput, useMyReviews, useSubmitReview } from "@/features/account/api/use-reviews";
import { useMyBookings } from "@/features/account/api/use-bookings";
import { useMyOrders } from "@/features/account/api/use-orders";
import { useMyConsultations } from "@/features/account/api/use-consultations";
import { getErrorMessage } from "@/features/account/lib/get-error-message";
import { formatDate } from "@/features/account/lib/format";

interface EligibleItem {
  key: string;
  title: string;
  subtitle: string;
  input: SubmitReviewInput;
}

export default function ReviewsPage() {
  const { data: reviews, isLoading: reviewsLoading, isError: reviewsError, refetch: refetchReviews } = useMyReviews();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings("completed");
  const { data: orders, isLoading: ordersLoading } = useMyOrders("delivered");
  const { data: consultations, isLoading: consultationsLoading } = useMyConsultations("completed");
  const submitMutation = useSubmitReview();

  const [target, setTarget] = useState<EligibleItem | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isLoading = reviewsLoading || bookingsLoading || ordersLoading || consultationsLoading;

  const reviewedKeys = new Set(
    (reviews ?? []).map((r) =>
      r.entityType === "product" ? `product:${r.order}:${r.entityId}` : r.entityType === "consultation" ? `consultation:${r.entityId}` : `${r.entityType}:${r.booking}`,
    ),
  );

  const eligible: EligibleItem[] = [];
  for (const booking of bookings?.items ?? []) {
    const poojaId = booking.pooja?._id ?? booking.festival?._id;
    if (poojaId) {
      const key = `pooja:${booking._id}`;
      if (!reviewedKeys.has(key)) {
        eligible.push({
          key,
          title: `Rate: ${booking.pooja?.name ?? booking.festival?.name}`,
          subtitle: `Completed on ${formatDate(booking.poojaDate)}`,
          input: { entityType: "pooja", entityId: poojaId, bookingId: booking._id, rating: 5, comment: "" },
        });
      }
    }
    if (booking.pandit) {
      const key = `pandit:${booking._id}`;
      if (!reviewedKeys.has(key)) {
        eligible.push({
          key,
          title: `Rate Pandit: ${booking.pandit.fullName}`,
          subtitle: `Service on ${formatDate(booking.poojaDate)}`,
          input: { entityType: "pandit", entityId: booking.pandit._id, bookingId: booking._id, rating: 5, comment: "" },
        });
      }
    }
  }
  for (const order of orders?.items ?? []) {
    for (const item of order.items) {
      const productId = item.product?._id;
      if (!productId) continue;
      const key = `product:${order._id}:${productId}`;
      if (!reviewedKeys.has(key)) {
        eligible.push({
          key,
          title: `Rate: ${item.name}`,
          subtitle: `Delivered order #${order.orderId}`,
          input: { entityType: "product", entityId: productId, orderId: order._id, rating: 5, comment: "" },
        });
      }
    }
  }
  for (const consultation of consultations?.items ?? []) {
    const key = `consultation:${consultation._id}`;
    if (!reviewedKeys.has(key)) {
      eligible.push({
        key,
        title: "Rate this Consultation",
        subtitle: formatDate(consultation.createdAt),
        input: { entityType: "consultation", consultationId: consultation._id, entityId: consultation._id, rating: 5, comment: "" },
      });
    }
  }

  function openReviewDialog(item: EligibleItem) {
    setTarget(item);
    setRating(5);
    setComment("");
  }

  async function handleSubmit() {
    if (!target) return;
    if (!comment.trim()) {
      toast.error("Please write a short comment");
      return;
    }
    try {
      await submitMutation.mutateAsync({ ...target.input, rating, comment });
      toast.success("Review submitted — it will appear once approved");
      setTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit review"));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <AccountPageHeader title="Reviews" description="Rate completed Poojas, Pandits, Products and Consultations." />

        {isLoading && <AccountLoadingSkeleton />}

        {!isLoading && eligible.length === 0 && reviews && reviews.length === 0 && (
          <AccountEmptyState icon={Star} title="Nothing to review yet." description="Complete a Pooja, order or consultation to leave a review." />
        )}

        {!isLoading && eligible.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {eligible.map((item) => (
              <Card key={item.key}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium text-secondary">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <Button size="sm" className="font-ui font-bold" onClick={() => openReviewDialog(item)}>
                    Write Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {reviewsError && <AccountErrorState onRetry={() => refetchReviews()} />}

      {reviews && reviews.length > 0 && (
        <div>
          <p className="mb-3 font-heading text-sm font-bold text-secondary">Your Reviews</p>
          <div className="space-y-2">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="space-y-1 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <Badge variant={review.status === "approved" ? "default" : review.status === "rejected" ? "destructive" : "outline"} className="capitalize">
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-secondary">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{target?.title}</DialogTitle>
            <DialogDescription>Your review will be visible publicly once approved by our team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`Rate ${i + 1} stars`}>
                  <Star className={`size-6 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="font-ui font-bold">
              {submitMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
