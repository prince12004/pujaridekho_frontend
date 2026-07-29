"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PanditForm } from "@/features/admin/components/pandit-form";

export default function NewPanditPage() {
  return (
    <div>
      <AdminPageHeader title="Add Pandit" description="Create a new pandit profile." />
      <PanditForm />
    </div>
  );
}
