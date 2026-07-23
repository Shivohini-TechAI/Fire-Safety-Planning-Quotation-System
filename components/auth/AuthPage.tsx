"use client";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthIllustration from "@/components/auth/AuthIllustration";
import { Flame, ShieldCheck } from "lucide-react";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="h-screen w-screen bg-[#060b18] flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <AuthIllustration />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/5 to-transparent" />
        <div className="absolute top-6 left-8 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ff7a1a] flex items-center justify-center shadow-lg shadow-orange-900/30">
            <Flame size={16} className="text-white" />
          </div>
          <span className="text-white font-bold tracking-tight text-base">FireSafe BOQ</span>
        </div>
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-center gap-2 mb-2 text-[#ff9a4d] text-[11px] font-semibold uppercase tracking-widest">
            <ShieldCheck size={12} /> NFPA-13 compliant estimation
          </div>
          <h2 className="text-xl xl:text-2xl font-bold text-white leading-tight mb-1.5">
            Engineering accuracy,<br />built into every BOQ.
          </h2>
          <p className="text-xs text-[#98a0b3] max-w-md leading-relaxed">
            Upload fire-fighting drawings, auto-match sprinklers and hose cabinets,
            and generate client-ready cost reports in minutes.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#ff7a1a]/8 blur-3xl" />
        <div className="w-full max-w-lg relative">
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#ff7a1a] flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">FireSafe BOQ</span>
          </div>
          <div className="bg-[#0d1730] border border-[#16294e] rounded-2xl p-8 sm:p-10 shadow-2xl">
            {mode === "login"    && <LoginForm onSwitch={() => setMode("register")} onForgot={() => setMode("forgot")} />}
            {mode === "register" && <RegisterForm onSwitch={() => setMode("login")} />}
            {mode === "forgot"   && <ForgotPasswordForm onBack={() => setMode("login")} />}
          </div>
          <p className="text-center text-xs text-[#5a6275] mt-5">
            Shivohini Tech LLP · Fire Safety BOQ Cost Estimator
          </p>
        </div>
      </div>
    </div>
  );
}
