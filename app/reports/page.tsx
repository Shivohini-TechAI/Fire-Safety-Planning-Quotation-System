"use client";
import { useState } from "react";
import { Download, Eye, FileStack, Loader2, X } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { getQuotationPdfUrl, parseReportDescription, Report } from "@/lib/reports";

function FullReportModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const parsed = parseReportDescription(report.description);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16294e]">
          <h2 className="text-lg font-bold text-white">{report.reportName}</h2>
          <button onClick={onClose} className="text-[#707892] hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-4 overflow-y-auto text-sm text-[#d9dce4] whitespace-pre-wrap leading-relaxed">
          {parsed.summary}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { data: reports = [], isLoading, isError } = useReports();
  const [viewing, setViewing] = useState<Report | null>(null);

  const readyCount = reports.filter((r) => r.quotationId).length;
  const pendingCount = reports.length - readyCount;

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">Reports</h1>
        <p className="text-sm text-[#98a0b3] mt-1">Generated BOQ cost estimation reports</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Reports", value: String(reports.length), color: "#1d3563" },
          { label: "Ready",         value: String(readyCount),     color: "#22c55e" },
          { label: "No Quotation Linked", value: String(pendingCount), color: "#ff7a1a" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0d1730] border border-[#16294e] rounded-xl p-4">
            <div className="text-xs text-[#707892] uppercase tracking-widest mb-2 font-semibold">{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#16294e]">
              {["Report ID", "Client / Project", "Building Type", "Compliance", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#707892] uppercase tracking-widest font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#707892]">
                  <Loader2 size={16} className="animate-spin inline mr-2" /> Loading reports…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#707892]">
                  Could not load reports — is the quotation service reachable?
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#707892]">
                  <FileStack size={20} className="inline mb-2 opacity-50" />
                  <p>No reports generated yet.</p>
                </td>
              </tr>
            ) : (
              reports.map((r, i) => {
                const pdfUrl = r.quotationId ? getQuotationPdfUrl(r.quotationId) : null;
                const parsed = parseReportDescription(r.description);
                return (
                  <tr key={r.id} className={`border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors ${i === reports.length - 1 ? "border-none" : ""}`}>
                    <td className="px-5 py-3.5 text-[#ff9a4d] text-xs whitespace-nowrap">RPT{String(r.id).padStart(3, "0")}</td>
                    <td className="px-5 py-3.5 text-white">
                      <button onClick={() => setViewing(r)} className="hover:text-[#ff9a4d] transition-colors text-left">
                        {parsed.projectName ?? r.reportName}
                        {parsed.clientId && <span className="block text-xs text-[#707892] font-normal">{parsed.clientId}</span>}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-[#98a0b3] text-xs capitalize">{parsed.buildingType ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#98a0b3] text-xs">
                      {parsed.complianceScore !== undefined ? parsed.complianceScore : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[#707892] text-xs whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap ${pdfUrl ? "bg-green-500/10 text-green-400" : "bg-[#ff7a1a]/15 text-[#ff9a4d]"}`}>
                        {pdfUrl ? "Ready" : "No quotation linked"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <a href={pdfUrl ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`transition-colors ${pdfUrl ? "text-[#707892] hover:text-blue-400" : "text-[#3a4260] cursor-not-allowed pointer-events-none"}`}
                          aria-label="Preview PDF"
                        >
                          <Eye size={14} />
                        </a>
                        <a href={pdfUrl ?? undefined}
                          download
                          className={`transition-colors ${pdfUrl ? "text-[#707892] hover:text-[#ff9a4d]" : "text-[#3a4260] cursor-not-allowed pointer-events-none"}`}
                          aria-label="Download PDF"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {viewing && <FullReportModal report={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}