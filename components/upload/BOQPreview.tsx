"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

interface BOQRow {
  id: number;
  eq: string;
  code: string;
  qty: number;
  unit: string;
  rate: number;
}

// Sample BOQ rows built from the equipment in the HPE Fire Fighting Layout drawing
const INITIAL_ROWS: BOQRow[] = [
  { id: 1, eq: "Pendant Concealed Sprinkler", code: "PCS",   qty: 86, unit: "Nos", rate: 650 },
  { id: 2, eq: "Upright Sprinkler",           code: "US",    qty: 14, unit: "Nos", rate: 620 },
  { id: 3, eq: "Fire Hose Cabinet",           code: "FHC",   qty: 4,  unit: "Set", rate: 18500 },
  { id: 4, eq: "Dry Powder 4kg Extinguisher", code: "FE-01", qty: 12, unit: "Nos", rate: 2200 },
  { id: 5, eq: "CO2 5kg Extinguisher",        code: "FE-02", qty: 6,  unit: "Nos", rate: 3400 },
  { id: 6, eq: "Zone Control Valve",          code: "ZCV",   qty: 3,  unit: "Set", rate: 9800 },
];

// Starting tax rate -- UAE VAT is 5%, but fully editable, not a fixed rule
const DEFAULT_TAX_RATE = 5;

const formatAED = (n: number) =>
  `AED ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

function EditableCell({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`w-full bg-transparent outline-none rounded px-1.5 py-0.5 -mx-1.5 transition-colors
        hover:bg-[#16294e]/60 focus:bg-[#16294e] focus:ring-1 focus:ring-[#ff7a1a]/50 ${className}`}
    />
  );
}

export default function BOQPreview() {
  const [open, setOpen] = useState(true);
  const [rows, setRows] = useState<BOQRow[]>(INITIAL_ROWS);
  const [taxPercent, setTaxPercent] = useState<number>(DEFAULT_TAX_RATE);
  const nextId = useState({ current: INITIAL_ROWS.length + 1 })[0];

  const updateRow = (id: number, patch: Partial<BOQRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: nextId.current++, eq: "New item", code: "-", qty: 1, unit: "Nos", rate: 0 },
    ]);
  };

  const subtotal = rows.reduce((sum, r) => sum + r.qty * r.rate, 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#11203e] transition-colors"
      >
        <span>Sample BOQ Preview — HPE Office Fire Fighting Layout</span>
        {open ? <ChevronUp size={16} className="text-[#707892]" /> : <ChevronDown size={16} className="text-[#707892]" />}
      </button>

      {open && (
        <div className="border-t border-[#16294e]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#16294e]">
                  {["Equipment", "Code", "Qty", "Unit", "Unit Rate (AED)", "Total", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-[#707892] uppercase tracking-widest text-[10px] font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors group">
                    <td className="px-4 py-2 text-white">
                      <input
                        value={r.eq}
                        onChange={(e) => updateRow(r.id, { eq: e.target.value })}
                        className="w-full bg-transparent outline-none rounded px-1.5 py-0.5 -mx-1.5 hover:bg-[#16294e]/60 focus:bg-[#16294e] focus:ring-1 focus:ring-[#ff7a1a]/50"
                      />
                    </td>
                    <td className="px-4 py-2 text-[#ff9a4d] font-medium">{r.code}</td>
                    <td className="px-4 py-2 text-[#d9dce4] w-20">
                      <EditableCell value={r.qty} onChange={(v) => updateRow(r.id, { qty: v })} />
                    </td>
                    <td className="px-4 py-2 text-[#707892]">{r.unit}</td>
                    <td className="px-4 py-2 text-amber-400 w-28">
                      <EditableCell value={r.rate} onChange={(v) => updateRow(r.id, { rate: v })} className="text-amber-400" />
                    </td>
                    <td className="px-4 py-2 text-green-400 font-semibold whitespace-nowrap">
                      {formatAED(r.qty * r.rate)}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => removeRow(r.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#707892] hover:text-red-400 transition-all"
                        aria-label="Remove row"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#16294e]">
                  <td colSpan={5} className="px-4 py-2 text-right text-[#98a0b3] text-xs">Subtotal</td>
                  <td className="px-4 py-2 text-[#d9dce4] font-medium">{formatAED(subtotal)}</td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right text-[#98a0b3] text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      Tax
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                        className="w-12 bg-[#0a1228] border border-[#1d3563] rounded px-1.5 py-0.5 text-center text-white focus:border-[#ff7a1a] outline-none"
                      />
                      %
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[#d9dce4] font-medium">{formatAED(taxAmount)}</td>
                  <td />
                </tr>
                <tr className="bg-[#0a1228] border-t border-[#16294e]">
                  <td colSpan={5} className="px-4 py-3 text-right text-[#98a0b3] font-semibold text-xs uppercase tracking-wider">
                    Grand Total
                  </td>
                  <td className="px-4 py-3 text-green-400 font-bold text-sm">{formatAED(grandTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-xs text-[#ff9a4d] hover:text-[#ffb066] px-4 py-3 border-t border-[#16294e] w-full transition-colors"
          >
            <Plus size={13} /> Add item
          </button>
        </div>
      )}
    </div>
  );
}
