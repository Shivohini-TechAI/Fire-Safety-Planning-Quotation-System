import { useQuery } from "@tanstack/react-query";
import { fetchEquipment } from "@/lib/equipment";

export function useEquipment() {
  return useQuery({ queryKey: ["equipment"], queryFn: fetchEquipment });
}