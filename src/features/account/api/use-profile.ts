import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyProfile {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  preferredLanguage?: string;
  city?: string;
  photo?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  preferredLanguage?: string;
  city?: string;
  photo?: string;
}

export function useMyProfile() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyProfile }>("/profile");
      return res.data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await customerApiClient.patch<{ data: MyProfile }>("/profile", input);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["account", "profile"], data);
    },
  });
}
