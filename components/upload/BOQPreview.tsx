"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Sample BOQ rows built from the equipment in the HPE Fire Fighting Layout drawing
const PREVIEW_ROWS = [
  { eq: "Pendant Concealed Sprinkler", code: "PCS",   qty: 86, unit: "Nos", rate: "₹650",    total: "₹55,900" },
  { eq: "Upright Sprinkler",           code: "US",    qty: 14, unit: "Nos", rate: "₹620",    total: "₹8,680" },
  { eq: "Fire Hose Cabinet",           code: "FHC",   qty: 4,  unit: "Set", rate: "₹18,500", total: "₹74,000" },
  { eq: "Dry Powder 4kg Extinguisher", code: "FE-01", qty: 12, unit: "Nos", rate: "₹2,200",  total: "₹26,400" },
  { eq: "CO2 5kg Extinguisher",        code: "FE-02", qty: 6,  unit: "Nos", rate: "₹3,400",  total: "₹20,400" },
  { eq: "Zone Control Valve",          code: "ZCV",   qty: 3,  unit: "Set", rate: "₹9,800",  total: "₹29,400" },
];

export default function BOQPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#11203e] transition-colors"
      >
        <span>Sample BOQ Preview — HPE Office Fire Fighting Layout</span>
        {open ? <ChevronUp size={16} className="text-[#707892]" /> : <ChevronDown size={16} className="text-[#707892]" />}
      </button>

      {open && (
        <div className="overflow-x-auto border-t border-[#16294e]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#16294e]">
                {["Equipment", "Code", "Qty", "Unit", "Unit Rate", "Total"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[#707892] uppercase tracking-widest text-[10px] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PREVIEW_ROWS.map((r, i) => (
                <tr key={i} className="border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors">
                  <td className="px-4 py-2.5 text-white">{r.eq}</td>
                  <td className="px-4 py-2.5 text-[#ff9a4d] font-medium">{r.code}</td>
                  <td className="px-4 py-2.5 text-[#d9dce4]">{r.qty}</td>
                  <td className="px-4 py-2.5 text-[#707892]">{r.unit}</td>
                  <td className="px-4 py-2.5 text-amber-400">{r.rate}</td>
                  <td className="px-4 py-2.5 text-green-400 font-semibold">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
