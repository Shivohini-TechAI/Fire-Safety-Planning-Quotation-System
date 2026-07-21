"use client";
import { Users, FileStack, IndianRupee, ShieldAlert, RefreshCw } from "lucide-react";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { useProjects } from "@/hooks/useProjects";
import { useUploadedPlans } from "@/hooks/useUploadedPlans";
import { useQuotations } from "@/hooks/useQuotations";

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function StatRectangle() {
  const projects = useProjects();
  const plans = useUploadedPlans();
  const quotations = useQuotations();

  const loading = projects.isLoading || plans.isLoading || quotations.isLoading;

  const totalValue = (quotations.data ?? []).reduce((sum, q) => sum + q.totalCost, 0);

  const stats = [
    {
      label: "Total Clients",
      value: projects.data ? String(projects.data.length) : "—",
      sub: "Live from backend",
      icon: Users,
    },
    {
      label: "Plans Uploaded",
      value: plans.data ? String(plans.data.length) : "—",
      sub: "Live from backend",
      icon: FileStack,
    },
    {
      label: "Est. Total Value",
      value: quotations.data ? formatINR(totalValue) : "—",
      sub: `${quotations.data?.length ?? 0} quotations`,
      icon: IndianRupee,
    },
    {
      label: "Compliance Alerts",
      value: "—",
      sub: "Not tracked yet",
      icon: ShieldAlert,
    },
  ];

  const refetchAll = () => {
    projects.refetch();
    plans.refetch();
    quotations.refetch();
  };

  return (
    <div className="rounded-xl border border-red-900/40 bg-gradient-to-br from-[#1f0d10] to-[#0d1730] p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-red-300/80 uppercase tracking-widest">Summary</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d3563] text-white font-semibold">This Month</span>
          <button onClick={refetchAll} className="text-red-300/50 hover:text-red-300 transition-colors">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
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