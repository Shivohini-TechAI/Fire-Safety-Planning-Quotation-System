"use client";
import { useState } from "react";
import { FileCheck, ArrowRight, RefreshCw, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useQuotations } from "@/hooks/useQuotations";
import { Quotation } from "@/lib/quotations";

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function RecentQuotations() {
  const { data: quotations = [], isLoading, refetch, isRefetching } = useQuotations();
  const [selected, setSelected] = useState<Quotation | null>(null);

  const recent = quotations.slice(0, 4);

  return (
    <>
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Recent Quotations</span>
          <div className="flex items-center gap-2">
            <Link href="/quotations" className="text-xs text-[#707892] hover:text-[#ff9a4d] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={11}/>
            </Link>
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
            <p className="text-xs text-[#707892] text-center py-4">No quotations yet.</p>
          ) : (
            recent.map(q => (
              <div key={q.id} onClick={() => setSelected(q)}
                className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#ff7a1a]/40 hover:bg-[#16294e]/50 transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-[#ff7a1a]/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck size={14} className="text-[#ff9a4d]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-white font-medium truncate group-hover:text-[#ff9a4d] transition-colors">{q.projectName}</span>
                    <span className="text-xs text-green-400 font-mono font-medium flex-shrink-0">{formatINR(q.totalCost)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-[#707892]">QT{String(q.id).padStart(3, "0")} · {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-800/30">
                      {q.breakdown?.length ?? 0} items
                    </span>
                  </div>
                </div>
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
              <span className="text-sm font-semibold text-white">Quotation Details</span>
              <button onClick={() => setSelected(null)} className="text-[#707892] hover:text-white transition-colors">
                <X size={16}/>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#ff7a1a]/10 border border-[#ff7a1a]/20 flex items-center justify-center">
                <FileCheck size={18} className="text-[#ff9a4d]"/>
              </div>
              <div>
                <div className="text-sm text-white font-medium">{selected.projectName}</div>
                <div className="text-xs text-[#707892] mt-0.5">QT{String(selected.id).padStart(3, "0")}</div>
              </div>
            </div>
            <div className="space-y-0 text-xs">
              {[
                { label:"Equipment Cost",   value: formatINR(selected.equipmentCost),   color:"text-white" },
                { label:"Installation",     value: formatINR(selected.installationCost),color:"text-white" },
                { label:"Maintenance",      value: formatINR(selected.maintenanceCost), color:"text-white" },
                { label:"GST",              value: formatINR(selected.gst),             color:"text-white" },
                { label:"Total",            value: formatINR(selected.totalCost),       color:"text-green-400" },
                { label:"Items",            value: `${selected.breakdown?.length ?? 0} line items`, color:"text-white" },
                { label:"Created",          value: formatDistanceToNow(new Date(selected.createdAt), { addSuffix: true }), color:"text-white" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2.5 border-b border-[#16294e]/50 last:border-0">
                  <span className="text-[#707892]">{r.label}</span>
                  <span className={`font-medium ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <a href={`${process.env.NEXT_PUBLIC_QUOTATION_API_BASE_URL}/quotations/${selected.id}/pdf`}
              target="_blank" rel="noopener noreferrer"
              className="mt-5 block text-center w-full bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
              View PDF
            </a>
          </div>
        </div>
      )}
    </>
  );
}