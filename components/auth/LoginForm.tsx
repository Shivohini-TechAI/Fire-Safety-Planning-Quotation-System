"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email:       z.string().email("Please enter a valid email"),
  password:    z.string().min(6, "Password must be at least 6 characters"),
  rememberMe:  z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginForm({ onSwitch, onForgot }: { onSwitch: () => void; onForgot: () => void }) {
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: POST /api/auth/login → { email, password } → receive JWT
      await new Promise(r => setTimeout(r, 800));
      login({ name: data.email.split("@")[0], email: data.email, role: "engineer" });
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    }
  };

  const inputBase = "w-full bg-[#0a1228] border rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#5a6275] outline-none transition-all duration-200";
  const inputClass = (err?: boolean) =>
    `${inputBase} ${err ? "border-red-500/60 focus:border-red-400" : "border-[#1d3563] focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20"}`;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-1.5 tracking-tight">Welcome back</h2>
      <p className="text-sm text-[#98a0b3] mb-9">
        {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"} — sign in to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-2">Email</label>
          <input {...register("email")} type="email" placeholder="you@company.com" className={inputClass(!!errors.email)} autoComplete="email"/>
          {errors.email && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">⚠ {errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest">Password</label>
            <button type="button" onClick={onForgot} className="text-xs text-[#ff9a4d] hover:underline transition-colors">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••"
              className={inputClass(!!errors.password) + " pr-11"} autoComplete="current-password"/>
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6275] hover:text-[#98a0b3] transition-colors">
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1.5">⚠ {errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input {...register("rememberMe")} type="checkbox" className="accent-[#ff7a1a] w-4 h-4 rounded"/>
          <span className="text-xs text-[#98a0b3]">Remember me for 30 days</span>
        </label>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-70 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 mt-3 text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
          {isSubmitting ? <><Loader2 size={15} className="animate-spin"/> Signing in…</> : "Sign In →"}
        </button>
      </form>

      <p className="text-center text-xs text-[#707892] mt-6">
        No account?{" "}
        <button onClick={onSwitch} className="text-[#ff9a4d] hover:underline font-medium transition-colors">Create one</button>
      </p>
    </div>
  );
}
