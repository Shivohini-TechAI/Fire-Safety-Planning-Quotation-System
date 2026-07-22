"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useResetPassword } from "@/hooks/usePasswordReset";

const schema = z.object({
  newPassword: z.string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});
type FormData = z.infer<typeof schema>;

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (!token) return;
    resetPassword.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset — please sign in");
          setTimeout(() => router.push("/"), 1500);
        },
        onError: (err) => {
          const message = isAxiosError(err)
            ? err.response?.data?.message ?? "Reset failed — the link may have expired"
            : "Reset failed";
          toast.error(message);
        },
      }
    );
  };

  const inputClass = "w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18] p-4">
        <div className="bg-[#0d1730] border border-[#16294e] rounded-2xl p-8 w-full max-w-md text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid link</h2>
          <p className="text-sm text-[#98a0b3]">This reset link is missing its token. Please request a new one from the sign-in page.</p>
        </div>
      </div>
    );
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18] p-4">
        <div className="bg-[#0d1730] border border-[#16294e] rounded-2xl p-8 w-full max-w-md text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Password reset!</h2>
          <p className="text-sm text-[#98a0b3]">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060b18] p-4">
      <div className="bg-[#0d1730] border border-[#16294e] rounded-2xl p-8 w-full max-w-md">
        <div className="w-12 h-12 rounded-xl bg-[#ff7a1a]/15 border border-[#ff7a1a]/25 flex items-center justify-center mb-6">
          <KeyRound size={20} className="text-[#ff9a4d]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Set a new password</h2>
        <p className="text-sm text-[#98a0b3] mb-8">Choose a strong new password for your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-2">New Password</label>
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showPass ? "text" : "password"}
                placeholder="Min 8 characters"
                className={inputClass + " pr-11"}
              />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6275] hover:text-[#98a0b3] transition-colors">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-400 mt-1.5">⚠ {errors.newPassword.message}</p>}
          </div>
          <button type="submit" disabled={resetPassword.isPending}
            className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-all text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
            {resetPassword.isPending ? <><Loader2 size={15} className="animate-spin"/> Resetting…</> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060b18]" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}