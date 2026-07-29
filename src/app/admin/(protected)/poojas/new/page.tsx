"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PoojaForm } from "@/features/admin/components/pooja-form";

export default function NewPoojaPage() {
  return (
    <div>
      <AdminPageHeader title="Add Pooja" description="Create a new pooja listing." />
      <PoojaForm />
    </div>
  );
}
