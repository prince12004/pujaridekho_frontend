"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  useAdminUsers,
  useCreateAdminUser,
  useCreateRole,
  usePermissionCatalog,
  useRoles,
  useUpdateAdminUserStatus,
} from "@/features/admin/api/use-roles";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});
type RoleValues = z.infer<typeof roleSchema>;

const adminUserSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  role: z.string().min(1, "Required"),
});
type AdminUserValues = z.infer<typeof adminUserSchema>;

function RoleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: catalog } = usePermissionCatalog();
  const createRole = useCreateRole();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleValues>({ resolver: zodResolver(roleSchema), defaultValues: { name: "", permissions: [] } });

  const selected = watch("permissions") ?? [];

  const toggle = (permission: string) => {
    setValue("permissions", selected.includes(permission) ? selected.filter((p) => p !== permission) : [...selected, permission]);
  };

  const onSubmit = async (values: RoleValues) => {
    try {
      await createRole.mutateAsync(values);
      toast.success("Role created");
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Role name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Permissions</Label>
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-border p-2">
              {catalog?.permissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selected.includes(permission)} onChange={() => toggle(permission)} />
                  {permission}
                </label>
              ))}
            </div>
            {errors.permissions && <p className="text-xs text-destructive">{errors.permissions.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Create role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: roles } = useRoles();
  const createAdminUser = useCreateAdminUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserValues>({ resolver: zodResolver(adminUserSchema) });

  const onSubmit = async (values: AdminUserValues) => {
    try {
      await createAdminUser.mutateAsync(values);
      toast.success("Admin user created");
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Admin User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Temporary password</Label>
            <Input type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <select {...register("role")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="">Select a role</option>
              {roles?.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Create admin user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function RolesPage() {
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: adminUsers, isLoading: usersLoading } = useAdminUsers();
  const updateStatus = useUpdateAdminUserStatus();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const onToggleStatus = async (id: string, status: "active" | "suspended") => {
    try {
      await updateStatus.mutateAsync({ id, status: status === "active" ? "suspended" : "active" });
      toast.success("Admin user updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Roles & Permissions" description="Define what each admin role can see and do." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Roles</CardTitle>
            <Button size="sm" onClick={() => setRoleDialogOpen(true)}>
              <Plus /> New role
            </Button>
          </CardHeader>
          <CardContent>
            {rolesLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="space-y-2">
                {roles?.map((role) => (
                  <div key={role._id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{role.name}</p>
                      {role.isSystem && <Badge variant="outline">System</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {role.permissions.includes("*") ? "All permissions" : `${role.permissions.length} permissions`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Admin Users</CardTitle>
            <Button size="sm" onClick={() => setUserDialogOpen(true)}>
              <Plus /> New admin
            </Button>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {typeof user.role === "object" ? user.role.name : user.role}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => onToggleStatus(user._id, user.status)}>
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <RoleDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} />
      <AdminUserDialog open={userDialogOpen} onOpenChange={setUserDialogOpen} />
    </div>
  );
}
