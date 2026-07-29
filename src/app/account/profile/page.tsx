"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CalendarDays, LogOut, Mail, MapPin, Phone, Save, ShieldCheck, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { type UpdateProfileInput, useMyProfile, useUpdateProfile } from "@/features/account/api/use-profile";
import { getErrorMessage } from "@/features/account/lib/get-error-message";
import { env } from "@/lib/env";
import { CUSTOMER_ACCESS_TOKEN_KEY } from "@/lib/customer-api-client";
import { useAuthModal } from "@/providers/auth-modal-provider";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const { logout } = useAuthModal();

  const [form, setForm] = useState<UpdateProfileInput>({});

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email ?? "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        gender: profile.gender,
        preferredLanguage: profile.preferredLanguage ?? "",
        city: profile.city ?? "",
      });
    }
  }, [profile]);

  async function handleSave() {
    try {
      await updateMutation.mutateAsync(form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update profile"));
    }
  }

  if (isLoading) return <AccountLoadingSkeleton rows={2} />;
  if (isError || !profile) return <AccountErrorState onRetry={() => refetch()} />;

  const initials = (form.name || profile.name || "PD")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <AccountPageHeader title="Profile" description="Manage your personal details and account security." />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
            {initials}
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-secondary">{profile.name}</p>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Phone className="size-3.5" /> +91 {profile.mobile}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-secondary">
            <UserIcon className="size-4 text-primary" /> Personal Information
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-1.5">Full Name</Label>
              <Input id="name" placeholder="Your full name" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="email" className="mb-1.5 flex items-center gap-1.5">
                <Mail className="size-3.5" /> Email (optional)
              </Label>
              <Input id="email" type="email" placeholder="you@example.com" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="dob" className="mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> Date of Birth
              </Label>
              <Input id="dob" type="date" value={form.dob ?? ""} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="gender" className="mb-1.5">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as UpdateProfileInput["gender"] })}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city" className="mb-1.5 flex items-center gap-1.5">
                <MapPin className="size-3.5" /> City
              </Label>
              <Input id="city" placeholder="e.g. Noida" value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="language" className="mb-1.5">Preferred Language</Label>
              <Input id="language" placeholder="e.g. Hindi" value={form.preferredLanguage ?? ""} onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })} />
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-border pt-4">
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="font-ui font-bold">
              <Save className="size-4" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-secondary">
            <ShieldCheck className="size-4 text-primary" /> Account & Security
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-medium text-secondary">Mobile Number</p>
              <p className="text-sm text-muted-foreground">+91 {profile.mobile}</p>
            </div>
            <ChangeMobileDialog currentMobile={profile.mobile} onChanged={() => refetch()} />
          </div>

          <Button
            variant="outline"
            className="mt-4 font-ui font-bold text-destructive hover:text-destructive"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ChangeMobileDialog({ currentMobile, onChanged }: { currentMobile: string; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [newMobile, setNewMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function reset() {
    setStep("mobile");
    setNewMobile("");
    setOtp("");
    setDevOtp(null);
  }

  function authHeaders() {
    const token = window.localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
    return { Authorization: `Bearer ${token}` };
  }

  async function handleSendOtp() {
    if (!/^\d{10}$/.test(newMobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (newMobile === currentMobile) {
      toast.error("This is already your current mobile number");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${env.NEXT_PUBLIC_API_URL}/customer-auth/change-mobile/send-otp`,
        { newMobile },
        { headers: authHeaders() },
      );
      setDevOtp(res.data.data.devOtp ?? null);
      setStep("otp");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send OTP"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify() {
    if (otp.length < 4) {
      toast.error("Enter the OTP sent to your new mobile number");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${env.NEXT_PUBLIC_API_URL}/customer-auth/change-mobile/verify`,
        { newMobile, otp },
        { headers: authHeaders() },
      );
      toast.success("Mobile number updated");
      setOpen(false);
      reset();
      onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not verify OTP"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shrink-0 font-ui font-bold">
          Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Mobile Number</DialogTitle>
          <DialogDescription>
            {step === "mobile"
              ? "We'll send an OTP to your new number to verify it."
              : `Enter the OTP sent to +91 ${newMobile}.`}
          </DialogDescription>
        </DialogHeader>

        {step === "mobile" ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-mobile" className="mb-1.5">New Mobile Number</Label>
              <Input id="new-mobile" inputMode="numeric" maxLength={10} placeholder="98765 43210" value={newMobile} onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {devOtp && (
              <div className="rounded-xl border border-dashed border-accent bg-accent/10 p-3 text-center">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Development OTP</span>
                <span className="font-heading text-xl tracking-[0.3em] text-primary">{devOtp}</span>
              </div>
            )}
            <div>
              <Label htmlFor="mobile-otp" className="mb-1.5">OTP</Label>
              <Input id="mobile-otp" inputMode="numeric" maxLength={6} placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "mobile" ? (
            <Button onClick={handleSendOtp} disabled={isSubmitting} className="font-ui font-bold">
              {isSubmitting ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <Button onClick={handleVerify} disabled={isSubmitting} className="font-ui font-bold">
              {isSubmitting ? "Verifying..." : "Verify & Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
