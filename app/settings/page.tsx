"use client";
import { useAuth } from "@/context/AuthContext";
import { Shield, Building2, Trash2, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-[#98a0b3] mt-1">Manage your account, team, and preferences</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left / main column */}
        <div className="col-span-2 space-y-5">
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Profile</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: user?.name  ?? "" },
                { label: "Role",      value: user?.role  ?? "" },
                { label: "Email",     value: user?.email ?? "" },
                { label: "Company",   value: "Shivohini Tech LLP" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">{f.label}</label>
                  <input
                    defaultValue={f.value}
                    className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff7a1a] transition-colors"
                  />
                </div>
              ))}
            </div>
            <button className="mt-4 bg-[#ff7a1a] hover:bg-[#f06400] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md shadow-orange-900/20">
              Save Changes
            </button>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Notifications</div>
            {[
              { label: "Compliance alerts", desc: "Get notified when a BOQ has a compliance gap" },
              { label: "Upload complete",   desc: "Notify when file parsing is done" },
              { label: "Report ready",      desc: "Notify when a report is generated" },
              { label: "Weekly summary",    desc: "Email digest of all project activity every Monday" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-[#16294e] last:border-none">
                <div>
                  <div className="text-sm text-white">{n.label}</div>
                  <div className="text-xs text-[#707892] mt-0.5">{n.desc}</div>
                </div>
                <div className="w-10 h-5 bg-[#ff7a1a] rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">AI / API Configuration</div>
            <p className="text-xs text-[#707892] mb-4">Connect the Anthropic API for AI-powered BOQ insights</p>
            <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">Anthropic API Key</label>
            <input
              type="password"
              placeholder="sk-ant-••••••••••••••••"
              className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] transition-colors mb-3"
            />
            <button className="bg-[#1d3563] hover:bg-[#16294e] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              Save API Key
            </button>
          </div>

          <div className="bg-[#0d1730] border border-red-900/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Trash2 size={14} className="text-red-400" />
              <span className="text-sm font-semibold text-red-400">Danger Zone</span>
            </div>
            <p className="text-xs text-[#707892] mb-4">Deleting your account removes all uploaded BOQs and reports. This cannot be undone.</p>
            <button className="border border-red-900/50 text-red-400 hover:bg-red-950/30 text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-[#ff9a4d]" />
              <span className="text-sm font-semibold text-white">Organization</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-[#707892]">Company</span><span className="text-white">Shivohini Tech LLP</span></div>
              <div className="flex justify-between"><span className="text-[#707892]">Plan</span><span className="text-[#ff9a4d] font-medium">Internship</span></div>
              <div className="flex justify-between"><span className="text-[#707892]">Team size</span><span className="text-white">2 members</span></div>
              <div className="flex justify-between"><span className="text-[#707892]">Project</span><span className="text-white">FireSafe BOQ Estimator</span></div>
            </div>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#ff9a4d]" />
              <span className="text-sm font-semibold text-white">Security</span>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 text-xs text-[#98a0b3] hover:text-white bg-[#0a1228] border border-[#1d3563] rounded-lg px-3 py-2.5 transition-colors">
                <KeyRound size={13} /> Change Password
              </button>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-[#98a0b3]">Two-factor auth</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d3563] text-[#ff9a4d]">Not enabled</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-[#98a0b3]">Last login</span>
                <span className="text-[10px] text-[#707892]">Today, 2:20 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-3">Need help?</div>
            <p className="text-xs text-[#707892] mb-4">Reach out to your team lead or check the project README for setup instructions.</p>
            <button className="w-full bg-[#1d3563] hover:bg-[#16294e] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
