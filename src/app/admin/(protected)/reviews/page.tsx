"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteReview, useReviews, useUpdateReviewStatus } from "@/features/admin/api/use-reviews";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const STATUS_OPTIONS = ["pending", "approved", "rejected"] as const;

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: reviews, isLoading } = useReviews(statusFilter || undefined);
  const updateStatus = useUpdateReviewStatus();
  const deleteMutation = useDeleteReview();

  const onStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Review updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Review deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Moderate customer reviews submitted on poojas, pandits and products." />

      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No reviews yet.
                    </TableCell>
                  </TableRow>
                )}
                {reviews?.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell className="font-medium">{review.customerName}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{review.entityType}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-brand-gold text-brand-gold" /> {review.rating}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{review.comment}</TableCell>
                    <TableCell>
                      <select
                        value={review.status}
                        onChange={(e) => onStatusChange(review._id, e.target.value)}
                        className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(review._id)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
