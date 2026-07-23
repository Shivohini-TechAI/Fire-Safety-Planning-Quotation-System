"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { isAxiosError } from "axios";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
  role: z.enum(["engineer","admin","reviewer","lead"]),
});
type FormData = z.infer<typeof schema>;

const strengthChecks = [
  { label: "8+ characters",       test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",              test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character",   test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "engineer" },
  });

  const password = watch("password") ?? "";
  const passedChecks = strengthChecks.filter(c => c.test(password)).length;
  const strengthColor = ["bg-red-500","bg-orange-500","bg-amber-400","bg-green-500"][Math.max(0,passedChecks-1)] ?? "bg-[#1d3563]";
  const strengthLabel = ["","Weak","Fair","Good","Strong"][passedChecks] ?? "";

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post("/auth/signup", {
        full_name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created! Please sign in.");
      onSwitch();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Registration failed. Please try again."
        : "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: FormData) => signupMutation.mutate(data);

  const inputBase = "w-full bg-[#0a1228] border rounded-lg px-4 py-3 text-sm text-white placeholder-[#5a6275] outline-none transition-all duration-200";
  const inputClass = (err?: boolean) =>
    `${inputBase} ${err ? "border-red-500/60 focus:border-red-400" : "border-[#1d3563] focus:border-[#ff7a1a] focus:ring-1 focus:ring-[#ff7a1a]/20"}`;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-1.5 tracking-tight">Create account</h2>
      <p className="text-sm text-[#98a0b3] mb-8">Join your team&apos;s BOQ workspace</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Full Name</label>
            <input {...register("name")} type="text" placeholder="Your name" className={inputClass(!!errors.name)}/>
            {errors.name && <p className="text-xs text-red-400 mt-1">⚠ {errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Role</label>
            <select {...register("role")} className={inputClass() + " appearance-none"}>
              <option value="engineer">Fire Engineer</option>
              <option value="admin">Admin</option>
              <option value="reviewer">Reviewer</option>
              <option value="lead">Team Lead</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Email</label>
          <input {...register("email")} type="email" placeholder="you@company.com" className={inputClass(!!errors.email)} autoComplete="email"/>
          {errors.email && <p className="text-xs text-red-400 mt-1">⚠ {errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#98a0b3] uppercase tracking-widest mb-1.5">Password</label>
          <div className="relative">
            <input {...register("password")} type={showPass ? "text" : "password"} placeholder="Min 8 characters"
              className={inputClass(!!errors.password) + " pr-11"}/>
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6275] hover:text-[#98a0b3] transition-colors">
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passedChecks ? strengthColor : "bg-[#1d3563]"}`}/>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {strengthChecks.map(c => (
                    <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.test(password) ? "text-green-400" : "text-[#5a6275]"}`}>
                      {c.test(password) ? <Check size={9}/> : <X size={9}/>} {c.label}
                    </span>
                  ))}
                </div>
                <span className={`text-[10px] font-semibold ${strengthColor.replace("bg-","text-")}`}>{strengthLabel}</span>
              </div>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-400 mt-1">⚠ {errors.password.message}</p>}
        </div>

        <button type="submit" disabled={signupMutation.isPending}
          className="w-full bg-[#ff7a1a] hover:bg-[#f06400] disabled:opacity-70 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 mt-2 text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
          {signupMutation.isPending ? <><Loader2 size={15} className="animate-spin"/> Creating…</> : "Create Account →"}
        </button>
      </form>

      <p className="text-center text-xs text-[#707892] mt-5">
        Have an account?{" "}
        <button onClick={onSwitch} className="text-[#ff9a4d] hover:underline font-medium">Sign in</button>
      </p>
    </div>
  );
}
