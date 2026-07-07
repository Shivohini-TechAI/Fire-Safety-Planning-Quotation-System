"use client";
import { useState } from "react";
import { FileCheck, ArrowRight, RefreshCw, X } from "lucide-react";
import { QuotationRowSkeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

const QUOTATIONS = [
  { id:"QT-001", client:"HPE-01", name:"HPE Office — BU Floor",    amount:"₹2,77,380", date: new Date(Date.now()-2*24*60*60*1000), status:"Approved", items:8 },
  { id:"QT-002", client:"C001",   name:"Sunrise Public School",     amount:"₹1,82,000", date: new Date(Date.now()-5*24*60*60*1000), status:"Pending",  items:6 },
  { id:"QT-003", client:"C005",   name:"Delhi Model School",        amount:"₹2,45,000", date: new Date(Date.now()-8*24*60*60*1000), status:"Approved", items:9 },
  { id:"QT-004", client:"C002",   name:"Greenview Apartments G+7",  amount:"₹4,20,000", date: new Date(Date.now()-12*24*60*60*1000),status:"Draft",    items:5 },
];

const statusStyle: Record<string,string> = {
  Approved: "bg-green-500/10 text-green-400 border-green-800/30",
  Pending:  "bg-[#ff7a1a]/15 text-[#ff9a4d] border-[#ff7a1a]/25",
  Draft:    "bg-[#1d3563]/40 text-[#98a0b3] border-[#1d3563]",
};

interface QuotDetail { id:string; client:string; name:string; amount:string; date:Date; status:string; items:number }

export default function RecentQuotations() {
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState<QuotDetail|null>(null);

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 1200); };

  return (
    <>
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Recent Quotations</span>
          <div className="flex items-center gap-2">
            <button className="text-xs text-[#707892] hover:text-[#ff9a4d] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={11}/>
            </button>
            <button onClick={refresh} className="text-[#707892] hover:text-white transition-colors">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""}/>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {loading
            ? Array(4).fill(0).map((_,i) => <QuotationRowSkeleton key={i}/>)
            : QUOTATIONS.map(q => (
              <div key={q.id} onClick={() => setSelected(q)}
                className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#ff7a1a]/40 hover:bg-[#16294e]/50 transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-[#ff7a1a]/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck size={14} className="text-[#ff9a4d]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-white font-medium truncate group-hover:text-[#ff9a4d] transition-colors">{q.name}</span>
                    <span className="text-xs text-green-400 font-mono font-medium flex-shrink-0">{q.amount}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-[#707892]">{q.id} · {formatDistanceToNow(q.date,{addSuffix:true})}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusStyle[q.status]}`}>{q.status}</span>
                  </div>
                </div>
              </div>
            ))}
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
                <div className="text-sm text-white font-medium">{selected.name}</div>
                <div className="text-xs text-[#707892] mt-0.5">{selected.id} · Client {selected.client}</div>
              </div>
            </div>
            <div className="space-y-0 text-xs">
              {[
                { label:"Amount",  value: selected.amount,    color:"text-green-400" },
                { label:"Status",  value: selected.status,    color:"text-[#ff9a4d]" },
                { label:"Items",   value: `${selected.items} line items`, color:"text-white" },
                { label:"Created", value: formatDistanceToNow(selected.date,{addSuffix:true}), color:"text-white" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2.5 border-b border-[#16294e]/50 last:border-0">
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
