"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { usePoojas } from "@/features/admin/api/use-poojas";
import {
  Muhurat,
  MuhuratSlotInput,
  useCopyMuhurat,
  useCreateMuhurat,
  useDeleteMuhurat,
  useMuhurats,
  useUpdateMuhurat,
} from "@/features/admin/api/use-muhurats";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function toDateInputValue(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function poojaLabel(pooja: Muhurat["pooja"]): string {
  return typeof pooja === "string" ? pooja : pooja.name;
}

function poojaId(pooja: Muhurat["pooja"]): string {
  return typeof pooja === "string" ? pooja : pooja._id;
}

const EMPTY_SLOT: MuhuratSlotInput = { startTime: "09:00", endTime: "10:00", capacity: undefined, isActive: true };

export default function AdminMuhuratsPage() {
  const [filterPoojaId, setFilterPoojaId] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data: poojas } = usePoojas({ limit: 500, status: "Published" });
  const { data: muhurats, isLoading } = useMuhurats({
    poojaId: filterPoojaId || undefined,
    date: filterDate || undefined,
    search: search || undefined,
  });

  const createMutation = useCreateMuhurat();
  const updateMutation = useUpdateMuhurat();
  const deleteMutation = useDeleteMuhurat();
  const copyMutation = useCopyMuhurat();

  const [editing, setEditing] = useState<Muhurat | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formPoojaId, setFormPoojaId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formSlots, setFormSlots] = useState<MuhuratSlotInput[]>([{ ...EMPTY_SLOT }]);
  const [formNotes, setFormNotes] = useState("");
  const [formActive, setFormActive] = useState(true);

  const [copyTarget, setCopyTarget] = useState<Muhurat | null>(null);
  const [copyDate, setCopyDate] = useState("");

  function openCreate() {
    setEditing(null);
    setFormPoojaId("");
    setFormDate("");
    setFormSlots([{ ...EMPTY_SLOT }]);
    setFormNotes("");
    setFormActive(true);
    setDialogOpen(true);
  }

  function openEdit(muhurat: Muhurat) {
    setEditing(muhurat);
    setFormPoojaId(poojaId(muhurat.pooja));
    setFormDate(toDateInputValue(muhurat.date));
    setFormSlots(
      muhurat.slots.map((s) => ({ _id: s._id, startTime: s.startTime, endTime: s.endTime, capacity: s.capacity, isActive: s.isActive })),
    );
    setFormNotes(muhurat.notes ?? "");
    setFormActive(muhurat.isActive);
    setDialogOpen(true);
  }

  function updateSlot(index: number, patch: Partial<MuhuratSlotInput>) {
    setFormSlots((slots) => slots.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSlot(index: number) {
    setFormSlots((slots) => slots.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!formPoojaId || !formDate) {
      toast.error("Please select a Pooja and Date");
      return;
    }
    if (formSlots.length === 0) {
      toast.error("Add at least one Muhurat time slot");
      return;
    }
    const input = { pooja: formPoojaId, date: formDate, slots: formSlots, notes: formNotes || undefined, isActive: formActive };
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, input });
        toast.success("Muhurat schedule updated");
      } else {
        await createMutation.mutateAsync(input);
        toast.success("Muhurat schedule created");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(muhurat: Muhurat) {
    if (!confirm(`Delete Muhurat schedule for "${poojaLabel(muhurat.pooja)}" on ${formatDate(muhurat.date)}?`)) return;
    try {
      await deleteMutation.mutateAsync(muhurat._id);
      toast.success("Muhurat schedule deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleCopy() {
    if (!copyTarget || !copyDate) return;
    try {
      const created = await copyMutation.mutateAsync({ id: copyTarget._id, targetDates: [copyDate] });
      if (created.length === 0) toast.error("A schedule already exists for that date");
      else toast.success("Muhurat timings copied");
      setCopyTarget(null);
      setCopyDate("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Muhurat Management"
        description="Manage Muhurat timings per Pooja and Date. Each pooja can have its own schedule for a given date."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add Muhurat Schedule
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="w-56 space-y-1.5">
            <Label>Filter by Pooja</Label>
            <Select value={filterPoojaId || "all"} onValueChange={(v) => setFilterPoojaId(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Poojas</SelectItem>
                {poojas?.items.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48 space-y-1.5">
            <Label>Filter by Date</Label>
            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="w-56 space-y-1.5">
            <Label>Search</Label>
            <Input placeholder="Search by pooja name" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {(filterPoojaId || filterDate || search) && (
            <Button
              variant="ghost"
              onClick={() => {
                setFilterPoojaId("");
                setFilterDate("");
                setSearch("");
              }}
            >
              <X /> Clear
            </Button>
          )}
        </CardContent>
      </Card>

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
                  <TableHead>Pooja</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {muhurats?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No Muhurat schedules yet.
                    </TableCell>
                  </TableRow>
                )}
                {muhurats?.map((muhurat) => {
                  const totalBooked = muhurat.slots.reduce((sum, s) => sum + s.bookedCount, 0);
                  const totalCapacity = muhurat.slots.reduce((sum, s) => (s.capacity != null ? sum + s.capacity : sum), 0);
                  return (
                    <TableRow key={muhurat._id}>
                      <TableCell className="font-medium">{poojaLabel(muhurat.pooja)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(muhurat.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{muhurat.slots.length}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {totalBooked}
                        {totalCapacity > 0 ? ` / ${totalCapacity}` : ""}
                      </TableCell>
                      <TableCell>
                        <Badge variant={muhurat.isActive ? "default" : "outline"}>{muhurat.isActive ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => setCopyTarget(muhurat)} title="Copy to another date">
                          <Copy />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(muhurat)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(muhurat)}>
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Muhurat Schedule" : "New Muhurat Schedule"}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Pooja</Label>
                <Select value={formPoojaId} onValueChange={setFormPoojaId} disabled={!!editing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a pooja" />
                  </SelectTrigger>
                  <SelectContent>
                    {poojas?.items.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} disabled={!!editing} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Muhurat Time Slots</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => setFormSlots((s) => [...s, { ...EMPTY_SLOT }])}>
                  <Plus className="size-3.5" /> Add Slot
                </Button>
              </div>
              {formSlots.map((slot, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_0.7fr_auto_auto] items-end gap-2 rounded-lg border border-border p-2.5">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input type="time" value={slot.startTime} onChange={(e) => updateSlot(index, { startTime: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <Input type="time" value={slot.endTime} onChange={(e) => updateSlot(index, { endTime: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Capacity</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="∞"
                      value={slot.capacity ?? ""}
                      onChange={(e) => updateSlot(index, { capacity: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                  <label className="flex items-center gap-1.5 pb-2 text-xs">
                    <input type="checkbox" checked={slot.isActive ?? true} onChange={(e) => updateSlot(index, { isActive: e.target.checked })} />
                    Active
                  </label>
                  <Button type="button" variant="ghost" size="icon-sm" className="mb-0.5" onClick={() => removeSlot(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Input value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Internal notes for this schedule" />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
              Schedule Active
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="size-4 animate-spin" />}
              {editing ? "Save changes" : "Create schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!copyTarget} onOpenChange={(open) => !open && setCopyTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Copy Muhurat Timings</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Copy to Date</Label>
            <Input type="date" value={copyDate} onChange={(e) => setCopyDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleCopy} disabled={copyMutation.isPending || !copyDate}>
              {copyMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
