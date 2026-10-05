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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PanditForm } from "@/features/admin/components/pandit-form";
import { usePandit, useSetPanditPassword } from "@/features/admin/api/use-pandits";
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
