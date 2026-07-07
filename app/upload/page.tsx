"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropZone from "@/components/upload/DropZone";
import FileList from "@/components/upload/FileList";
import { UploadedFile, BuildingType } from "@/types";
import { Info, FileCheck2, Clock, ListChecks, AlertTriangle, Table } from "lucide-react";
import toast from "react-hot-toast";
import PageTransition from "@/components/ui/PageTransition";

const schema = z.object({
  clientId:     z.string().min(1, "Client ID is required"),
  buildingType: z.enum(["School","Flat (G+4)","Flat (G+7)","House","Commercial","Office (HPE)"]),
});
type FormData = z.infer<typeof schema>;

const SAMPLE_FILES: UploadedFile[] = [
  { id:1, name:"hpe_office_bu_floor.xlsx", size:"57 KB", type:"Office (HPE)", status:"done",       progress:100, rows:22, client:"HPE-01" },
  { id:2, name:"school_boq_C001.xlsx",      size:"42 KB", type:"School",       status:"done",       progress:100, rows:14, client:"C001"   },
  { id:3, name:"flat_boq_C002.csv",          size:"18 KB", type:"Flat (G+7)",  status:"processing", progress:65,  rows:null, client:"C002" },
];

const PREVIEW_ROWS = [
  { eq:"Pendant Concealed Sprinkler", qty:86,  unit:"Nos", rate:"₹650",    total:"₹55,900" },
  { eq:"Fire Hose Cabinet",           qty:4,   unit:"Set", rate:"₹18,500", total:"₹74,000" },
  { eq:"CO2 5kg Extinguisher",        qty:6,   unit:"Nos", rate:"₹3,400",  total:"₹20,400" },
  { eq:"Zone Control Valve",          qty:3,   unit:"Set", rate:"₹9,800",  total:"₹29,400" },
];

const inputClass = "w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all";
const labelClass = "block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5";

