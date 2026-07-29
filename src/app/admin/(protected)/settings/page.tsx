"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useSettings, useUpdateSettings, type SiteSettings } from "@/features/admin/api/use-settings";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

type FormValues = Omit<SiteSettings, "_id">;

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      siteName: "",
      tagline: "",
      contactPhone: "",
      contactWhatsapp: "",
      contactEmail: "",
      officeAddress: "",
      officeHours: "",
      socialLinks: { facebook: "", instagram: "", youtube: "", twitter: "" },
      maintenanceMode: false,
      maintenanceMessage: "",
    },
  });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Website Settings" description="Global site configuration used across the public website." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Site Name</Label>
              <Input {...register("siteName")} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input {...register("tagline")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Contact Phone</Label>
              <Input {...register("contactPhone")} placeholder="+91 9211241314" />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp Number</Label>
              <Input {...register("contactWhatsapp")} placeholder="+91 9211241314" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input {...register("contactEmail")} placeholder="support@pujaridekho.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Office Hours</Label>
              <Input {...register("officeHours")} placeholder="Mon–Sun, 7:00 AM – 10:00 PM IST" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Office Address</Label>
              <Input {...register("officeAddress")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Facebook</Label>
              <Input {...register("socialLinks.facebook")} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Instagram</Label>
              <Input {...register("socialLinks.instagram")} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>YouTube</Label>
              <Input {...register("socialLinks.youtube")} placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Twitter / X</Label>
              <Input {...register("socialLinks.twitter")} placeholder="https://x.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("maintenanceMode")} /> Enable maintenance mode
            </label>
            <div className="space-y-1.5">
              <Label>Maintenance Message</Label>
              <Input {...register("maintenanceMessage")} placeholder="We'll be back shortly." />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
