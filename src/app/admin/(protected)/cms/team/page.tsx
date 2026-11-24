"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Crown, Loader2, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SingleImageUpload } from "@/features/admin/components/single-image-upload";
import {
  TeamMemberAdmin,
  useCreateTeamMember,
  useDeleteTeamMember,
  useReorderTeam,
  useTeamMembers,
  useUpdateTeamMember,
} from "@/features/admin/api/use-team";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  designation: z.string().trim().min(1, "Designation is required").max(80),
  bio: z.string().trim().max(240, "Keep the bio under 240 characters"),
  photo: z.string().optional(),
  photoPosition: z.enum(["top", "center", "bottom"]),
  featured: z.boolean(),
  isActive: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = { name: "", designation: "", bio: "", photo: "", photoPosition: "top", featured: false, isActive: true };
const POSITION_CLASS = { top: "object-top", center: "object-center", bottom: "object-bottom" } as const;

function Portrait({ src, position, className }: { src?: string; position: FormValues["photoPosition"]; className: string }) {
  return (
    <div className={`overflow-hidden rounded-lg bg-muted ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={`h-full w-full object-cover ${POSITION_CLASS[position]}`} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground/60">
          <UserRound className="size-1/2" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}

export default function TeamMembersPage() {
  const { data: members, isLoading } = useTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();
  const reorderMutation = useReorderTeam();
  const [editing, setEditing] = useState<TeamMemberAdmin | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMemberAdmin) => {
    setEditing(m);
    reset({
      name: m.name,
      designation: m.designation,
      bio: m.bio ?? "",
      photo: m.photo ?? "",
      photoPosition: m.photoPosition ?? "top",
      featured: m.featured,
      isActive: m.isActive,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input: values });
        toast.success("Team member updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Team member added");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (m: TeamMemberAdmin) => {
    if (!confirm(`Remove ${m.name} from the team?`)) return;
    try {
      await deleteMutation.mutateAsync(m._id);
      toast.success("Team member removed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleActive = async (m: TeamMemberAdmin) => {
    try {
      await updateMutation.mutateAsync({ id: m._id, input: { isActive: !m.isActive } });
      toast.success(m.isActive ? `${m.name} hidden from the website` : `${m.name} shown on the website`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!members) return;
    const ids = members.map((m) => m._id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    try {
      await reorderMutation.mutateAsync(ids);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const photo = watch("photo") ?? "";
  const position = watch("photoPosition");

  return (
    <div>
      <AdminPageHeader
        title="Team Members"
        description="The “Meet Our Team” section on the About page. Order here is the order on the website."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Member
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
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No team members yet. The section is hidden on the website until you add one.
                    </TableCell>
                  </TableRow>
                )}
                {members?.map((m, i) => (
                  <TableRow key={m._id} className={m.isActive ? "" : "opacity-60"}>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" aria-label="Move up" disabled={i === 0 || reorderMutation.isPending} onClick={() => move(i, -1)}>
                          <ArrowUp />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Move down" disabled={i === members.length - 1 || reorderMutation.isPending} onClick={() => move(i, 1)}>
                          <ArrowDown />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Portrait src={m.photo} position={m.photoPosition ?? "top"} className="h-14 w-11 shrink-0" />
                        <div>
                          <p className="flex items-center gap-1.5 font-medium">
                            {m.name}
                            {m.featured && <Crown className="size-3.5 text-brand-gold" aria-label="Featured" />}
                          </p>
                          <p className="text-xs text-muted-foreground">{m.designation}</p>
                          {m.bio ? <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground/80">{m.bio}</p> : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button type="button" onClick={() => toggleActive(m)} title="Click to show / hide on the website">
                        <Badge variant={m.isActive ? "default" : "outline"}>{m.isActive ? "Visible" : "Hidden"}</Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => openEdit(m)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => onDelete(m)}>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Team Member" : "New Team Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input placeholder="e.g. Founder, Mentor, App Developer" {...register("designation")} />
              {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Short bio</Label>
              <Textarea rows={3} maxLength={240} placeholder="One or two lines about their role at PujariDekho" {...register("bio")} />
              <p className="text-xs text-muted-foreground">{(watch("bio") ?? "").length}/240 — shown under the name on the About page.</p>
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Photo</Label>
              <SingleImageUpload
                value={photo}
                onChange={(url) => setValue("photo", url, { shouldDirty: true })}
                helperText="Portrait (4:5) works best, e.g. 600×750. PNG, JPG or WEBP up to 5MB."
              />
            </div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-4">
              <div className="space-y-1.5">
                <Label>Photo focus</Label>
                <select {...register("photoPosition")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
                  <option value="top">Top (keep the face in frame)</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
                <p className="text-xs text-muted-foreground">Which part of the photo stays visible when it is cropped to the card.</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs text-muted-foreground">Card preview</p>
                <Portrait src={photo} position={position} className="h-20 w-16" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("featured")} /> Highlight (gold frame, e.g. Founder)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isActive")} /> Show on website
              </label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Add member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
