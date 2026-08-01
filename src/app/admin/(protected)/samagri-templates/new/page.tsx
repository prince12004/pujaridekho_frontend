"use client";

import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SamagriTemplateForm } from "@/features/admin/components/samagri-template-form";

export default function NewSamagriTemplatePage() {
  return (
    <div>
      <AdminPageHeader title="Add Samagri Template" description="Create a new structured samagri list for a pooja." />
      <SamagriTemplateForm />
    </div>
  );
}
