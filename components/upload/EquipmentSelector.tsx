"use client";
import { EQUIPMENT_LEGEND } from "@/types";

interface EquipmentSelectorProps {
  selected: string[];
  onChange: (codes: string[]) => void;
}

export default function EquipmentSelector({ selected, onChange }: EquipmentSelectorProps) {
  const toggle = (code: string) => {
    onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code]);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-2">
        Equipment Included (from drawing legend)
      </label>
      <div className="flex flex-wrap gap-2">
        {EQUIPMENT_LEGEND.map(item => {
          const active = selected.includes(item.code);
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => toggle(item.code)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-[#ff7a1a] border-[#ff7a1a] text-white font-medium"
                  : "bg-[#0a1228] border-[#1d3563] text-[#98a0b3] hover:border-[#ff7a1a]/50"
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: active ? "#fff" : item.swatchColor }} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
