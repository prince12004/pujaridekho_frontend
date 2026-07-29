import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface KundliPlanet {
  planet: string;
  siderealLongitude: number;
  rashi: string;
  nakshatra: string;
  pada: number;
}

export interface MyKundliRecord {
  _id: string;
  personName: string;
  dob: string;
  tob: string;
  place: string;
  ascendant: { rashi: string; siderealLongitude: number };
  planets: KundliPlanet[];
  moonRashi: string;
  moonNakshatra: string;
  moonPada: number;
  sunRashi: string;
  ayanamsa: number;
  createdAt: string;
}

export interface GenerateKundliInput {
  personName: string;
  dob: string;
  tob: string;
  place: string;
}

export function useMyKundlis() {
  return useQuery({
    queryKey: ["account", "kundlis"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyKundliRecord[] }>("/kundli");
      return res.data.data;
    },
  });
}

export function useMyKundli(id: string | undefined) {
  return useQuery({
    queryKey: ["account", "kundli", id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyKundliRecord }>(`/kundli/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useGenerateKundli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: GenerateKundliInput) => {
      const res = await customerApiClient.post<{ data: MyKundliRecord }>("/kundli", input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "kundlis"] });
    },
  });
}
