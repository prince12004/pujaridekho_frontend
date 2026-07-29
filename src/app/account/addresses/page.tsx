"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import {
  type AddressInput,
  type MyAddress,
  useAddAddress,
  useDeleteAddress,
  useMyAddresses,
  useUpdateAddress,
} from "@/features/account/api/use-addresses";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const EMPTY_FORM: AddressInput = {
  fullName: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  type: "home",
  isDefault: false,
};

export default function AddressesPage() {
  const { data, isLoading, isError, refetch } = useMyAddresses();
  const addMutation = useAddAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<MyAddress | null>(null);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(address: MyAddress) {
    setEditingId(address._id);
    setForm({
      fullName: address.fullName,
      mobile: address.mobile,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state ?? "",
      pincode: address.pincode,
      type: address.type ?? "home",
      isDefault: address.isDefault ?? false,
    });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.fullName || !form.mobile || !form.addressLine1 || !form.city || !form.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, input: form });
        toast.success("Address updated");
      } else {
        await addMutation.mutateAsync(form);
        toast.success("Address added");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save address"));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      toast.success("Address removed");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not remove address"));
    }
  }

  return (
    <div>
      <AccountPageHeader
        title="Addresses"
        description="Manage saved delivery and Pooja addresses."
        actions={
          <Button onClick={openAddForm} className="font-ui font-bold">
            Add Address
          </Button>
        }
      />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <AccountEmptyState icon={MapPin} title="No addresses saved yet." description="Add an address to make bookings and orders faster." />
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((address) => (
            <Card key={address._id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  {address.type && (
                    <Badge variant="secondary" className="capitalize">
                      {address.type}
                    </Badge>
                  )}
                  {address.isDefault && <Badge>Default</Badge>}
                </div>
                <p className="text-sm font-semibold text-secondary">{address.fullName}</p>
                <p className="text-sm text-muted-foreground">{address.mobile}</p>
                <p className="text-sm text-muted-foreground">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                  {address.landmark ? `, ${address.landmark}` : ""}, {address.city}
                  {address.state ? `, ${address.state}` : ""} — {address.pincode}
                </p>
                {address.usedInUpcomingBooking && <p className="text-xs text-primary">Used in an upcoming booking</p>}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="font-ui font-bold" onClick={() => openEditForm(address)}>
                    <Pencil className="mr-1 size-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="font-ui font-bold text-destructive hover:text-destructive" onClick={() => setDeleteTarget(address)}>
                    <Trash2 className="mr-1 size-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="full-name" className="mb-1.5">Full Name</Label>
              <Input id="full-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="mobile" className="mb-1.5">Mobile Number</Label>
              <Input id="mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="line1" className="mb-1.5">Address Line 1</Label>
              <Input id="line1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="line2" className="mb-1.5">Address Line 2</Label>
              <Input id="line2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="landmark" className="mb-1.5">Landmark</Label>
              <Input id="landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="city" className="mb-1.5">City</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="state" className="mb-1.5">State</Label>
              <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pincode" className="mb-1.5">Pincode</Label>
              <Input id="pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="type" className="mb-1.5">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AddressInput["type"] })}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as default address
          </label>
          <DialogFooter>
            <Button onClick={handleSave} disabled={addMutation.isPending || updateMutation.isPending} className="font-ui font-bold">
              {addMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this address?</DialogTitle>
            <DialogDescription>
              {deleteTarget?.usedInUpcomingBooking
                ? "This address is linked to an upcoming booking. Deleting it will not affect that booking, but you'll need to re-enter it for future bookings."
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="font-ui font-bold">
              {deleteMutation.isPending ? "Deleting..." : "Delete Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
