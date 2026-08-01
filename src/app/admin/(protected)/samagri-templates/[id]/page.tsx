"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { SamagriTemplateForm } from "@/features/admin/components/samagri-template-form";
import { useSamagriTemplate } from "@/features/admin/api/use-samagri-templates";

export default function EditSamagriTemplatePage() {
  const params = useParams<{ id: string }>();
  const { data: template, isLoading } = useSamagriTemplate(params.id);

  if (isLoading || !template) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${template.samagriTemplateName}`} description="Update this samagri template's items." />
      <SamagriTemplateForm template={template} />
    </div>
  );
}
