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
import { useHomepageBanner, useUpdateHomepageBanner, type HomepageBanner } from "@/features/admin/api/use-homepage-banner";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

type FormValues = Omit<HomepageBanner, "_id">;

export default function HomepageCmsPage() {
  const { data: banner, isLoading } = useHomepageBanner();
  const updateMutation = useUpdateHomepageBanner();

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { active: false, text: "", ctaLabel: "", ctaHref: "" },
  });

  useEffect(() => {
    if (banner) reset(banner);
  }, [banner, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Homepage banner updated");
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

  const values = watch();

  return (
    <div>
      <AdminPageHeader
        title="Homepage CMS"
        description="Manage the announcement banner shown at the top of the homepage — no code changes needed."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("active")} /> Show banner on homepage
              </label>
              <div className="space-y-1.5">
                <Label>Banner Text</Label>
                <Input {...register("text")} placeholder="Diwali Offer: 20% off on Griha Pravesh Poojas!" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>CTA Label</Label>
                  <Input {...register("ctaLabel")} placeholder="Book Now" />
                </div>
                <div className="space-y-1.5">
                  <Label>CTA Link</Label>
                  <Input {...register("ctaHref")} placeholder="/poojas" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Save Banner
            </Button>
          </div>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {values.active && values.text ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-primary-foreground">
                <span>{values.text}</span>
                {values.ctaLabel && (
                  <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs">{values.ctaLabel}</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Banner is currently hidden. Enable it and add text to see a live preview here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
