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

const SEMVER = /^\d+\.\d+\.\d+$/;

function compareVersions(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  return 0;
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const { register, handleSubmit, reset, getValues, formState: { isSubmitting, errors } } = useForm<FormValues>({
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
      statsOffsets: { verifiedPandits: 5, poojas: 1000, families: 0 },
      app: {
        android: { minVersion: "1.0.0", latestVersion: "1.0.0", storeUrl: "" },
        ios: { minVersion: "1.0.0", latestVersion: "1.0.0", storeUrl: "" },
        updateMessage: "",
      },
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

        <Card>
          <CardHeader>
            <CardTitle>Homepage Numbers</CardTitle>
            <p className="text-xs text-muted-foreground">
              The homepage, hero and About page count verified pandits, completed pujas and families live from the database. The numbers below are
              added on top (e.g. pujas done before the website). Rating and cities are always fully live. Changes show within about 10 minutes.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Add to verified pandits</Label>
              <Input type="number" min={0} {...register("statsOffsets.verifiedPandits", { valueAsNumber: true, min: 0 })} />
            </div>
            <div className="space-y-1.5">
              <Label>Add to completed pujas</Label>
              <Input type="number" min={0} {...register("statsOffsets.poojas", { valueAsNumber: true, min: 0 })} />
            </div>
            <div className="space-y-1.5">
              <Label>Add to families served</Label>
              <Input type="number" min={0} {...register("statsOffsets.families", { valueAsNumber: true, min: 0 })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile App</CardTitle>
            <p className="text-xs text-muted-foreground">
              Read by the Pujari Dekho app on launch. Installed version below the minimum → a blocking &quot;Update required&quot; screen;
              below the latest → a dismissible &quot;Update available&quot;. Maintenance mode above also applies to the app.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {(["android", "ios"] as const).map((platform) => {
              const fieldErrors = errors.app?.[platform];
              return (
                <div key={platform} className="space-y-3 rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold">{platform === "android" ? "Android" : "iOS"}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Minimum version</Label>
                      <Input
                        placeholder="1.0.0"
                        {...register(`app.${platform}.minVersion`, {
                          required: "Required",
                          pattern: { value: SEMVER, message: "Use the format 1.2.3" },
                        })}
                      />
                      {fieldErrors?.minVersion ? <p className="text-xs text-destructive">{fieldErrors.minVersion.message}</p> : null}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Latest version</Label>
                      <Input
                        placeholder="1.0.0"
                        {...register(`app.${platform}.latestVersion`, {
                          required: "Required",
                          pattern: { value: SEMVER, message: "Use the format 1.2.3" },
                          validate: (v) =>
                            !SEMVER.test(getValues(`app.${platform}.minVersion`)) ||
                            compareVersions(v, getValues(`app.${platform}.minVersion`)) >= 0 ||
                            "Must be the same as or higher than the minimum",
                        })}
                      />
                      {fieldErrors?.latestVersion ? <p className="text-xs text-destructive">{fieldErrors.latestVersion.message}</p> : null}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{platform === "android" ? "Play Store link" : "App Store link"}</Label>
                      <Input
                        placeholder={platform === "android" ? "https://play.google.com/store/apps/details?id=…" : "https://apps.apple.com/app/id…"}
                        {...register(`app.${platform}.storeUrl`, {
                          validate: (v) => !v || /^https?:\/\//.test(v) || "Enter a full link starting with https://",
                        })}
                      />
                      {fieldErrors?.storeUrl ? <p className="text-xs text-destructive">{fieldErrors.storeUrl.message}</p> : null}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="space-y-1.5">
              <Label>Update message (optional)</Label>
              <Input {...register("app.updateMessage")} placeholder="A new version of Pujari Dekho is available." />
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
