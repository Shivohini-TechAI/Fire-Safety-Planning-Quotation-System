"use client";
import { useState } from "react";
import { Users, FileStack, IndianRupee, ShieldAlert, RefreshCw } from "lucide-react";
import { StatCardSkeleton } from "@/components/ui/Skeleton";

const stats = [
  { label: "Total Clients",     value: "24",   sub: "+3 this month",     icon: Users },
  { label: "BOQs Uploaded",     value: "61",   sub: "12 pending review", icon: FileStack },
  { label: "Est. Total Value",  value: "₹48L", sub: "Across all clients",icon: IndianRupee },
  { label: "Compliance Alerts", value: "4",    sub: "2 critical",        icon: ShieldAlert },
];

export default function StatRectangle() {
  const [loading, setLoading] = useState(false);
  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 1200); };

  return (
    <div className="rounded-xl border border-red-900/40 bg-gradient-to-br from-[#1f0d10] to-[#0d1730] p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-red-300/80 uppercase tracking-widest">Summary</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d3563] text-white font-semibold">This Month</span>
          <button onClick={refresh} className="text-red-300/50 hover:text-red-300 transition-colors">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""}/>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_,i) => <StatCardSkeleton key={i}/>)
          : stats.map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-red-800/40 bg-red-900/15 px-4 py-3 hover:bg-red-900/25 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-red-300/80 uppercase tracking-wide">{label}</span>
                <Icon size={13} className="text-red-300/60" />
              </div>
              <div className="text-xl font-bold text-red-200">{value}</div>
              <div className="text-[11px] text-red-300/60 mt-0.5">{sub}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