export default function UploadPage() {
  const [files, setFiles]         = useState<UploadedFile[]>(SAMPLE_FILES);
  const [pendingFiles, setPending] = useState<File[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleDrop = (newFiles: File[]) => {
    const existingNames = files.map(f => f.name);
    const dupes = newFiles.filter(f => existingNames.includes(f.name)).map(f => f.name);
    if (dupes.length) {
      setDuplicates(dupes);
      toast.error(`${dupes.length} duplicate file(s) detected`);
    }
    const unique = newFiles.filter(f => !existingNames.includes(f.name));
    setPending(unique);
    if (unique.length) toast.success(`${unique.length} file(s) ready to upload`);
  };

  const onSubmit = async (data: FormData) => {
    if (!pendingFiles.length) { toast.error("Please drop a file first"); return; }
    // TODO: POST /api/upload for each file → FormData { file, clientId, buildingType }
    const newFiles: UploadedFile[] = pendingFiles.map((f, i) => ({
      id:       Date.now() + i,
      name:     f.name,
      size:     `${(f.size / 1024).toFixed(0)} KB`,
      type:     data.buildingType as BuildingType,
      status:   "processing",
      progress: 10,
      rows:     null,
      client:   data.clientId.toUpperCase(),
    }));
    setFiles(prev => [...newFiles, ...prev]);
    setPending([]);
    setDuplicates([]);
    reset();
    toast.success(`Uploading ${newFiles.length} file(s)…`);

    newFiles.forEach((nf, i) => {
      setTimeout(() => setFiles(f => f.map(x => x.id===nf.id ? {...x, progress:55} : x)), 700+(i*200));
      setTimeout(() => setFiles(f => f.map(x => x.id===nf.id ? {...x, progress:100, status:"done", rows:8+i} : x)), 2000+(i*300));
    });
  };

  const removeFile  = (id: number) => { setFiles(f => f.filter(x => x.id !== id)); toast.success("File removed"); };
  const cancelFile  = (id: number) => { setFiles(f => f.map(x => x.id===id ? {...x, status:"error"} : x)); toast.error("Upload cancelled"); };
  const doneCount   = files.filter(f => f.status === "done").length;
  const processingCount = files.filter(f => f.status === "processing").length;

  return (
    <PageTransition>
      <div className="p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-white">Upload BOQ</h1>
          <p className="text-sm text-[#98a0b3] mt-1">Upload Excel or CSV files for parsing and cost estimation</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <DropZone onFiles={handleDrop} />

            {/* Pending files chips */}
            {pendingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 -mt-3 mb-4">
                {pendingFiles.map(f => (
                  <span key={f.name} className="text-xs px-3 py-1 rounded-full bg-green-900/20 border border-green-700/30 text-green-400 flex items-center gap-1">
                    <FileCheck2 size={11}/> {f.name}
                  </span>
                ))}
              </div>
            )}

            {/* Duplicate warning */}
            {duplicates.length > 0 && (
              <div className="flex items-start gap-2 bg-amber-900/15 border border-amber-700/30 rounded-lg px-4 py-3 mb-4 -mt-1">
                <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5"/>
                <div>
                  <p className="text-xs text-amber-400 font-medium">Duplicate files skipped:</p>
                  <p className="text-xs text-[#98a0b3] mt-0.5">{duplicates.join(", ")}</p>
                </div>
              </div>
            )}

            {/* File details form */}
            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5 mb-5">
              <div className="text-sm font-semibold text-white mb-4">File Details</div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Client ID</label>
                    <input {...register("clientId")} type="text" placeholder="e.g. HPE-02" className={inputClass}/>
                    {errors.clientId && <p className="text-xs text-red-400 mt-1">⚠ {errors.clientId.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Building Type</label>
                    <select {...register("buildingType")} className={inputClass + " appearance-none"}>
                      <option value="">Select type…</option>
                      <option>School</option>
                      <option>Flat (G+4)</option>
                      <option>Flat (G+7)</option>
                      <option>House</option>
                      <option>Commercial</option>
                      <option>Office (HPE)</option>
                    </select>
                    {errors.buildingType && <p className="text-xs text-red-400 mt-1">⚠ {errors.buildingType.message}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit" disabled={isSubmitting}
                    className="bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20">
                    {isSubmitting ? "Uploading…" : `Upload & Parse${pendingFiles.length > 1 ? ` (${pendingFiles.length} files)` : ""}`}
                  </button>
                  <button type="button" onClick={() => setShowPreview(p=>!p)}
                    className="flex items-center gap-2 text-sm text-[#707892] hover:text-[#ff9a4d] border border-[#1d3563] hover:border-[#ff7a1a]/40 px-4 py-2.5 rounded-lg transition-colors">
                    <Table size={14}/>{showPreview ? "Hide" : "Preview"} sample BOQ
                  </button>
                </div>
              </form>
            </div>

            {/* CSV/Excel preview */}
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

            <FileList files={files} onRemove={removeFile} onCancel={cancelFile}/>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="relative rounded-xl p-5 overflow-hidden border border-red-900/40 bg-gradient-to-br from-[#1f0d10] to-[#0d1730]">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-red-600/30 blur-3xl pointer-events-none"/>
              <div className="text-xs font-bold text-red-200 uppercase tracking-widest mb-4 relative">Upload Stats</div>
              <div className="relative space-y-2.5">
                {[
                  { icon: FileCheck2, label:"Parsed",      value: doneCount,       color:"text-green-400" },
                  { icon: Clock,      label:"Processing",  value: processingCount, color:"text-[#ff9a4d]" },
                  { icon: ListChecks, label:"Total Files", value: files.length,    color:"text-blue-300"  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-lg border border-red-800/40 bg-red-900/15 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className="text-red-300/70"/>
                      <span className="text-xs text-red-100/90 font-medium">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-[#ff9a4d]"/>
                <span className="text-sm font-semibold text-white">Upload Tips</span>
              </div>
              <ul className="space-y-2 text-xs text-[#98a0b3] leading-relaxed">
                <li>• You can drop multiple files at once.</li>
                <li>• Keep column headers: Equipment, Qty, Unit, Rate.</li>
                <li>• Tag the correct building type for NFPA-13 checks.</li>
                <li>• Max 10 MB per file — split large BOQs by floor.</li>
                <li>• Duplicate files are automatically detected and skipped.</li>
              </ul>
            </div>

            <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
              <div className="text-sm font-semibold text-white mb-3">Recently Parsed</div>
              <div className="space-y-2">
                {files.filter(f => f.status === "done").slice(0,4).map(f => (
                  <div key={f.id} className="flex items-center justify-between text-xs">
                    <span className="text-[#98a0b3] truncate max-w-[140px]">{f.name}</span>
                    <span className="text-green-400 font-medium flex-shrink-0">{f.rows ?? "—"} rows</span>
                  </div>
                ))}
                {doneCount === 0 && <p className="text-xs text-[#5a6275]">No files parsed yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
