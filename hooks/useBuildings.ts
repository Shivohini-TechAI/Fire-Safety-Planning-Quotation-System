import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBuildingsForProject, createBuilding, NewBuildingInput } from "@/lib/buildings";

export function useBuildings(projectId: number) {
  return useQuery({
    queryKey: ["buildings", projectId],
    queryFn: () => fetchBuildingsForProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateBuilding(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewBuildingInput) => createBuilding(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings", projectId] });
    },
  });
}