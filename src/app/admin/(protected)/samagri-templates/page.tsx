"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteSamagriTemplate, useSamagriTemplates } from "@/features/admin/api/use-samagri-templates";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function SamagriTemplatesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSamagriTemplates({ search: search || undefined });
  const deleteMutation = useDeleteSamagriTemplate();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete samagri template "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Samagri template deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Samagri Templates"
        description="Manage the structured ritual-materials list bundled into each pooja's kit."
        actions={
          <Button asChild>
            <Link href="/admin/samagri-templates/new">
              <Plus /> Add Template
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <TableHead>Template Name</TableHead>
                  <TableHead>Linked Pooja</TableHead>
                  <TableHead>Included Items</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No samagri templates yet.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">{template.samagriTemplateName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeof template.pooja === "object" ? template.pooja.name : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{template.includedItems.length} item(s)</TableCell>
                    <TableCell>
                      ₹{template.estimatedSamagriCost.toLocaleString("en-IN")}
                      {template.estimatedSamagriMrp ? (
                        <span className="ml-1.5 text-xs text-muted-foreground line-through">
                          ₹{template.estimatedSamagriMrp.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/samagri-templates/${template._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(template._id, template.samagriTemplateName)}>
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
