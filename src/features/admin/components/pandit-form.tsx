"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pandit, PANDIT_VERIFICATION_STATUSES, useCreatePandit, useUpdatePandit } from "@/features/admin/api/use-pandits";
import { ImageUploadInput } from "@/features/admin/components/image-upload-input";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const panditFormSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  photo: z.string().optional(),
  cities: z.string().optional(),
  specializations: z.string().optional(),
  languages: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  verificationStatus: z.enum(PANDIT_VERIFICATION_STATUSES),
  accountStatus: z.enum(["active", "inactive"]),
  featured: z.boolean().optional(),
});

type PanditFormValues = z.infer<typeof panditFormSchema>;

function toCsv(value?: string[]) {
  return value?.join(", ") ?? "";
}

function fromCsv(value?: string) {
  return value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];
}

export function PanditForm({ pandit }: { pandit?: Pandit }) {
  const router = useRouter();
  const createMutation = useCreatePandit();
  const updateMutation = useUpdatePandit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof panditFormSchema>, unknown, PanditFormValues>({
    resolver: zodResolver(panditFormSchema),
    defaultValues: {
      fullName: pandit?.fullName ?? "",
      mobile: pandit?.mobile ?? "",
      email: pandit?.email ?? "",
      photo: pandit?.photo ?? "",
      cities: toCsv(pandit?.cities),
      specializations: toCsv(pandit?.specializations),
      languages: "",
      experienceYears: pandit?.experienceYears ?? 0,
      bio: "",
      verificationStatus: (pandit?.verificationStatus as PanditFormValues["verificationStatus"]) ?? "application_pending",
      accountStatus: pandit?.accountStatus ?? "active",
      featured: pandit?.featured ?? false,
    },
  });

  const onSubmit = async (values: PanditFormValues) => {
    try {
      const payload = {
        ...values,
        cities: fromCsv(values.cities),
        specializations: fromCsv(values.specializations),
        languages: fromCsv(values.languages),
      };
      if (pandit) {
        await updateMutation.mutateAsync({ id: pandit._id, input: payload });
        toast.success("Pandit updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Pandit created");
        router.push("/admin/pandits");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pandit details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Mobile</Label>
            <Input {...register("mobile")} />
            {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input {...register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label>Photo</Label>
            <ImageUploadInput value={watch("photo") ?? ""} onChange={(v) => setValue("photo", v)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cities served (comma separated)</Label>
            <Input {...register("cities")} placeholder="Delhi, Noida, Gurgaon" />
          </div>
          <div className="space-y-1.5">
            <Label>Specializations (comma separated)</Label>
            <Input {...register("specializations")} placeholder="Griha Pravesh, Satyanarayan Katha" />
          </div>
          <div className="space-y-1.5">
            <Label>Languages (comma separated)</Label>
            <Input {...register("languages")} placeholder="Hindi, Sanskrit, English" />
          </div>
          <div className="space-y-1.5">
            <Label>Experience (years)</Label>
            <Input type="number" {...register("experienceYears")} />
          </div>
          <div className="space-y-1.5">
            <Label>Verification status</Label>
            <select {...register("verificationStatus")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              {PANDIT_VERIFICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Account status</Label>
            <select {...register("accountStatus")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} /> Featured on homepage
            </label>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Bio</Label>
            <Textarea rows={4} {...register("bio")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {pandit ? "Save changes" : "Create pandit"}
        </Button>
      </div>
    </form>
  );
}
