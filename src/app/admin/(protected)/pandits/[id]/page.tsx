"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PanditForm } from "@/features/admin/components/pandit-form";
import { usePandit } from "@/features/admin/api/use-pandits";

export default function EditPanditPage() {
  const params = useParams<{ id: string }>();
  const { data: pandit, isLoading } = usePandit(params.id);

  if (isLoading || !pandit) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${pandit.fullName}`} description="Update pandit profile and verification status." />
      <PanditForm pandit={pandit} />
    </div>
  );
}
