"use client";
import { useState } from "react";
import { Users, Plus, Search, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { useProjects, useCreateProject } from "@/hooks/useProjects";

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  Review: "bg-[#ff7a1a]/15 text-[#ff9a4d]",
  New:    "bg-blue-500/10 text-blue-400",
};

function AddClientModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const createProject = useCreateProject();
  const [form, setForm] = useState({
    project_name: "",
    client_name: "",
    building_name: "",
    location: "",
    description: "",
    status: "New",
  });

  const inputClass =
    "w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all";
  const labelClass = "block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.project_name || !form.client_name || !form.building_name) {
      toast.error("Project name, client name, and building name are required");
      return;
    }
    createProject.mutate(
      { ...form, user_id: user.id },
      {
        onSuccess: () => {
          toast.success("Client added");
          onClose();
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
            toast.error("Only admin accounts can add clients right now");
          } else {
            const message = isAxiosError(err) ? err.response?.data?.message ?? "Failed to add client" : "Failed to add client";
            toast.error(message);
          }
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Client</h2>
          <button onClick={onClose} className="text-[#707892] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Project Name</label>
            <input
              value={form.project_name}
              onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Sunrise School Fire Safety"
            />
          </div>
          <div>
            <label className={labelClass}>Client Name</label>
            <input
              value={form.client_name}
              onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Sunrise Public School"
            />
          </div>
          <div>
            <label className={labelClass}>Building Name</label>
            <input
              value={form.building_name}
              onChange={(e) => setForm((f) => ({ ...f, building_name: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Main Block"
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className={inputClass}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className={inputClass + " appearance-none"}
            >
              <option>New</option>
              <option>Active</option>
              <option>Review</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={createProject.isPending}
            className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors shadow-md shadow-orange-900/20 flex items-center justify-center gap-2"
          >
            {createProject.isPending ? <><Loader2 size={14} className="animate-spin" /> Adding…</> : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const { data: projects = [], isLoading: loading, isError } = useProjects();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  if (isError) {
    toast.error("Could not load clients — is the backend running?");
  }

  const filtered = projects.filter(
    (p) =>
      p.client_name.toLowerCase().includes(search.toLowerCase()) ||
      p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
          <p className="text-sm text-[#98a0b3] mt-1">Manage all registered clients and their BOQs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20"
        >
          <Plus size={15} /> Add Client
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6275]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name or ID…"
          className="w-full bg-[#0d1730] border border-[#16294e] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] transition-colors"
        />
      </div>

      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#16294e]">
              {["Client ID", "Name", "Building", "Location", "Status", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#707892] uppercase tracking-widest font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[#707892]">
                  <Loader2 size={16} className="animate-spin inline mr-2" /> Loading clients…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[#707892]">
                  <Users size={20} className="inline mb-2 opacity-50" />
                  <p>No clients yet — add your first one.</p>
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors ${
                    i === filtered.length - 1 ? "border-none" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 text-[#ff9a4d] font-medium">#{p.id}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{p.client_name}</td>
                  <td className="px-5 py-3.5 text-[#98a0b3]">{p.building_name}</td>
                  <td className="px-5 py-3.5 text-[#98a0b3]">{p.location || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColor[p.status || "New"] ?? statusColor.New}`}>
                      {p.status || "New"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/clients/${p.id}`} className="text-xs text-[#707892] hover:text-[#ff9a4d] transition-colors">
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} />}
    </div>
  );
}