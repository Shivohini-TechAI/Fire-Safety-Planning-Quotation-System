"use client";
import { useState } from "react";
import { FileSpreadsheet, FileText, CheckCircle, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { FileRowSkeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

const PLANS = [
  { id:1, name:"hpe_office_bu_floor.xlsx", size:"57 KB", type:"Office (HPE)", status:"done",       uploadedAt: new Date(Date.now()-2*60*60*1000), rows:22  },
  { id:2, name:"school_boq_C001.xlsx",      size:"42 KB", type:"School",       status:"done",       uploadedAt: new Date(Date.now()-5*60*60*1000), rows:14  },
  { id:3, name:"flat_boq_C002.csv",          size:"18 KB", type:"Flat (G+7)",  status:"processing", uploadedAt: new Date(Date.now()-24*60*60*1000), rows:null },
  { id:4, name:"house_boq_C003.xlsx",        size:"9 KB",  type:"House",        status:"review",     uploadedAt: new Date(Date.now()-3*24*60*60*1000), rows:6 },
];

const statusMap = {
  done:       { icon: <CheckCircle size={13} className="text-green-400"/>, label:"Done",       cls:"text-green-400"  },
  processing: { icon: <Clock       size={13} className="text-[#ff9a4d]"/>, label:"Processing", cls:"text-[#ff9a4d]" },
  review:     { icon: <AlertCircle size={13} className="text-amber-400"/>, label:"Review",     cls:"text-amber-400"  },
};

interface DrawerFile { name:string; size:string; type:string; status:string; rows:number|null; uploadedAt:Date }

export default function UploadedPlansSection() {
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState<DrawerFile|null>(null);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <>
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Uploaded Plans</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">{PLANS.length} files</span>
            <button onClick={refresh} className="text-[#707892] hover:text-white transition-colors">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""}/>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {loading
            ? Array(4).fill(0).map((_,i) => <FileRowSkeleton key={i}/>)
            : PLANS.map(f => {
              const s = statusMap[f.status as keyof typeof statusMap];
              return (
                <div key={f.id} onClick={() => setSelected(f)}
                  className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#ff7a1a]/40 hover:bg-[#16294e]/50 transition-all duration-200 group">
                  <div className="text-[#707892] flex-shrink-0">
                    {f.name.endsWith(".csv") ? <FileText size={18}/> : <FileSpreadsheet size={18}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate group-hover:text-[#ff9a4d] transition-colors">{f.name}</span>
                      {s.icon}
                    </div>
                    <div className="text-xs text-[#707892] mt-0.5">
                      {f.size} · {f.type} · {formatDistanceToNow(f.uploadedAt, {addSuffix:true})}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold ${s.cls}`}>{s.label}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* File detail drawer */}
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
                <div className="text-sm text-white font-medium">{selected.name}</div>
                <div className="text-xs text-[#707892] mt-0.5">{selected.size} · {selected.type}</div>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label:"Status",    value: selected.status,                                        color:"text-green-400" },
                { label:"Rows",      value: selected.rows ? `${selected.rows} items detected` : "Processing…", color:"text-white" },
                { label:"Uploaded",  value: formatDistanceToNow(selected.uploadedAt,{addSuffix:true}), color:"text-white" },
                { label:"Building",  value: selected.type,                                          color:"text-[#ff9a4d]" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-[#16294e]/50 last:border-0">
                  <span className="text-[#707892]">{r.label}</span>
                  <span className={`font-medium capitalize ${r.color}`}>{r.value}</span>
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
