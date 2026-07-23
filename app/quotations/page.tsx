"use client";
import { useState } from "react";
import { Plus, Calculator, Loader2, Eye, Download, X, Trash2, ArrowLeft, FileStack } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useEquipment } from "@/hooks/useEquipment";
import { useQuotations, useCalculateQuotation, useCreateQuotation } from "@/hooks/useQuotations";
import { getQuotationPdfUrl, QuotationItemInput, QuotationTotals } from "@/lib/quotations";

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

interface CartLine {
  equipmentId: number;
  name: string;
  quantity: number;
}

function QuotationBuilder({ onDone }: { onDone: () => void }) {
  const { data: equipment = [], isLoading: equipLoading } = useEquipment();
  const calculate = useCalculateQuotation();
  const create = useCreateQuotation();

  const [projectName, setProjectName] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [preview, setPreview] = useState<QuotationTotals | null>(null);

  const addToCart = (equipmentId: number, name: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.equipmentId === equipmentId);
      if (existing) {
        return prev.map((c) => (c.equipmentId === equipmentId ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { equipmentId, name, quantity: 1 }];
    });
    setPreview(null);
  };

  const updateQty = (equipmentId: number, quantity: number) => {
    setCart((prev) => prev.map((c) => (c.equipmentId === equipmentId ? { ...c, quantity: Math.max(1, quantity) } : c)));
    setPreview(null);
  };

  const removeLine = (equipmentId: number) => {
    setCart((prev) => prev.filter((c) => c.equipmentId !== equipmentId));
    setPreview(null);
  };

  const toItems = (): QuotationItemInput[] => cart.map((c) => ({ equipmentId: c.equipmentId, quantity: c.quantity }));

  const runCalculate = () => {
    if (!projectName.trim()) { toast.error("Project name is required"); return; }
    if (cart.length === 0) { toast.error("Add at least one equipment item"); return; }
    calculate.mutate(
      { projectName, items: toItems() },
      {
        onSuccess: (data) => setPreview(data),
        onError: (err) => {
          const message = isAxiosError(err) ? err.response?.data?.message ?? "Calculation failed" : "Calculation failed";
          toast.error(message);
        },
      }
    );
  };

  const runSave = () => {
    if (!preview) { toast.error("Calculate a preview first"); return; }
    create.mutate(
      { projectName, items: toItems() },
      {
        onSuccess: () => {
          toast.success("Quotation saved — report generated");
          onDone();
        },
        onError: (err) => {
          const message = isAxiosError(err) ? err.response?.data?.message ?? "Failed to save quotation" : "Failed to save quotation";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div>
      <button onClick={onDone} className="flex items-center gap-1.5 text-xs text-[#707892] hover:text-[#ff9a4d] transition-colors mb-4">
        <ArrowLeft size={13} /> Back to Quotations
      </button>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Project Name</label>
        <input
          value={projectName}
          onChange={(e) => { setProjectName(e.target.value); setPreview(null); }}
          placeholder="e.g. Sunrise School Fire Safety"
          className="w-full max-w-md bg-[#0a1228] border border-[#1d3563] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="text-sm font-semibold text-white mb-3">Available Equipment</div>
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-4 max-h-[420px] overflow-y-auto">
            {equipLoading ? (
              <div className="text-xs text-[#707892] flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Loading…</div>
            ) : equipment.length === 0 ? (
              <p className="text-xs text-[#707892]">No equipment records found.</p>
            ) : (
              <div className="space-y-2">
                {equipment.map((eq) => (
                  <div key={eq.id} className="flex items-center justify-between bg-[#11203e] border border-[#16294e] rounded-lg px-3.5 py-2.5">
                    <div>
                      <div className="text-sm text-white">{eq.name}</div>
                      <div className="text-xs text-[#707892]">{eq.type} · {formatINR(eq.price)}</div>
                    </div>
                    <button
                      onClick={() => addToCart(eq.id, eq.name)}
                      className="flex items-center gap-1 text-xs text-[#ff9a4d] hover:text-[#ffb066] border border-[#1d3563] hover:border-[#ff7a1a]/40 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-white mb-3">Quotation Items</div>
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-4 min-h-[120px]">
            {cart.length === 0 ? (
              <p className="text-xs text-[#707892]">Add equipment from the left to build a quotation.</p>
            ) : (
              <div className="space-y-2 mb-3">
                {cart.map((c) => (
                  <div key={c.equipmentId} className="flex items-center justify-between bg-[#11203e] border border-[#16294e] rounded-lg px-3.5 py-2.5">
                    <span className="text-sm text-white flex-1">{c.name}</span>
                    <input
                      type="number"
                      min={1}
                      value={c.quantity}
                      onChange={(e) => updateQty(c.equipmentId, Number(e.target.value) || 1)}
                      className="w-16 bg-[#0a1228] border border-[#1d3563] rounded px-2 py-1 text-center text-white text-xs mr-2"
                    />
                    <button onClick={() => removeLine(c.equipmentId)} className="text-[#707892] hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={runCalculate}
              disabled={calculate.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#1d3563] hover:bg-[#254680] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              {calculate.isPending ? <><Loader2 size={14} className="animate-spin" /> Calculating…</> : <><Calculator size={14} /> Calculate Preview</>}
            </button>
          </div>

          {preview && (
            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-4 mt-4">
              <div className="text-sm font-semibold text-white mb-3">Preview</div>
              <div className="space-y-1.5 text-xs text-[#98a0b3] mb-3">
                <div className="flex justify-between"><span>Equipment Cost</span><span className="text-white">{formatINR(preview.equipmentCost)}</span></div>
                <div className="flex justify-between"><span>Installation (10%)</span><span className="text-white">{formatINR(preview.installationCost)}</span></div>
                <div className="flex justify-between"><span>Maintenance (5%)</span><span className="text-white">{formatINR(preview.maintenanceCost)}</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span className="text-white">{formatINR(preview.gst)}</span></div>
              </div>
              <div className="flex justify-between border-t border-[#16294e] pt-3 mb-4">
                <span className="text-sm font-semibold text-[#98a0b3]">Total</span>
                <span className="text-lg font-bold text-green-400">{formatINR(preview.totalCost)}</span>
              </div>
              <button
                onClick={runSave}
                disabled={create.isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {create.isPending ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Quotation"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuotationsPage() {
  const { data: quotations = [], isLoading, isError } = useQuotations();
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return (
      <div className="p-8">
        <QuotationBuilder onDone={() => setShowBuilder(false)} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Quotations</h1>
          <p className="text-sm text-[#98a0b3] mt-1">Build and manage cost quotations</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20"
        >
          <Plus size={15} /> New Quotation
        </button>
      </div>

      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#16294e]">
              {["ID", "Project Name", "Equipment", "Total Cost", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#707892] uppercase tracking-widest font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-[#707892]"><Loader2 size={16} className="animate-spin inline mr-2" /> Loading…</td></tr>
            ) : isError ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-[#707892]">Could not load quotations.</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-[#707892]"><FileStack size={20} className="inline mb-2 opacity-50" /><p>No quotations yet — create your first one.</p></td></tr>
            ) : (
              quotations.map((q, i) => (
                <tr key={q.id} className={`border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors ${i === quotations.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5 text-[#ff9a4d] text-xs">QT{String(q.id).padStart(3, "0")}</td>
                  <td className="px-5 py-3.5 text-white">{q.projectName}</td>
                  <td className="px-5 py-3.5 text-[#98a0b3] text-xs">{q.breakdown?.length ?? 0} item(s)</td>
                  <td className="px-5 py-3.5 text-green-400 font-semibold">{formatINR(q.totalCost)}</td>
                  <td className="px-5 py-3.5 text-[#707892] text-xs">{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <a href={getQuotationPdfUrl(q.id)} target="_blank" rel="noopener noreferrer" className="text-[#707892] hover:text-blue-400 transition-colors" aria-label="Preview PDF">
                        <Eye size={14} />
                      </a>
                      <a href={getQuotationPdfUrl(q.id)} download className="text-[#707892] hover:text-[#ff9a4d] transition-colors" aria-label="Download PDF">
                        <Download size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}