import { useQuery } from "@tanstack/react-query";
import { crmApiClient } from "@/lib/crm-api-client";

export interface CrmActivityLog {
  id: string;
  inquiryId: string;
  salesPersonId: string;
  note: string;
  audioBase64: string | null;
  createdAt: string;
  isConversion: boolean;
  isReassignment: boolean;
  isRejection: boolean;
}

export function useCrmActivityLogs(inquiryId: string | undefined) {
  return useQuery({
    queryKey: ["crm", "activity-logs", inquiryId],
    enabled: Boolean(inquiryId),
    queryFn: async () => {
      const res = await crmApiClient.get<{ data: CrmActivityLog[] }>("/crm-activity-logs", {
        params: { inquiryId },
      });
      return res.data.data;
    },
  });
}
