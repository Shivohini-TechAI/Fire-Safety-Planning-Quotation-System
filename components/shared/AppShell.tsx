"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#060b18]">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(o => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-[#0d1730] border border-[#16294e] flex items-center justify-center text-[#98a0b3] hover:text-white transition-colors"
      >
        {mobileOpen ? <X size={16}/> : <Menu size={16}/>}
      </button>

      {/* Sidebar — hidden on mobile unless toggled */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}/>
      )}

      <main className="flex-1 overflow-y-auto lg:ml-0">{children}</main>
    </div>
  );
}
