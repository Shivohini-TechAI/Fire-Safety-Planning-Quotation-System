import quotationApi from "./quotationApi";

export interface Report {
  id: number;
  reportName: string;
  description: string;
  quotationId: number | null;
  createdAt: string;
}

interface ReportsResponse {
  success: boolean;
  data: Report[];
}

export async function fetchReports(): Promise<Report[]> {
  const res = await quotationApi.get<ReportsResponse>("/reports");
  return res.data.data;
}

export function getQuotationPdfUrl(quotationId: number): string {
  return `${process.env.NEXT_PUBLIC_QUOTATION_API_BASE_URL}/quotations/${quotationId}/pdf`;
}

export interface ParsedReportMeta {
  summary: string;
  projectName?: string;
  clientId?: string;
  buildingType?: string;
  complianceScore?: number | string;
  fullText: string;
}

export function parseReportDescription(description: string): ParsedReportMeta {
  const marker = "__REPORT_METADATA_START__";
  const markerIndex = description.indexOf(marker);

  if (markerIndex === -1) {
    return { summary: description, fullText: description };
  }

  const humanText = description.slice(0, markerIndex).trim();
  const jsonPart = description.slice(markerIndex + marker.length).trim();

  try {
    const meta = JSON.parse(jsonPart);
    return {
      summary: humanText,
      projectName: meta.projectName,
      clientId: meta.clientId,
      buildingType: meta.buildingType,
      complianceScore: meta.complianceScore,
      fullText: description,
    };
  } catch {
    return { summary: humanText, fullText: description };
  }
}