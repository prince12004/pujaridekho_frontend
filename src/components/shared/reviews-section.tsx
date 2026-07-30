"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewCard } from "@/components/shared/review-card";
import { type ReviewEntityType, usePublicReviews, useSubmitPublicReview } from "@/features/reviews/use-public-reviews";
import { getErrorMessage } from "@/lib/get-error-message";

export function ReviewsSection({ entityType, entityId }: { entityType: ReviewEntityType; entityId: string }) {
  const { data: reviews, isLoading } = usePublicReviews(entityType, entityId);
  const submitMutation = useSubmitPublicReview();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !comment.trim()) {
      toast.error("Please enter your name and a short review");
      return;
    }
    try {
      await submitMutation.mutateAsync({ entityType, entityId, customerName: name, rating, comment });
      toast.success("Thank you! Your review will appear once approved by our team.");
      setOpen(false);
      setName("");
      setRating(5);
      setComment("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit your review"));
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl">Reviews</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="font-ui font-bold">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Your review is Published after our team reviews it.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Your Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
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
      </div>

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
