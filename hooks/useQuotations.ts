import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchQuotations,
  calculateQuotationPreview,
  createQuotation,
  QuotationItemInput,
} from "@/lib/quotations";

export function useQuotations() {
  return useQuery({ queryKey: ["quotations"], queryFn: fetchQuotations });
}

export function useCalculateQuotation() {
  return useMutation({
    mutationFn: ({ projectName, items }: { projectName: string; items: QuotationItemInput[] }) =>
      calculateQuotationPreview(projectName, items),
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectName, items }: { projectName: string; items: QuotationItemInput[] }) =>
      createQuotation(projectName, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}