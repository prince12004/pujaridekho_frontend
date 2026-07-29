"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeletePandit, usePandits } from "@/features/admin/api/use-pandits";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function PanditsListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePandits({ search: search || undefined });
  const deleteMutation = useDeletePandit();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete pandit "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Pandit deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Pandits"
        description="Manage verified pandit profiles available for booking."
        actions={
          <Button asChild>
            <Link href="/admin/pandits/new">
              <Plus /> Add Pandit
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search pandits..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <TableHead>Pandit</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Cities</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No pandits found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((pandit) => (
                  <TableRow key={pandit._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarImage src={pandit.photo} alt={pandit.fullName} />
                          <AvatarFallback>{pandit.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{pandit.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{pandit.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{pandit.cities.join(", ") || "—"}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-brand-gold text-brand-gold" /> {pandit.rating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pandit.verificationStatus === "verified" ? "default" : "outline"}>
                        {pandit.verificationStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/pandits/${pandit._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(pandit._id, pandit.fullName)}>
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
