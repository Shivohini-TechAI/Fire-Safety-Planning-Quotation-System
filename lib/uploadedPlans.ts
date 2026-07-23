import quotationApi from "./quotationApi";

export interface UploadedPlan {
  id: number;
  fileName: string;
  uploadedAt: string;
  quotationId: number | null;
}

interface UploadedPlansResponse {
  success: boolean;
  data: UploadedPlan[];
}

interface UploadPlanResponse {
  success: boolean;
  data: UploadedPlan & {
    uploadedFile: { originalName: string; storedName: string; size: number; path: string } | null;
  };
}

export async function fetchUploadedPlans(): Promise<UploadedPlan[]> {
  const res = await quotationApi.get<UploadedPlansResponse>("/uploaded-plans");
  return res.data.data;
}

export async function uploadPlan(file: File): Promise<UploadPlanResponse["data"]> {
  const formData = new FormData();
  formData.append("planFile", file);

  const res = await quotationApi.post<UploadPlanResponse>("/uploaded-plans", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}