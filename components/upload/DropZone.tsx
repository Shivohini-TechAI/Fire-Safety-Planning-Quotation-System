"use client";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet } from "lucide-react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
}

export default function DropZone({ onFiles }: DropZoneProps) {
  const [pageDrag, setPageDrag] = useState(false);

  useEffect(() => {
    const enter = () => setPageDrag(true);
    const leave = (e: DragEvent) => { if (!e.relatedTarget) setPageDrag(false); };
    const drop  = () => setPageDrag(false);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    setPageDrag(false);
    if (accepted.length) onFiles(accepted);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  const active = isDragActive || pageDrag;

  return (
    <>
      {pageDrag && !isDragActive && (
        <div className="fixed inset-0 z-40 border-4 border-dashed border-[#ff7a1a]/40 bg-[#ff7a1a]/5 pointer-events-none rounded-none transition-all"/>
      )}
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 mb-5 ${
          active
            ? "border-[#ff7a1a] bg-[#ff7a1a]/8 scale-[1.01]"
            : "border-[#1d3563] hover:border-[#ff7a1a]/50 hover:bg-[#11203e] bg-[#0d1730]"
        }`}>
        <input {...getInputProps()} />
        <div className={`flex justify-center mb-3 transition-colors ${active ? "text-[#ff9a4d]" : "text-[#5a6275]"}`}>
          {active ? <Upload size={36} className="animate-bounce"/> : <FileSpreadsheet size={36}/>}
        </div>
        <p className="text-base font-semibold text-white mb-1">
          {active ? "Release to upload!" : "Drag & drop a plan or BOQ file here"}
        </p>
        <p className="text-sm text-[#707892]">
          or <span className="text-[#ff9a4d]">click to browse</span> · Site plans (.png, .jpg, .pdf) or BOQ files (.xlsx, .csv) · Max 5 MB each
        </p>
      </div>
    </>
  );
}
