import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUploadedPlans, uploadPlan } from "@/lib/uploadedPlans";

export function useUploadedPlans() {
  return useQuery({ queryKey: ["uploadedPlans"], queryFn: fetchUploadedPlans });
}

export function useUploadPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPlan(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploadedPlans"] });
    },
  });
}