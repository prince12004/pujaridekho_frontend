"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PoojaForm } from "@/features/admin/components/pooja-form";
import { usePooja } from "@/features/admin/api/use-poojas";

export default function EditPoojaPage() {
  const params = useParams<{ id: string }>();
  const { data: pooja, isLoading } = usePooja(params.id);

  if (isLoading || !pooja) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${pooja.name}`} description="Update pooja details, packages and samagri." />
      <PoojaForm pooja={pooja} />
    </div>
  );
}
