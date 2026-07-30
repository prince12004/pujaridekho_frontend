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
import { useDeletePooja, usePoojas } from "@/features/admin/api/use-poojas";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function PoojasListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePoojas({ search: search || undefined });
  const deleteMutation = useDeletePooja();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete pooja "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Pooja deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Poojas"
        description="Manage the poojas customers can browse and book on the website."
        actions={
          <Button asChild>
            <Link href="/admin/poojas/new">
              <Plus /> Add Pooja
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search poojas..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <TableHead>Category</TableHead>
                  <TableHead>Starting Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No poojas found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((pooja) => (
                  <TableRow key={pooja._id}>
                    <TableCell className="font-medium">{pooja.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeof pooja.category === "object" ? pooja.category?.name : "—"}
                    </TableCell>
                    <TableCell>₹{pooja.startingPrice.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={pooja.status === "Published" ? "default" : "outline"}>{pooja.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/poojas/${pooja._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(pooja._id, pooja.name)}>
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
