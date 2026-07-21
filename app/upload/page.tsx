"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import DropZone from "@/components/upload/DropZone";
import { Info, FileCheck2, ListChecks, AlertTriangle, Table, FileSpreadsheet, X, Loader2 } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import { useUploadedPlans, useUploadPlan } from "@/hooks/useUploadedPlans";

const PREVIEW_ROWS = [
  { eq:"Pendant Concealed Sprinkler", qty:86,  unit:"Nos", rate:"₹650",    total:"₹55,900" },
  { eq:"Fire Hose Cabinet",           qty:4,   unit:"Set", rate:"₹18,500", total:"₹74,000" },
  { eq:"CO2 5kg Extinguisher",        qty:6,   unit:"Nos", rate:"₹3,400",  total:"₹20,400" },
  { eq:"Zone Control Valve",          qty:3,   unit:"Set", rate:"₹9,800",  total:"₹29,400" },
];

export default function UploadPage() {
  const { data: uploadedPlans = [], isLoading: listLoading } = useUploadedPlans();
  const uploadPlan = useUploadPlan();
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleDrop = (newFiles: File[]) => {
    const existingNames = uploadedPlans.map((p) => p.fileName);
    const dupes = newFiles.filter((f) => existingNames.includes(f.name)).map((f) => f.name);
    if (dupes.length) {
      setDuplicates(dupes);
      toast.error(`${dupes.length} duplicate file(s) detected`);
    }

    const unique = newFiles.filter((f) => !existingNames.includes(f.name));
    unique.forEach((file) => {
      uploadPlan.mutate(file, {
        onSuccess: () => toast.success(`${file.name} uploaded`),
        onError: () => toast.error(`Failed to upload ${file.name}`),
      });
    });
  };

  return (
    <PageTransition>
      <div className="p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-white">Upload BOQ</h1>
          <p className="text-sm text-[#98a0b3] mt-1">Upload a site plan drawing or BOQ file for cost estimation</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <DropZone onFiles={handleDrop} />

            {duplicates.length > 0 && (
              <div className="flex items-start gap-2 bg-amber-900/15 border border-amber-700/30 rounded-lg px-4 py-3 mb-4 -mt-1">
                <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                <div>
                  <p className="text-xs text-amber-400 font-medium">Duplicate files skipped:</p>
                  <p className="text-xs text-[#98a0b3] mt-0.5">{duplicates.join(", ")}</p>
                </div>
              </div>
            )}

            {uploadPlan.isPending && (
              <div className="flex items-center gap-2 bg-[#0d1730] border border-[#16294e] rounded-lg px-4 py-3 mb-4 text-sm text-[#98a0b3]">
                <Loader2 size={14} className="animate-spin text-[#ff9a4d]" /> Uploading…
              </div>
            )}

            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5 mb-5">
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="flex items-center gap-2 text-sm text-[#707892] hover:text-[#ff9a4d] border border-[#1d3563] hover:border-[#ff7a1a]/40 px-4 py-2.5 rounded-lg transition-colors"
              >
                <Table size={14}/>{showPreview ? "Hide" : "Show"} sample BOQ output
              </button>
              <p className="text-xs text-[#5a6275] mt-2">
                This is a sample of what a parsed BOQ looks like — real parsing from an uploaded plan isn&apos;t connected yet.
              </p>
            </div>

            {showPreview && (
              <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden mb-5">
                <div className="px-5 py-3 border-b border-[#16294e] flex items-center gap-2">
                  <Table size={13} className="text-[#ff9a4d]"/>
                  <span className="text-sm font-semibold text-white">Sample BOQ Preview — HPE Office Layout</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#16294e]">
                        {["Equipment","Qty","Unit","Unit Rate","Total"].map(h=>(
                          <th key={h} className="text-left px-4 py-2.5 text-[#707892] uppercase tracking-widest text-[10px] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PREVIEW_ROWS.map((r,i) => (
                        <tr key={i} className="border-b border-[#16294e]/40 hover:bg-[#11203e] transition-colors">
                          <td className="px-4 py-2.5 text-white">{r.eq}</td>
                          <td className="px-4 py-2.5 text-[#d9dce4]">{r.qty}</td>
                          <td className="px-4 py-2.5 text-[#707892]">{r.unit}</td>
                          <td className="px-4 py-2.5 text-amber-400 font-mono">{r.rate}</td>
                          <td className="px-4 py-2.5 text-green-400 font-mono font-semibold">{r.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Uploaded Plans</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">
                  {uploadedPlans.length} file{uploadedPlans.length !== 1 ? "s" : ""}
                </span>
              </div>

              {listLoading ? (
                <div className="text-xs text-[#707892] flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Loading…</div>
              ) : uploadedPlans.length === 0 ? (
                <div className="text-center py-8">
                  <FileSpreadsheet size={28} className="text-[#3a4154] mx-auto mb-3"/>
                  <p className="text-sm text-[#5a6275]">No files uploaded yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {uploadedPlans.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-4 py-3">
                      <FileSpreadsheet size={20} className="text-[#707892] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-white truncate">{p.fileName}</span>
                        <div className="text-xs text-[#707892] font-mono mt-0.5">
                          {new Date(p.uploadedAt).toLocaleString()}
                          {p.quotationId ? ` · linked to quotation #${p.quotationId}` : " · not yet linked to a quotation"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative rounded-xl p-5 overflow-hidden border border-red-900/40 bg-gradient-to-br from-[#1f0d10] to-[#0d1730]">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-red-600/30 blur-3xl pointer-events-none"/>
              <div className="text-xs font-bold text-red-200 uppercase tracking-widest mb-4 relative">Upload Stats</div>
              <div className="relative space-y-2.5">
                <div className="rounded-lg border border-red-800/40 bg-red-900/15 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListChecks size={13} className="text-red-300/70"/>
                    <span className="text-xs text-red-100/90 font-medium">Total Files</span>
                  </div>
                  <span className="text-sm font-bold text-blue-300">{uploadedPlans.length}</span>
                </div>
                <div className="rounded-lg border border-red-800/40 bg-red-900/15 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={13} className="text-red-300/70"/>
                    <span className="text-xs text-red-100/90 font-medium">Linked to Quotation</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">{uploadedPlans.filter(p => p.quotationId).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-[#ff9a4d]"/>
                <span className="text-sm font-semibold text-white">Upload Tips</span>
              </div>
              <ul className="space-y-2 text-xs text-[#98a0b3] leading-relaxed">
                <li>• You can drop multiple files at once.</li>
                <li>• Site plans (.png, .jpg, .pdf) are used for automatic equipment detection.</li>
                <li>• BOQ spreadsheets (.xlsx, .csv) can also be uploaded directly.</li>
                <li>• Max 5 MB per file.</li>
                <li>• Duplicate files are automatically detected and skipped.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}