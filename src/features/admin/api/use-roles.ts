import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
}

export interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: { _id: string; name: string } | string;
  status: "active" | "suspended";
  lastLoginAt?: string;
}

export function usePermissionCatalog() {
  return useQuery({
    queryKey: ["admin", "permission-catalog"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: { permissions: string[]; wildcard: string } }>("/roles/permissions");
      return res.data.data;
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Role[] }>("/roles");
      return res.data.data;
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; permissions: string[] }) => {
      const res = await adminApiClient.post("/roles", input);
      return res.data.data as Role;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "roles"] }),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "admin-users"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: AdminUserItem[] }>("/roles/admin-users");
      return res.data.data;
    },
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; email: string; password: string; role: string }) => {
      const res = await adminApiClient.post("/roles/admin-users", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "admin-users"] }),
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "suspended" }) => {
      const res = await adminApiClient.patch(`/roles/admin-users/${id}/status`, { status });
      return res.data.data as AdminUserItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "admin-users"] }),
  });
}
