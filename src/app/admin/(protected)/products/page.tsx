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
import { useDeleteProduct, useProducts } from "@/features/admin/api/use-products";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function ProductsListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useProducts({ search: search || undefined });
  const deleteMutation = useDeleteProduct();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage puja essentials and shop products."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus /> Add Product
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeof product.category === "object" ? product.category?.name : "—"}
                    </TableCell>
                    <TableCell>₹{product.sellingPrice.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-muted-foreground">{product.stockQuantity}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "Published" ? "default" : "outline"}>{product.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/products/${product._id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(product._id, product.name)}>
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
