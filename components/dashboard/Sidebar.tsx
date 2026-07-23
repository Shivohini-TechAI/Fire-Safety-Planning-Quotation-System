"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Upload, Users, FileText, Calculator, Settings, LogOut, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/upload",    icon: Upload,          label: "Upload BOQ" },
  { href: "/clients",   icon: Users,           label: "Clients" },
  { href: "/reports",   icon: FileText,        label: "Reports" },
  { href: "/quotations",icon: Calculator,      label: "Quotations" },
  { href: "/settings",  icon: Settings,        label: "Settings" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <aside className="w-56 h-full bg-[#0a1228] border-r border-[#16294e] flex flex-col py-5 px-3 flex-shrink-0">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#ff7a1a] flex items-center justify-center flex-shrink-0">
          <Flame size={15} className="text-white"/>
        </div>
        <span className="font-bold text-sm text-white tracking-wide">FIRE<span className="text-[#707892]">BOQ</span></span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-[#ff7a1a] text-white font-semibold shadow-md shadow-orange-900/20"
                  : "text-[#98a0b3] hover:bg-[#11203e] hover:text-white"
              }`}>
              <Icon size={16}/>{label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#16294e] pt-4 px-2">
        <div className="text-xs text-white font-semibold truncate">{user?.name ?? "—"}</div>
        <div className="text-xs text-[#707892] mb-3 capitalize">{user?.role ?? "—"}</div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-[#707892] hover:text-[#ff9a4d] transition-colors">
          <LogOut size={13}/> Sign out
        </button>
      </div>
    </aside>
  );
}
