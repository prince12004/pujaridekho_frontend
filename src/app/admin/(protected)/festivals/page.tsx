"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteFestival, useFestivals } from "@/features/admin/api/use-festivals";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function FestivalsListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFestivals({ search: search || undefined });
  const deleteMutation = useDeleteFestival();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete festival "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Festival deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Festival Poojas"
        description="Manage festival-specific pooja packages and seasonal availability."
        actions={
          <Button asChild>
            <Link href="/admin/festivals/new">
              <Plus /> Add Festival
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search festivals..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <TableHead>Date</TableHead>
                  <TableHead>Starting Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No festivals yet.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((festival) => (
                  <TableRow key={festival._id}>
                    <TableCell className="font-medium">{festival.name}</TableCell>
                    <TableCell className="text-muted-foreground">{festival.dateLabel ?? "—"}</TableCell>
                    <TableCell>₹{festival.startingPrice.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={festival.status === "published" ? "default" : "outline"}>{festival.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/festivals/${festival._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(festival._id, festival.name)}>
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
    </div>
  );
}
