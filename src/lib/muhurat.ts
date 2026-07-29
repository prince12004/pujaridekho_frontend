import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface MuhuratSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  timeRange: string;
}

// Muhurat timings are admin-managed per Pooja + Date (see /admin/muhurats) —
// there is no global fallback pool. An empty result means no schedule exists
// for this pooja on this date, and the booking widget shows
// "No Muhurat Available for the Selected Date."
export function useMuhuratsForDate(poojaSlug: string | undefined, dateStr: string) {
  return useQuery({
    queryKey: ["muhurats", poojaSlug, dateStr],
    queryFn: async () => {
      const res = await apiClient.get<{ data: MuhuratSlot[] }>("/muhurats", { params: { poojaSlug, date: dateStr } });
      return res.data.data;
    },
    enabled: !!poojaSlug && !!dateStr,
  });
}
