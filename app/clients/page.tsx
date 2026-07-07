"use client";
import { Users, Plus, Search } from "lucide-react";

const CLIENTS = [
  { id: "C001",   name: "Sunrise Public School",    type: "School",        boqs: 3, status: "Active", value: "₹1,82,000" },
  { id: "C002",   name: "Greenview Apartments",     type: "Flat (G+7)",    boqs: 1, status: "Review", value: "₹4,20,000" },
  { id: "C003",   name: "Sharma Residency",         type: "House",         boqs: 2, status: "Active", value: "₹68,500"   },
  { id: "HPE-01", name: "HPE Office — BU Floor",    type: "Office (HPE)",  boqs: 1, status: "Review", value: "₹2,14,580" },
  { id: "C005",   name: "Delhi Model School",       type: "School",        boqs: 4, status: "Active", value: "₹2,45,000" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  Review: "bg-[#ff7a1a]/15 text-[#ff9a4d]",
  New:    "bg-blue-500/10 text-blue-400",
};

export default function ClientsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
          <p className="text-sm text-[#98a0b3] mt-1">Manage all registered clients and their BOQs</p>
        </div>
        <button className="flex items-center gap-2 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-orange-900/20">
          <Plus size={15} /> Add Client
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6275]" />
        <input
          type="text"
          placeholder="Search clients by name or ID…"
          className="w-full bg-[#0d1730] border border-[#16294e] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] transition-colors"
        />
      </div>

      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#16294e]">
              {["Client ID", "Name", "Building Type", "BOQs", "Est. Value", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#707892] uppercase tracking-widest font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c, i) => (
              <tr key={c.id} className={`border-b border-[#16294e]/50 hover:bg-[#11203e] transition-colors ${i === CLIENTS.length - 1 ? "border-none" : ""}`}>
                <td className="px-5 py-3.5 text-[#ff9a4d] font-medium">{c.id}</td>
                <td className="px-5 py-3.5 text-white font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-[#98a0b3]">{c.type}</td>
                <td className="px-5 py-3.5 text-[#d9dce4]">{c.boqs}</td>
                <td className="px-5 py-3.5 text-green-400">{c.value}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs text-[#707892] hover:text-[#ff9a4d] transition-colors">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
