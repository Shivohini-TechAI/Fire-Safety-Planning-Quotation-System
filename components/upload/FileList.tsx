"use client";
import { X, FileSpreadsheet, FileText, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { UploadedFile } from "@/types";

const statusConfig = {
  done:       { label:"Parsed",       cls:"bg-green-500/10 text-green-400",    icon: <CheckCircle size={13} className="text-green-400"/> },
  processing: { label:"Processing",   cls:"bg-[#ff7a1a]/15 text-[#ff9a4d]",   icon: <Clock       size={13} className="text-[#ff9a4d] animate-pulse"/> },
  review:     { label:"Needs Review", cls:"bg-amber-500/10 text-amber-400",    icon: <AlertCircle size={13} className="text-amber-400"/> },
  error:      { label:"Error",        cls:"bg-red-500/10 text-red-400",        icon: <XCircle     size={13} className="text-red-400"/> },
};

interface FileListProps {
  files: UploadedFile[];
  onRemove: (id: number) => void;
  onCancel?: (id: number) => void;
}

export default function FileList({ files, onRemove, onCancel }: FileListProps) {
  if (files.length === 0) return (
    <div className="bg-[#0d1730] border border-dashed border-[#16294e] rounded-xl p-10 text-center">
      <FileSpreadsheet size={28} className="text-[#3a4154] mx-auto mb-3"/>
      <p className="text-sm text-[#5a6275]">No files uploaded yet</p>
      <p className="text-xs text-[#3a4154] mt-1">Upload a BOQ file above to get started</p>
    </div>
  );

  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">Uploaded Files</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d] font-medium">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {files.map(f => {
          const { label, cls, icon } = statusConfig[f.status] ?? statusConfig.review;
          const isCSV = f.name.endsWith(".csv");
          return (
            <div key={f.id} className="flex items-center gap-3 bg-[#11203e] border border-[#16294e] rounded-lg px-4 py-3 group hover:border-[#1d3563] transition-colors">
              <div className="text-[#707892] flex-shrink-0">
                {isCSV ? <FileText size={20}/> : <FileSpreadsheet size={20}/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white truncate">{f.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${cls}`}>
                    {icon}{label}
                  </span>
                </div>
                <div className="text-xs text-[#707892] font-mono mt-0.5">
                  {f.size} · {f.type} · Client {f.client}{f.rows ? ` · ${f.rows} rows` : ""}
                </div>
                {f.status === "processing" && (
                  <div className="mt-1.5 h-1.5 bg-[#1d3563] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff7a1a] to-[#ff9a4d] rounded-full transition-all duration-700"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {f.status === "processing" && onCancel && (
                  <button onClick={() => onCancel(f.id)}
                    className="text-xs text-[#707892] hover:text-amber-400 transition-colors border border-[#1d3563] rounded px-2 py-0.5">
                    Cancel
                  </button>
                )}
                <button onClick={() => onRemove(f.id)}
                  className="text-[#5a6275] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <X size={15}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
