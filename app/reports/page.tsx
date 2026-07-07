"use client";
import { Download, Eye } from "lucide-react";

const REPORTS = [
  { id: "RPT001", client: "C001",   name: "Sunrise School — Fire Safety BOQ",   date: "28 May 2026", type: "School",       status: "Ready",      size: "142 KB" },
  { id: "RPT002", client: "C002",   name: "Greenview Apartments BOQ Estimate",  date: "27 May 2026", type: "Flat (G+7)",   status: "Processing", size: "—"      },
  { id: "RPT003", client: "HPE-01", name: "HPE Office Fire Fighting Layout BOQ",date: "26 May 2026", type: "Office (HPE)", status: "Ready",      size: "198 KB" },
  { id: "RPT004", client: "C005",   name: "Delhi Model School — Full Report",   date: "22 May 2026", type: "School",       status: "Ready",      size: "210 KB" },
];

const statusColor: Record<string, string> = {
  Ready:      "bg-green-500/10 text-green-400",
  Processing: "bg-[#ff7a1a]/15 text-[#ff9a4d]",
};

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">Reports</h1>
        <p className="text-sm text-[#98a0b3] mt-1">Generated BOQ cost estimation reports</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Reports", value: "4", color: "#1d3563" },
          { label: "Ready",         value: "3", color: "#22c55e" },
          { label: "Processing",    value: "1", color: "#ff7a1a" },
        ].map(s => (
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
              {["Report ID", "Client", "Report Name", "Date", "Type", "Status", "Size", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#707892] uppercase tracking-widest font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r, i) => (
              <tr key={r.id} className={`border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors ${i === REPORTS.length - 1 ? "border-none" : ""}`}>
                <td className="px-5 py-3.5 text-[#ff9a4d] text-xs">{r.id}</td>
                <td className="px-5 py-3.5 text-[#98a0b3] text-xs">{r.client}</td>
                <td className="px-5 py-3.5 text-white">{r.name}</td>
                <td className="px-5 py-3.5 text-[#707892] text-xs">{r.date}</td>
                <td className="px-5 py-3.5 text-[#98a0b3] text-xs">{r.type}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColor[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3.5 text-[#707892] text-xs">{r.size}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <button className="text-[#707892] hover:text-blue-400 transition-colors"><Eye size={14} /></button>
                    <button className="text-[#707892] hover:text-[#ff9a4d] transition-colors"><Download size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
