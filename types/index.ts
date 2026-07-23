export type UserRole = "engineer" | "admin" | "reviewer" | "lead" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type BuildingType = "School" | "Flat (G+4)" | "Flat (G+7)" | "House" | "Commercial" | "Office (HPE)";

export type FileStatus = "processing" | "done" | "review" | "error";

export interface UploadedFile {
  id: number;
  name: string;
  size: string;
  type: BuildingType;
  status: FileStatus;
  progress: number;
  rows: number | null;
  client: string;
}

// Equipment legend extracted from the HPE Fire Fighting Layout drawing
export interface EquipmentLegendItem {
  code: string;
  label: string;
  category: "Sprinkler" | "Hose / Hydrant" | "Extinguisher" | "Valve" | "Pipe";
  swatchColor: string;
}

export const EQUIPMENT_LEGEND: EquipmentLegendItem[] = [
  { code: "PCS", label: "Pendant Concealed Sprinkler", category: "Sprinkler",      swatchColor: "#dc2626" },
  { code: "US",  label: "Upright Sprinkler",            category: "Sprinkler",      swatchColor: "#f87171" },
  { code: "FHC", label: "Fire Hose Cabinet",             category: "Hose / Hydrant", swatchColor: "#ff7a1a" },
  { code: "FE-01", label: "Dry Powder 4kg Fire Extinguisher", category: "Extinguisher", swatchColor: "#16a34a" },
  { code: "FE-02", label: "CO2 5kg Fire Extinguisher",   category: "Extinguisher",   swatchColor: "#22c55e" },
  { code: "ZCV", label: "Zone Control Valve",            category: "Valve",          swatchColor: "#3b82f6" },
  { code: "FP",  label: "Fire Fighting (FF) Pipe",        category: "Pipe",           swatchColor: "#ef4444" },
  { code: "FAC", label: "Fire Alarm Cable (FAC) Pipe",    category: "Pipe",           swatchColor: "#94a3b8" },
];

// Pipe schedule per NFPA-13, taken from the HPE drawing
export interface PipeScheduleRow {
  diameter: string;
  ordinaryHazardSep37Eq: number;
  ordinaryHazardSepLt37: number;
  ordinaryHazardSepGt37: number;
}

export const PIPE_SCHEDULE: PipeScheduleRow[] = [
  { diameter: '1"',     ordinaryHazardSep37Eq: 2,   ordinaryHazardSepLt37: 2,   ordinaryHazardSepGt37: 2 },
  { diameter: '1 1/4"', ordinaryHazardSep37Eq: 3,   ordinaryHazardSepLt37: 3,   ordinaryHazardSepGt37: 3 },
  { diameter: '1 1/2"', ordinaryHazardSep37Eq: 5,   ordinaryHazardSepLt37: 5,   ordinaryHazardSepGt37: 5 },
  { diameter: '2"',     ordinaryHazardSep37Eq: 10,  ordinaryHazardSepLt37: 10,  ordinaryHazardSepGt37: 10 },
  { diameter: '2 1/2"', ordinaryHazardSep37Eq: 30,  ordinaryHazardSepLt37: 20,  ordinaryHazardSepGt37: 15 },
  { diameter: '3"',     ordinaryHazardSep37Eq: 60,  ordinaryHazardSepLt37: 40,  ordinaryHazardSepGt37: 30 },
  { diameter: '4"',     ordinaryHazardSep37Eq: 100, ordinaryHazardSepLt37: 100, ordinaryHazardSepGt37: 100 },
];
