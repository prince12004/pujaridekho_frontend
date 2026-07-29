"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { ProductForm } from "@/features/admin/components/product-form";
import { useProduct } from "@/features/admin/api/use-products";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(params.id);

  if (isLoading || !product) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${product.name}`} description="Update product details and pricing." />
      <ProductForm product={product} />
    </div>
  );
}
