import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface TeamMemberAdmin {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  group: "leadership" | "advisor";
  photo?: string;
  photoPosition: "top" | "center" | "bottom";
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
}

export type TeamMemberInput = Partial<Omit<TeamMemberAdmin, "_id" | "sortOrder">>;

const KEY = ["admin", "team"];

export function useTeamMembers() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await adminApiClient.get<{ data: TeamMemberAdmin[] }>("/team")).data.data,
  });
}

function useTeamMutation<T>(fn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export const useCreateTeamMember = () =>
  useTeamMutation((input: TeamMemberInput) => adminApiClient.post("/team", input));

export const useUpdateTeamMember = () =>
  useTeamMutation(({ id, input }: { id: string; input: TeamMemberInput }) => adminApiClient.patch(`/team/${id}`, input));

export const useDeleteTeamMember = () => useTeamMutation((id: string) => adminApiClient.delete(`/team/${id}`));

export const useReorderTeam = () => useTeamMutation((ids: string[]) => adminApiClient.put("/team/order", { ids }));
