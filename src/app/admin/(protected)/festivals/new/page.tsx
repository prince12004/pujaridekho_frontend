"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { FestivalForm } from "@/features/admin/components/festival-form";

export default function NewFestivalPage() {
  return (
    <div>
      <AdminPageHeader title="Add Festival" description="Create a new festival pooja listing." />
      <FestivalForm />
    </div>
  );
}
