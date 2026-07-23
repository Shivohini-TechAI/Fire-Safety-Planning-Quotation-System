"use client";
import { useState } from "react";
import { FileSpreadsheet, CheckCircle, Clock, RefreshCw, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUploadedPlans } from "@/hooks/useUploadedPlans";
import { UploadedPlan } from "@/lib/uploadedPlans";

export default function UploadedPlansSection() {
  const { data: plans = [], isLoading, refetch, isRefetching } = useUploadedPlans();
  const [selected, setSelected] = useState<UploadedPlan | null>(null);

  const recent = plans.slice(0, 4);

  return (
    <>
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Uploaded Plans</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">{plans.length} files</span>
            <button onClick={() => refetch()} className="text-[#707892] hover:text-white transition-colors">
              <RefreshCw size={13} className={isRefetching ? "animate-spin" : ""}/>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {isLoading ? (
            <div className="text-xs text-[#707892] flex items-center gap-2 py-4 justify-center">
              <Loader2 size={13} className="animate-spin" /> Loading…
            </div>
          ) : recent.length === 0 ? (
            <p className="text-xs text-[#707892] text-center py-4">No plans uploaded yet.</p>
          ) : (
            recent.map(f => (
              <div key={f.id} onClick={() => setSelected(f)}
                className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#ff7a1a]/40 hover:bg-[#16294e]/50 transition-all duration-200 group">
                <div className="text-[#707892] flex-shrink-0">
                  <FileSpreadsheet size={18}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium truncate group-hover:text-[#ff9a4d] transition-colors">{f.fileName}</span>
                    {f.quotationId ? <CheckCircle size={13} className="text-green-400"/> : <Clock size={13} className="text-[#ff9a4d]"/>}
                  </div>
                  <div className="text-xs text-[#707892] mt-0.5">
                    {formatDistanceToNow(new Date(f.uploadedAt), { addSuffix: true })}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold ${f.quotationId ? "text-green-400" : "text-[#ff9a4d]"}`}>
                  {f.quotationId ? "Linked" : "Unlinked"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <div className="relative bg-[#0d1730] border border-[#16294e] rounded-2xl p-6 w-full max-w-md shadow-2xl z-10"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-white">File Details</span>
              <button onClick={() => setSelected(null)} className="text-[#707892] hover:text-white transition-colors">
                <X size={16}/>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#ff7a1a]/10 border border-[#ff7a1a]/20 flex items-center justify-center">
                <FileSpreadsheet size={18} className="text-[#ff9a4d]"/>
              </div>
              <div>
                <div className="text-sm text-white font-medium">{selected.fileName}</div>
                <div className="text-xs text-[#707892] mt-0.5">File ID #{selected.id}</div>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label:"Uploaded", value: formatDistanceToNow(new Date(selected.uploadedAt), { addSuffix: true }), color:"text-white" },
                { label:"Quotation Link", value: selected.quotationId ? `Linked to QT${String(selected.quotationId).padStart(3,"0")}` : "Not linked yet", color: selected.quotationId ? "text-green-400" : "text-[#ff9a4d]" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-[#16294e]/50 last:border-0">
                  <span className="text-[#707892]">{r.label}</span>
                  <span className={`font-medium ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              className="mt-5 w-full bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}