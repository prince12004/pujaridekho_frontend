"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  type CrmSalesPerson,
  useCreateCrmSalesperson,
  useCrmSalespeople,
  useUpdateCrmSalesperson,
} from "@/features/admin/api/use-crm-salespeople";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
type CreateValues = z.infer<typeof createSchema>;

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().optional(),
});
type EditValues = z.infer<typeof editSchema>;

export default function CrmSalespeoplePage() {
  const { data, isLoading } = useCrmSalespeople();
  const createMutation = useCreateCrmSalesperson();
  const updateMutation = useUpdateCrmSalesperson();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CrmSalesPerson | null>(null);

  const createForm = useForm<CreateValues>({ resolver: zodResolver(createSchema) });
  const editForm = useForm<EditValues>({ resolver: zodResolver(editSchema) });

  const onCreate = async (values: CreateValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Salesperson created");
      setCreateOpen(false);
      createForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openEdit = (sp: CrmSalesPerson) => {
    setEditing(sp);
    editForm.reset({ name: sp.name, phone: sp.phone, password: "" });
  };

  const onEdit = async (values: EditValues) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({
        id: editing.id,
        name: values.name,
        phone: values.phone,
        ...(values.password ? { password: values.password } : {}),
      });
      toast.success("Salesperson updated");
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleActive = async (sp: CrmSalesPerson) => {
    try {
      await updateMutation.mutateAsync({ id: sp.id, active: !sp.active });
      toast.success(sp.active ? "Salesperson deactivated" : "Salesperson activated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="CRM Salespeople"
        description="Manage the sales team that works CRM inquiries/leads."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> Add Salesperson
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
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No salespeople yet.
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((sp) => (
                  <TableRow key={sp.id}>
                    <TableCell className="font-medium">{sp.name}</TableCell>
                    <TableCell className="text-muted-foreground">{sp.phone}</TableCell>
                    <TableCell>
                      <Badge variant={sp.active ? "default" : "destructive"}>{sp.active ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sp.createdAt ? new Date(sp.createdAt).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(sp)}>
                        <Pencil /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleActive(sp)} disabled={updateMutation.isPending}>
                        {sp.active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Salesperson</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...createForm.register("name")} />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...createForm.register("phone")} />
              {createForm.formState.errors.phone && (
                <p className="text-xs text-destructive">{createForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" {...createForm.register("password")} />
              {createForm.formState.errors.password && (
                <p className="text-xs text-destructive">{createForm.formState.errors.password.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createForm.formState.isSubmitting}>
                {createForm.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Create salesperson
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salesperson</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...editForm.register("name")} />
              {editForm.formState.errors.name && (
                <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...editForm.register("phone")} />
              {editForm.formState.errors.phone && (
                <p className="text-xs text-destructive">{editForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>New password (optional)</Label>
              <Input type="password" placeholder="Leave blank to keep current password" {...editForm.register("password")} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                {editForm.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
