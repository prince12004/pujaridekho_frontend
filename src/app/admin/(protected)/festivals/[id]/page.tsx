"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { FestivalForm } from "@/features/admin/components/festival-form";
import { useFestival } from "@/features/admin/api/use-festivals";

export default function EditFestivalPage() {
  const params = useParams<{ id: string }>();
  const { data: festival, isLoading } = useFestival(params.id);

  if (isLoading || !festival) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title={`Edit — ${festival.name}`} description="Update festival details and pricing." />
      <FestivalForm festival={festival} />
    </div>
  );
}
