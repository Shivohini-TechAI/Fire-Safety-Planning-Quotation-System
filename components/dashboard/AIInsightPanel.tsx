"use client";
import { Sparkles } from "lucide-react";

// TODO: Replace static text with → POST https://api.anthropic.com/v1/messages
// Send recent BOQ data as context to get AI-generated insight summary

const chips = ["3 schools reviewed", "1 compliance alert", "Pending: C002", "HPE-01 export ready"];

export default function AIInsightPanel() {
  return (
    <div className="rounded-xl border border-[#ff7a1a]/25 bg-gradient-to-br from-[#11203e] to-[#0d1730] p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-[#ff9a4d]"/>
        <span className="text-xs font-bold text-[#ff9a4d] uppercase tracking-widest">AI Insight</span>
      </div>
      <p className="text-sm text-[#d9dce4] leading-relaxed">
        3 school BOQs uploaded this week —{" "}
        <strong className="text-white">C001 has a compliance gap</strong>{" "}
        (missing wet riser for G+3). Flat C002 estimation is ₹2.4L above benchmark.
        HPE-01 office layout looks complete and ready to export.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {chips.map(c => (
          <span key={c} className="text-xs px-3 py-1 rounded-full border border-[#ff7a1a]/30 text-[#ff9a4d] bg-[#ff7a1a]/8">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
