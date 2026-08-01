"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReviewCard } from "@/components/shared/review-card";
import { type ReviewEntityType, usePublicReviews } from "@/features/reviews/use-public-reviews";
import { useMyBookings } from "@/features/account/api/use-bookings";
import { useMyReviews, useSubmitReview } from "@/features/account/api/use-reviews";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { getErrorMessage } from "@/lib/get-error-message";

// Poojas and festivals are both booking-backed and share the account-reviews
// API's "pooja" entity type (there's no separate "festival" type there) —
// pandit reviews are booking-backed too, just matched on booking.pandit.
function toBookingEntityType(entityType: ReviewEntityType): "pooja" | "pandit" | null {
  if (entityType === "pooja" || entityType === "festival") return "pooja";
  if (entityType === "pandit") return "pandit";
  return null;
}

export function ReviewsSection({ entityType, entityId }: { entityType: ReviewEntityType; entityId: string }) {
  const { data: reviews, isLoading } = usePublicReviews(entityType, entityId);
  const { isLoggedIn, openLogin } = useAuthModal();

  const bookingEntityType = toBookingEntityType(entityType);
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings("completed", 1, { enabled: isLoggedIn && !!bookingEntityType });
  const { data: myReviews } = useMyReviews({ enabled: isLoggedIn && !!bookingEntityType });
  const submitMutation = useSubmitReview();

  const matchingBooking = bookings?.items.find((b) =>
    bookingEntityType === "pandit" ? b.pandit?._id === entityId : b.pooja?._id === entityId || b.festival?._id === entityId,
  );
  const alreadyReviewed =
    !!matchingBooking && (myReviews ?? []).some((r) => r.entityType === bookingEntityType && r.booking === matchingBooking._id);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function handleSubmit() {
    if (!bookingEntityType || !matchingBooking) return;
    if (!comment.trim()) {
      toast.error("Please write a short review");
      return;
    }
    try {
      await submitMutation.mutateAsync({ entityType: bookingEntityType, entityId, bookingId: matchingBooking._id, rating, comment });
      toast.success("Thank you! Your review will appear once approved by our team.");
      setOpen(false);
      setRating(5);
      setComment("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit your review"));
    }
  }

  function handleWriteReviewClick() {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    if (matchingBooking && !alreadyReviewed) setOpen(true);
  }

  const buttonDisabled = isLoggedIn && (bookingsLoading || !matchingBooking || alreadyReviewed);
  const buttonLabel = !isLoggedIn ? "Login to Write a Review" : alreadyReviewed ? "Already Reviewed" : "Write a Review";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl">Reviews</h2>
        <Button
          type="button"
          variant="outline"
          className="font-ui font-bold"
          disabled={buttonDisabled}
          onClick={handleWriteReviewClick}
        >
          {buttonLabel}
        </Button>
      </div>
      {isLoggedIn && !bookingsLoading && !matchingBooking && (
        <p className="mb-5 text-xs text-muted-foreground">You can write a review once your booking for this is completed.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Your review is published after our team reviews it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`Rate ${i + 1} stars`}>
                    <Star className={`size-6 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Your Review</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="font-ui font-bold">
              {submitMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && <p className="text-sm text-muted-foreground">Loading reviews...</p>}

      {!isLoading && reviews && reviews.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No reviews yet — be the first to share your experience.
        </p>
      )}

      {!isLoading && reviews && reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              name={review.customerName}
              subtitle={new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              rating={review.rating}
              quote={review.comment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
