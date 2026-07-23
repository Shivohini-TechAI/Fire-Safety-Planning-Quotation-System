"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Loader2, Building2, Layers, X } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useProject } from "@/hooks/useProjects";
import { useBuildings, useCreateBuilding } from "@/hooks/useBuildings";
import { useFloors, useCreateFloor } from "@/hooks/useFloors";
import { Building } from "@/lib/buildings";

const inputClass =
  "w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all";
const labelClass = "block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5";

function handleAdminError(err: unknown, fallback: string) {
  if (isAxiosError(err) && err.response?.status === 403) {
    toast.error("Only admin accounts can do this right now");
  } else {
    const message = isAxiosError(err) ? err.response?.data?.message ?? fallback : fallback;
    toast.error(message);
  }
}

function AddBuildingModal({ projectId, onClose }: { projectId: number; onClose: () => void }) {
  const createBuilding = useCreateBuilding(projectId);
  const [form, setForm] = useState({
    building_name: "",
    building_type: "School",
    total_area: "",
    number_of_floors: "",
    risk_level: "Medium",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.building_name) {
      toast.error("Building name is required");
      return;
    }
    createBuilding.mutate(
      {
        project_id: projectId,
        building_name: form.building_name,
        building_type: form.building_type,
        total_area: form.total_area ? Number(form.total_area) : undefined,
        number_of_floors: form.number_of_floors ? Number(form.number_of_floors) : undefined,
        risk_level: form.risk_level,
      },
      {
        onSuccess: () => {
          toast.success("Building added");
          onClose();
        },
        onError: (err) => handleAdminError(err, "Failed to add building"),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Building</h2>
          <button onClick={onClose} className="text-[#707892] hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Building Name</label>
            <input value={form.building_name} onChange={(e) => setForm((f) => ({ ...f, building_name: e.target.value }))} className={inputClass} placeholder="e.g. Main Block" />
          </div>
          <div>
            <label className={labelClass}>Building Type</label>
            <select value={form.building_type} onChange={(e) => setForm((f) => ({ ...f, building_type: e.target.value }))} className={inputClass + " appearance-none"}>
              <option>School</option>
              <option>Flat (G+4)</option>
              <option>Flat (G+7)</option>
              <option>House</option>
              <option>Commercial</option>
              <option>Office (HPE)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Total Area (sqft)</label>
              <input type="number" value={form.total_area} onChange={(e) => setForm((f) => ({ ...f, total_area: e.target.value }))} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className={labelClass}>No. of Floors</label>
              <input type="number" value={form.number_of_floors} onChange={(e) => setForm((f) => ({ ...f, number_of_floors: e.target.value }))} className={inputClass} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Risk Level</label>
            <select value={form.risk_level} onChange={(e) => setForm((f) => ({ ...f, risk_level: e.target.value }))} className={inputClass + " appearance-none"}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button type="submit" disabled={createBuilding.isPending} className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            {createBuilding.isPending ? <><Loader2 size={14} className="animate-spin" /> Adding…</> : "Add Building"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddFloorModal({ buildingId, onClose }: { buildingId: number; onClose: () => void }) {
  const createFloor = useCreateFloor(buildingId);
  const [form, setForm] = useState({ floor_name: "", floor_number: "", area: "", occupancy_type: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.floor_name) {
      toast.error("Floor name is required");
      return;
    }
    createFloor.mutate(
      {
        building_id: buildingId,
        floor_name: form.floor_name,
        floor_number: form.floor_number ? Number(form.floor_number) : undefined,
        area: form.area ? Number(form.area) : undefined,
        occupancy_type: form.occupancy_type || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Floor added");
          onClose();
        },
        onError: (err) => handleAdminError(err, "Failed to add floor"),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Floor</h2>
          <button onClick={onClose} className="text-[#707892] hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Floor Name</label>
            <input value={form.floor_name} onChange={(e) => setForm((f) => ({ ...f, floor_name: e.target.value }))} className={inputClass} placeholder="e.g. Ground Floor" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Floor Number</label>
              <input type="number" value={form.floor_number} onChange={(e) => setForm((f) => ({ ...f, floor_number: e.target.value }))} className={inputClass} placeholder="e.g. 0" />
            </div>
            <div>
              <label className={labelClass}>Area (sqft)</label>
              <input type="number" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className={inputClass} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Occupancy Type</label>
            <input value={form.occupancy_type} onChange={(e) => setForm((f) => ({ ...f, occupancy_type: e.target.value }))} className={inputClass} placeholder="e.g. Classrooms, Office" />
          </div>
          <button type="submit" disabled={createFloor.isPending} className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            {createFloor.isPending ? <><Loader2 size={14} className="animate-spin" /> Adding…</> : "Add Floor"}
          </button>
        </form>
      </div>
    </div>
  );
}

function BuildingCard({ building }: { building: Building }) {
  const [open, setOpen] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const { data: floors = [], isLoading } = useFloors(open ? building.id : 0);

  return (
    <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#11203e] transition-colors">
        <div className="flex items-center gap-3">
          <Building2 size={16} className="text-[#ff9a4d]" />
          <div className="text-left">
            <div className="text-sm font-semibold text-white">{building.building_name}</div>
            <div className="text-xs text-[#707892]">
              {building.building_type}
              {building.total_area ? ` · ${building.total_area} sqft` : ""}
              {building.risk_level ? ` · ${building.risk_level} risk` : ""}
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[#707892]" /> : <ChevronDown size={16} className="text-[#707892]" />}
      </button>

      {open && (
        <div className="border-t border-[#16294e] px-5 py-4">
          {isLoading ? (
            <div className="text-xs text-[#707892] flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Loading floors…</div>
          ) : floors.length === 0 ? (
            <p className="text-xs text-[#707892] mb-3">No floors added yet.</p>
          ) : (
            <div className="space-y-2 mb-3">
              {floors.map((f) => (
                <div key={f.id} className="flex items-center justify-between bg-[#0a1228] border border-[#16294e] rounded-lg px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-[#707892]" />
                    <span className="text-sm text-white">{f.floor_name}</span>
                    {f.occupancy_type && <span className="text-xs text-[#707892]">· {f.occupancy_type}</span>}
                  </div>
                  {f.area && <span className="text-xs text-[#98a0b3]">{f.area} sqft</span>}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowFloorModal(true)} className="flex items-center gap-1.5 text-xs text-[#ff9a4d] hover:text-[#ffb066] transition-colors">
            <Plus size={12} /> Add Floor
          </button>
        </div>
      )}

      {showFloorModal && <AddFloorModal buildingId={building.id} onClose={() => setShowFloorModal(false)} />}
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: buildings = [], isLoading: buildingsLoading } = useBuildings(projectId);
  const [showBuildingModal, setShowBuildingModal] = useState(false);

  if (projectLoading || buildingsLoading) {
    return (
      <div className="p-8 text-[#707892] flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <p className="text-[#707892]">Project not found.</p>
        <button onClick={() => router.push("/clients")} className="text-[#ff9a4d] text-sm mt-2">← Back to Clients</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/clients")} className="flex items-center gap-1.5 text-xs text-[#707892] hover:text-[#ff9a4d] transition-colors mb-4">
        <ArrowLeft size={13} /> Back to Clients
      </button>

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{project.client_name}</h1>
          <p className="text-sm text-[#98a0b3] mt-1">
            {project.project_name} · {project.building_name}
            {project.location ? ` · ${project.location}` : ""}
          </p>
        </div>
        <button
          onClick={() => setShowBuildingModal(true)}
          className="flex items-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20"
        >
          <Plus size={15} /> Add Building
        </button>
      </div>

      {buildings.length === 0 ? (
        <div className="bg-[#0d1730] border border-[#16294e] rounded-xl px-5 py-8 text-center text-[#707892]">
          <Building2 size={20} className="inline mb-2 opacity-50" />
          <p>No buildings added yet for this project.</p>
        </div>
      ) : (
        buildings.map((b) => <BuildingCard key={b.id} building={b} />)
      )}

      {showBuildingModal && <AddBuildingModal projectId={projectId} onClose={() => setShowBuildingModal(false)} />}
    </div>
  );
}