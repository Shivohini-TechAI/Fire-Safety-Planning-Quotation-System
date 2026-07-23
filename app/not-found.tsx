"use client";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#060b18] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ff7a1a]/15 border border-[#ff7a1a]/25 flex items-center justify-center mx-auto mb-6">
          <Flame size={28} className="text-[#ff9a4d]"/>
        </div>
        <div className="text-7xl font-bold text-[#1d3563] mb-4 tracking-tight">404</div>
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-sm text-[#707892] mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20 mx-auto">
          <ArrowLeft size={15}/> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
