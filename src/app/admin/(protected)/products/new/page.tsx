"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { ProductForm } from "@/features/admin/components/product-form";

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a new shop product." />
      <ProductForm />
    </div>
  );
}
