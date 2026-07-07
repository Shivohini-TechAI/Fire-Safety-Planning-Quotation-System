"use client";
import { useAuth } from "@/context/AuthContext";
import StatRectangle from "@/components/dashboard/StatRectangle";
import AIInsightPanel from "@/components/dashboard/AIInsightPanel";
import UploadedPlansSection from "@/components/dashboard/UploadedPlansSection";
import RecentQuotations from "@/components/dashboard/RecentQuotations";
import EquipmentSummary from "@/components/dashboard/EquipmentSummary";
import PageTransition from "@/components/ui/PageTransition";

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <PageTransition>
      <div className="p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-[#98a0b3] mt-1">
            {greeting}, <span className="text-white font-medium">{user?.name ?? "—"}</span>
            {user?.role && <span> · {user.role}</span>}
          </p>
        </div>
        <StatRectangle />
        <AIInsightPanel />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <UploadedPlansSection />
          <RecentQuotations />
        </div>
        <EquipmentSummary />
      </div>
    </PageTransition>
  );
}
