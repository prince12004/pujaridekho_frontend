"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DatePicker } from "@/components/shared/date-picker";
import { TimePicker } from "@/components/shared/time-picker";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  useAddBookingNote,
  useAddBookingPayment,
  useAssignPandit,
  useBooking,
  useUpdateBookingDetails,
  useUpdateBookingStatus,
} from "@/features/admin/api/use-bookings";
import { usePandits } from "@/features/admin/api/use-pandits";
import { useMuhurat } from "@/features/admin/api/use-muhurats";
import { BOOKING_STATUS_LABELS, BOOKING_STATUSES, PAYMENT_METHODS } from "@/features/admin/lib/booking-status";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const CONFIRMABLE_STATUSES = ["pending_payment", "payment_received"];

interface EditFormValues {
  poojaDate: string;
  poojaTime: string;
  address: string;
  city: string;
  landmark: string;
  pincode: string;
  gotra: string;
  specialInstructions: string;
  packagePrice: number;
  marketPrice: number;
  discount: number;
  finalAmount: number;
  advanceAmount: number;
}

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: booking, isLoading } = useBooking(params.id);
  const { data: pandits } = usePandits({ verificationStatus: "verified" });
  const { data: muhurat } = useMuhurat(booking?.muhuratSlot?.muhurat);
  const updateStatus = useUpdateBookingStatus();
  const updateDetails = useUpdateBookingDetails();
  const assignPandit = useAssignPandit();
  const addPayment = useAddBookingPayment();
  const addNote = useAddBookingNote();

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [noteText, setNoteText] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    watch: watchEdit,
    setValue: setEditValue,
    formState: { isSubmitting: isSavingEdit },
  } = useForm<EditFormValues>();

  if (isLoading || !booking) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const serviceName = booking.pooja?.name ?? booking.festival?.name ?? "—";

  const openEdit = () => {
    resetEdit({
      poojaDate: booking.poojaDate?.slice(0, 10) ?? "",
      poojaTime: booking.poojaTime ?? "",
      address: booking.address ?? "",
      city: booking.city ?? "",
      landmark: booking.landmark ?? "",
      pincode: booking.pincode ?? "",
      gotra: booking.gotra ?? "",
      specialInstructions: booking.specialInstructions ?? "",
      packagePrice: Number(booking.pricing?.packagePrice ?? 0),
      marketPrice: Number(booking.pricing?.marketPrice ?? 0),
      discount: Number(booking.pricing?.discount ?? 0),
      finalAmount: Number(booking.pricing?.finalAmount ?? 0),
      advanceAmount: Number(booking.pricing?.advanceAmount ?? 0),
    });
    setEditOpen(true);
  };

  const onSaveEdit = async (values: EditFormValues) => {
    try {
      await updateDetails.mutateAsync({
        id: booking._id,
        input: {
          poojaDate: values.poojaDate,
          poojaTime: values.poojaTime,
          address: values.address,
          city: values.city,
          landmark: values.landmark,
          pincode: values.pincode,
          gotra: values.gotra,
          specialInstructions: values.specialInstructions,
          pricing: {
            packagePrice: values.packagePrice,
            marketPrice: values.marketPrice || undefined,
            discount: values.discount,
            finalAmount: values.finalAmount,
            advanceAmount: values.advanceAmount,
            remainingAmount: Math.max(values.finalAmount - values.advanceAmount, 0),
          },
        },
      });
      toast.success("Booking updated");
      setEditOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onConfirmBooking = async () => {
    try {
      await updateStatus.mutateAsync({ id: booking._id, status: "booking_confirmed" });
      toast.success("Booking confirmed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: booking._id, status });
      toast.success("Status updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onAssignPandit = async (panditId: string) => {
    if (!panditId) return;
    try {
      await assignPandit.mutateAsync({ id: booking._id, panditId });
      toast.success("Pandit assigned");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onAddPayment = async () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    try {
      await addPayment.mutateAsync({ id: booking._id, input: { amount, method: paymentMethod, status: "success" } });
      toast.success("Payment recorded");
      setPaymentAmount("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({ id: booking._id, note: noteText.trim() });
      toast.success("Note added");
      setNoteText("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const finalAmount = Number(booking.pricing?.finalAmount ?? 0);
  const marketPrice = Number(booking.pricing?.marketPrice ?? 0);
  const totalPaid = booking.payments.filter((p) => p.status !== "failed").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <AdminPageHeader
        title={booking.bookingId}
        description={`${booking.serviceType} booking · ${booking.bookingChannel} · via ${booking.bookingSource}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</Badge>
            {CONFIRMABLE_STATUSES.includes(booking.status) && (
              <Button size="sm" onClick={onConfirmBooking} disabled={updateStatus.isPending}>
                <CheckCircle2 /> Confirm Booking
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={openEdit}>
              <Pencil /> Edit Booking
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Booking ID</p>
                <p className="font-medium">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service Type</p>
                <p className="font-medium capitalize">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Channel</p>
                <p className="font-medium capitalize">{booking.bookingChannel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="font-medium capitalize">{booking.bookingSource.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(booking.createdAt).toLocaleString("en-IN")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customerSnapshot?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="font-medium">{booking.customerSnapshot?.mobile}</p>
              </div>
              {booking.customerSnapshot?.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.customerSnapshot.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pooja Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">{booking.festival ? "Festival Pooja" : "Pooja"}</p>
                  <p className="font-medium">{serviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(booking.poojaDate).toLocaleDateString("en-IN")} {booking.poojaTime ?? ""}
                  </p>
                </div>
                {booking.gotra && (
                  <div>
                    <p className="text-xs text-muted-foreground">Gotra</p>
                    <p className="font-medium">{booking.gotra}</p>
                  </div>
                )}
                {booking.specialInstructions && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Special Instructions</p>
                    <p className="font-medium">{booking.specialInstructions}</p>
                  </div>
                )}
              </div>

              {booking.package?.name && (
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span>
                    Package: <span className="font-semibold">{booking.package.name}</span>
                  </span>
                  <span className="font-semibold text-primary">₹{Number(booking.package.price ?? 0).toLocaleString("en-IN")}</span>
                </div>
              )}
              {booking.selectedSamagri.length > 0 && (
                <div className="rounded-lg border border-border px-3 py-2">
                  <p className="mb-1.5 font-semibold">Selected Samagri</p>
                  {booking.selectedSamagri.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-muted-foreground">
                      <span>{item.name}</span>
                      <span>₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              )}
              {booking.referral?.referredBy && <p className="text-muted-foreground">Referred by: {booking.referral.referredBy}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pandit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {booking.pandit ? (
                <>
                  <p className="font-medium">{booking.pandit.fullName}</p>
                  <p className="text-muted-foreground">{booking.pandit.mobile}</p>
                </>
              ) : (
                <p className="text-muted-foreground">No Pandit assigned yet.</p>
              )}
              <select
                defaultValue=""
                onChange={(e) => onAssignPandit(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              >
                <option value="" disabled>
                  {booking.pandit ? "Reassign Pandit..." : "Assign a verified pandit..."}
                </option>
                {pandits?.items.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({p.mobile})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{[booking.address, booking.landmark, booking.city, booking.pincode].filter(Boolean).join(", ") || "—"}</p>
            </CardContent>
          </Card>

          {booking.muhuratSlot && (
            <Card>
              <CardHeader>
                <CardTitle>Muhurat Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {(() => {
                  const slot = muhurat?.slots.find((s) => s._id === booking.muhuratSlot?.slotId);
                  if (!slot) return <p className="text-muted-foreground">Loading Muhurat details...</p>;
                  return (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Time Slot</p>
                        <p className="font-medium">
                          {slot.startTime} – {slot.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-medium">{slot.capacity != null ? `${slot.bookedCount} / ${slot.capacity}` : "Unlimited"}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Final amount</p>
                  <p className="font-medium">
                    {marketPrice > finalAmount && (
                      <span className="mr-1.5 text-xs text-muted-foreground line-through">₹{marketPrice.toLocaleString("en-IN")}</span>
                    )}
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paid so far</p>
                  <p className="font-medium">₹{totalPaid.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-medium">₹{Math.max(finalAmount - totalPaid, 0).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment status</p>
                  <Badge variant={booking.paymentStatus === "paid" ? "default" : "outline"} className="capitalize">
                    {booking.paymentStatus.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {booking.payments.length === 0 && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}
                {booking.payments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>
                      ₹{payment.amount.toLocaleString("en-IN")} via {payment.method}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(payment.recordedAt).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-end gap-2 border-t border-border pt-3">
                <div className="w-32 space-y-1">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                </div>
                <div className="w-40 space-y-1">
                  <Label className="text-xs">Method</Label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={onAddPayment} disabled={addPayment.isPending}>
                  Record payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {booking.timeline.map((event, i) => (
                <div key={i} className="border-b border-dashed border-border pb-2 text-xs last:border-0">
                  <p className="font-medium">{BOOKING_STATUS_LABELS[event.status] ?? event.status}</p>
                  {event.note && <p className="text-muted-foreground">{event.note}</p>}
                  <p className="text-muted-foreground">{new Date(event.changedAt).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.internalNotes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
              {booking.internalNotes.map((note, i) => (
                <div key={i} className="rounded-lg border border-border px-3 py-2 text-sm">
                  <p>{note.note}</p>
                  <p className="text-xs text-muted-foreground">{new Date(note.addedAt).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <Textarea rows={2} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add an internal note..." />
                <Button onClick={onAddNote} disabled={addNote.isPending}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={booking.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
              >
                {BOOKING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {BOOKING_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl" style={{ maxWidth: '550px' }}>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onSaveEdit)} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Pooja date</Label>
                <DatePicker value={watchEdit("poojaDate") ?? ""} onChange={(v) => setEditValue("poojaDate", v)} />
              </div>
              <div className="space-y-1.5">
                <Label>Pooja time</Label>
                <TimePicker value={watchEdit("poojaTime") ?? ""} onChange={(v) => setEditValue("poojaTime", v)} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Gotra</Label>
                <Input {...registerEdit("gotra")} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input {...registerEdit("city")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Textarea rows={2} {...registerEdit("address")} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Landmark</Label>
                <Input {...registerEdit("landmark")} />
              </div>
              <div className="space-y-1.5">
                <Label>Pincode</Label>
                <Input {...registerEdit("pincode")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Special instructions</Label>
              <Textarea rows={2} {...registerEdit("specialInstructions")} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Package price (₹)</Label>
                <Input type="number" {...registerEdit("packagePrice", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Market price (₹)</Label>
                <Input type="number" {...registerEdit("marketPrice", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Discount (₹)</Label>
                <Input type="number" {...registerEdit("discount", { valueAsNumber: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Final amount (₹)</Label>
                <Input type="number" {...registerEdit("finalAmount", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Advance / agreed amount (₹)</Label>
              <Input type="number" className="max-w-[200px]" {...registerEdit("advanceAmount", { valueAsNumber: true })} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSavingEdit}>
                {isSavingEdit && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
