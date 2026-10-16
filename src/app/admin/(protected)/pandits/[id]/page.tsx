"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PanditForm } from "@/features/admin/components/pandit-form";
import { usePandit, useSetPanditPassword } from "@/features/admin/api/use-pandits";
import { useCrmInquiries, useUpdateCrmInquiry, computeCrmInquiryDue } from "@/features/admin/api/use-crm-inquiries";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const passwordSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

export default function EditPanditPage() {
  const params = useParams<{ id: string }>();
  const { data: pandit, isLoading } = usePandit(params.id);
  const setPasswordMutation = useSetPanditPassword();
  const [passwordOpen, setPasswordOpen] = useState(false);

  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const { data: panditInquiries, isLoading: collectionsLoading } = useCrmInquiries({
    panditId: params.id,
    status: "confirmed",
    limit: 100,
  });
  const pendingCollections = (panditInquiries?.data ?? []).filter(
    (i) => i.tokenStatus === "pending" || i.totalAmountStatus === "pending",
  );
  const markPaidMutation = useUpdateCrmInquiry();

  const onSetPassword = async (values: PasswordValues) => {
    try {
      await setPasswordMutation.mutateAsync({ id: params.id, password: values.password });
      toast.success("Pandit app password set");
      setPasswordOpen(false);
      passwordForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onMarkPaid = async (inquiryId: string, version: number) => {
    try {
      await markPaidMutation.mutateAsync({
        id: inquiryId,
        tokenStatus: "received",
        totalAmountStatus: "received",
        version,
      });
      toast.success("Marked as fully paid");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading || !pandit) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={`Edit — ${pandit.fullName}`}
        description="Update pandit profile and verification status."
        actions={
          <Button variant="outline" onClick={() => setPasswordOpen(true)}>
            <KeyRound className="mr-2 size-4" />
            Set App Password
          </Button>
        }
      />
      <PanditForm pandit={pandit} />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Pending Collections</CardTitle>
        </CardHeader>
        <CardContent>
          {collectionsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : pendingCollections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending collections for this pandit.</p>
          ) : (
            <div className="space-y-3">
              {pendingCollections.map((inquiry) => {
                const { grandTotal, due } = computeCrmInquiryDue(inquiry);
                return (
                  <div
                    key={inquiry.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">{inquiry.clientName}</p>
                      <p className="text-muted-foreground">
                        {inquiry.pujaName}
                        {inquiry.pujaDate ? ` · ${new Date(inquiry.pujaDate).toLocaleDateString("en-IN")}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={inquiry.tokenStatus === "received" ? "default" : "outline"}>
                        Token {inquiry.tokenStatus === "received" ? "received" : "pending"}
                      </Badge>
                      <Badge variant={inquiry.totalAmountStatus === "received" ? "default" : "outline"}>
                        Total {inquiry.totalAmountStatus === "received" ? "received" : "pending"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{grandTotal.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-destructive">Due ₹{due.toLocaleString("en-IN")}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={markPaidMutation.isPending}
                      onClick={() => onMarkPaid(inquiry.id, inquiry.version)}
                    >
                      Mark as Fully Paid
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set pujaripandit_app login password</DialogTitle>
          </DialogHeader>
          <form onSubmit={passwordForm.handleSubmit(onSetPassword)} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The pandit will log in to the mobile app with mobile number <strong>{pandit.mobile}</strong> and this password.
            </p>
            <div className="space-y-2">
              <Label htmlFor="pandit-password">New password</Label>
              <Input id="pandit-password" type="text" autoComplete="off" {...passwordForm.register("password")} />
              {passwordForm.formState.errors.password && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={setPasswordMutation.isPending}>
                {setPasswordMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Set password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
