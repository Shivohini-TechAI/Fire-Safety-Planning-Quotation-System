"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useRequestPasswordReset } from "@/hooks/usePasswordReset";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const requestReset = useRequestPasswordReset();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    requestReset.mutate(data.email, {
      onSuccess: () => toast.success("Reset link sent!"),
      onError: (err) => {
        const message = isAxiosError(err)
          ? err.response?.data?.message ?? "Failed to send reset link"
          : "Failed to send reset link";
        toast.error(message);
      },
    });
  };

  if (requestReset.isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your email</h2>
        <p className="text-sm text-[#98a0b3] mb-1">We sent a reset link to</p>
        <p className="text-sm text-[#ff9a4d] font-semibold mb-8">{getValues("email")}</p>
        <p className="text-xs text-[#707892] mb-6">Didn&apos;t receive it? Check your spam folder or try again. The link expires in 15 minutes.</p>
        <button onClick={onBack}
          className="flex items-center justify-center gap-2 w-full border border-[#1d3563] hover:border-[#ff7a1a]/40 text-[#98a0b3] hover:text-white text-sm font-semibold py-2.5 rounded-lg transition-all">
          <ArrowLeft size={14} /> Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="w-12 h-12 rounded-xl bg-[#ff7a1a]/15 border border-[#ff7a1a]/25 flex items-center justify-center mb-6">
        <Mail size={20} className="text-[#ff9a4d]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Forgot password?</h2>
      <p className="text-sm text-[#98a0b3] mb-9">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            className="w-full bg-[#0a1228] border border-[#1d3563] rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#5a6275] outline-none focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20 transition-all"
          />
          {errors.email && <p className="text-xs text-red-400 mt-1.5">⚠ {errors.email.message}</p>}
        </div>
        <button type="submit" disabled={requestReset.isPending}
          className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-all text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
          {requestReset.isPending ? <><Loader2 size={15} className="animate-spin"/> Sending…</> : "Send Reset Link"}
        </button>
      </form>

      <button onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-xs text-[#707892] hover:text-white mt-6 transition-colors">
        <ArrowLeft size={13} /> Back to Sign In
      </button>
    </div>
  );
}