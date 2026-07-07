"use client";
import { EQUIPMENT_LEGEND } from "@/types";

// Equipment usage counts — TODO: Replace with → GET /api/equipment/summary (Member 4's API)
const USAGE: Record<string, { qty: number; lastClient: string }> = {
  "PCS":   { qty: 86,  lastClient: "HPE-01" },
  "US":    { qty: 14,  lastClient: "HPE-01" },
  "FHC":   { qty: 16,  lastClient: "C001"   },
  "FE-01": { qty: 48,  lastClient: "C005"   },
  "FE-02": { qty: 24,  lastClient: "C001"   },
  "ZCV":   { qty: 9,   lastClient: "HPE-01" },
  "FP":    { qty: 220, lastClient: "C005"   },
  "FAC":   { qty: 180, lastClient: "HPE-01" },
};

export default function EquipmentSummary() {
  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">Equipment Summary</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">All Projects</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {EQUIPMENT_LEGEND.map(item => {
          const usage = USAGE[item.code];
          return (
            <div key={item.code} className="bg-[#11203e] border border-[#16294e] rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.swatchColor }}/>
                <span className="text-[10px] text-[#ff9a4d] font-mono font-semibold">{item.code}</span>
              </div>
              <div className="text-xs text-white font-medium leading-snug">{item.label}</div>
              <div className="text-[10px] text-[#707892]">{item.category}</div>
              <div className="border-t border-[#16294e] pt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#5a6275]">Total used</span>
                <span className="text-xs text-white font-bold">{usage?.qty ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5a6275]">Last client</span>
                <span className="text-[10px] text-[#ff9a4d] font-mono">{usage?.lastClient ?? "—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
