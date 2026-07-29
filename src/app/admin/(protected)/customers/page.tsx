"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useCreateCustomer, useCustomers } from "@/features/admin/api/use-customers";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
});

type CustomerValues = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useCustomers({ search: search || undefined });
  const createMutation = useCreateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerValues>({ resolver: zodResolver(customerSchema) });

  const onSubmit = async (values: CustomerValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Customer created");
      setDialogOpen(false);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Everyone who has booked or been added to PujariDekho."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> Add Customer
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name / mobile / email..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

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
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "destructive"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Create customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
