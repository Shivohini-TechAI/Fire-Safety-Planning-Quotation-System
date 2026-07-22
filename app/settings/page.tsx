"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile, useChangePassword } from "@/hooks/useProfile";
import { Shield, Building2, Trash2, KeyRound, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          onClose();
        },
        onError: (err) => {
          const message = isAxiosError(err) ? err.response?.data?.message ?? "Failed to change password" : "Failed to change password";
          toast.error(message);
        },
      }
    );
  };

  const inputClass = "w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Change Password</h2>
          <button onClick={onClose} className="text-[#707892] hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {changePassword.isPending ? <><Loader2 size={14} className="animate-spin" /> Changing…</> : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function NotAvailableBadge() {
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d3563] text-[#707892]">Not available yet</span>;
}

export default function SettingsPage() {
  const { user, login } = useAuth();
  const updateProfile = useUpdateProfile();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const saveProfile = () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    updateProfile.mutate(
      { full_name: fullName, email },
      {
        onSuccess: (data) => {
          toast.success("Profile updated");
          if (user) login({ ...user, name: data.user.full_name, email: data.user.email });
        },
        onError: (err) => {
          const message = isAxiosError(err) ? err.response?.data?.message ?? "Failed to update profile" : "Failed to update profile";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-[#98a0b3] mt-1">Manage your account, team, and preferences</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Profile</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff7a1a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">Role</label>
                <input
                  defaultValue={user?.role ?? ""}
                  disabled
                  className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-[#707892] outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff7a1a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#707892] uppercase tracking-widest mb-1.5 font-semibold">Company</label>
                <input
                  defaultValue="Shivohini Tech LLP"
                  disabled
                  className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-[#707892] outline-none cursor-not-allowed"
                />
              </div>
            </div>
            <button
              onClick={saveProfile}
              disabled={updateProfile.isPending}
              className="mt-4 bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md shadow-orange-900/20 flex items-center gap-2"
            >
              {updateProfile.isPending ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Changes"}
            </button>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white">Notifications</div>
              <NotAvailableBadge />
            </div>
            {[
              { label: "Compliance alerts", desc: "Get notified when a BOQ has a compliance gap" },
              { label: "Upload complete",   desc: "Notify when file parsing is done" },
              { label: "Report ready",      desc: "Notify when a report is generated" },
              { label: "Weekly summary",    desc: "Email digest of all project activity every Monday" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-[#16294e] last:border-none opacity-50">
                <div>
                  <div className="text-sm text-white">{n.label}</div>
                  <div className="text-xs text-[#707892] mt-0.5">{n.desc}</div>
                </div>
                <div className="w-10 h-5 bg-[#1d3563] rounded-full relative flex-shrink-0 cursor-not-allowed">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#707892] rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5 opacity-60">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold text-white">AI / API Configuration</div>
              <NotAvailableBadge />
            </div>
            <p className="text-xs text-[#707892] mb-4">Connect the Anthropic API for AI-powered BOQ insights</p>
            <input
              type="password"
              disabled
              placeholder="sk-ant-••••••••••••••••"
              className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#5a6275] outline-none mb-3 cursor-not-allowed"
            />
            <button disabled className="bg-[#1d3563] text-[#707892] text-sm font-semibold px-5 py-2 rounded-lg cursor-not-allowed">
              Save API Key
            </button>
          </div>

          <div className="bg-[#0d1730] border border-red-900/40 rounded-xl p-5 opacity-60">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Trash2 size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">Danger Zone</span>
              </div>
              <NotAvailableBadge />
            </div>
            <p className="text-xs text-[#707892] mb-4">Deleting your account removes all uploaded BOQs and reports. This cannot be undone.</p>
            <button disabled className="border border-red-900/50 text-red-400/50 text-sm font-semibold px-5 py-2 rounded-lg cursor-not-allowed">
              Delete Account
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-[#ff9a4d]" />
              <span className="text-sm font-semibold text-white">Organization</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-[#707892]">Company</span><span className="text-white">Shivohini Tech LLP</span></div>
              <div className="flex justify-between"><span className="text-[#707892]">Plan</span><span className="text-[#ff9a4d] font-medium">Internship</span></div>
              <div className="flex justify-between"><span className="text-[#707892]">Project</span><span className="text-white">FireSafe BOQ Estimator</span></div>
            </div>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-[#ff9a4d]" />
              <span className="text-sm font-semibold text-white">Security</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-2 text-xs text-[#98a0b3] hover:text-white bg-[#0a1228] border border-[#1d3563] rounded-lg px-3 py-2.5 transition-colors"
              >
                <KeyRound size={13} /> Change Password
              </button>
              <div className="flex items-center justify-between py-1 opacity-50">
                <span className="text-xs text-[#98a0b3]">Two-factor auth</span>
                <NotAvailableBadge />
              </div>
            </div>
          </div>

          <div className="bg-[#0d1730] border border-[#16294e] rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-3">Need help?</div>
            <p className="text-xs text-[#707892] mb-4">Reach out to your team lead or check the project README for setup instructions.</p>
          </div>
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}