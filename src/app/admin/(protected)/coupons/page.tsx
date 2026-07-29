"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { Coupon, useCoupons, useCreateCoupon, useDeleteCoupon, useUpdateCoupon } from "@/features/admin/api/use-coupons";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["percentage", "flat"]),
  value: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  status: z.enum(["active", "inactive"]),
});

export default function CouponsPage() {
  const { data: coupons, isLoading } = useCoupons();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof couponSchema>, unknown, z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "", type: "percentage", value: 10, status: "active" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ code: "", type: "percentage", value: 10, status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      status: coupon.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof couponSchema>) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
        toast.success("Coupon updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Coupon created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Coupon deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Create and manage discount coupons for orders and bookings."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Coupon
          </Button>
        }
      />

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
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No coupons yet.
                    </TableCell>
                  </TableRow>
                )}
                {coupons?.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{coupon.type}</TableCell>
                    <TableCell>{coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.status === "active" ? "default" : "outline"}>{coupon.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(coupon)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(coupon._id, coupon.code)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input {...register("code")} className="uppercase" />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select {...register("type")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input type="number" {...register("value")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Min order value (₹)</Label>
                <Input type="number" {...register("minOrderValue")} />
              </div>
              <div className="space-y-1.5">
                <Label>Max discount (₹)</Label>
                <Input type="number" {...register("maxDiscount")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Usage limit</Label>
                <Input type="number" {...register("usageLimit")} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select {...register("status")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
