import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFloorsForBuilding, createFloor, NewFloorInput } from "@/lib/floors";

export function useFloors(buildingId: number) {
  return useQuery({
    queryKey: ["floors", buildingId],
    queryFn: () => fetchFloorsForBuilding(buildingId),
    enabled: !!buildingId,
  });
}

export function useCreateFloor(buildingId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewFloorInput) => createFloor(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors", buildingId] });
    },
  });
}