"use client";
import { Loader2 } from "lucide-react";
import { useEquipment } from "@/hooks/useEquipment";

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function EquipmentSummary() {
  const { data: equipment = [], isLoading } = useEquipment();

  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">Equipment Catalog</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">{equipment.length} items</span>
      </div>
      {isLoading ? (
        <div className="text-xs text-[#707892] flex items-center gap-2 py-4 justify-center">
          <Loader2 size={13} className="animate-spin" /> Loading…
        </div>
      ) : equipment.length === 0 ? (
        <p className="text-xs text-[#707892] text-center py-4">No equipment records found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {equipment.map(item => (
            <div key={item.id} className="bg-[#11203e] border border-[#16294e] rounded-xl p-3 flex flex-col gap-2">
              <div className="text-xs text-white font-medium leading-snug">{item.name}</div>
              <div className="text-[10px] text-[#707892] capitalize">{item.type}</div>
              <div className="border-t border-[#16294e] pt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#5a6275]">Unit Price</span>
                <span className="text-xs text-white font-bold">{formatINR(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}