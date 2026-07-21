import quotationApi from "./quotationApi";

export interface QuotationItemInput {
  equipmentId: number;
  quantity: number;
}

export interface BreakdownRow {
  equipmentId: number;
  name: string;
  type: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface QuotationTotals {
  projectName?: string;
  equipmentCost: number;
  installationCost: number;
  maintenanceCost: number;
  gst: number;
  totalCost: number;
  breakdown: BreakdownRow[];
}

export interface Quotation {
  id: number;
  projectName: string;
  equipmentCost: number;
  installationCost: number;
  maintenanceCost: number;
  gst: number;
  totalCost: number;
  breakdown: BreakdownRow[];
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function calculateQuotationPreview(
  projectName: string,
  items: QuotationItemInput[]
): Promise<QuotationTotals> {
  const res = await quotationApi.post<ApiResponse<QuotationTotals>>("/quotations/calculate", {
    projectName,
    items,
  });
  return res.data.data;
}

export async function createQuotation(
  projectName: string,
  items: QuotationItemInput[]
): Promise<{ quotation: Quotation; report: { id: number; reportName: string } }> {
  const res = await quotationApi.post<ApiResponse<{ quotation: Quotation; report: { id: number; reportName: string } }>>(
    "/quotations",
    { projectName, items }
  );
  return res.data.data;
}

export async function fetchQuotations(): Promise<Quotation[]> {
  const res = await quotationApi.get<ApiResponse<Quotation[]>>("/quotations");
  return res.data.data;
}

export function getQuotationPdfUrl(quotationId: number): string {
  return `${process.env.NEXT_PUBLIC_QUOTATION_API_BASE_URL}/quotations/${quotationId}/pdf`;
}