"use client";
import { Mail, ShieldCheck, KeyRound, Loader2,Lock } from "lucide-react";

export const ForgotForm = ({ setFormData, loading, handleForgot }: any) => (
  <form onSubmit={handleForgot} className="space-y-4">
    <div className="relative">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="email" placeholder="Enter Registered Email" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData((prev:any) => ({ ...prev, email: e.target.value }))}
      />
    </div>
    <button disabled={loading} className="w-full py-5 bg-blue-600 text-white font-[950] rounded-2xl">
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "SEND OTP"}
    </button>
  </form>
);

export const OTPForm = ({ setFormData, loading, handleVerify }: any) => (
  <form onSubmit={handleVerify} className="space-y-4">
    <div className="relative">
      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="number" placeholder="6-Digit OTP" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none text-center text-2xl tracking-[0.5em]"
        onChange={(e) => setFormData((prev:any) => ({ ...prev, otp: e.target.value }))}
      />
    </div>
    <button disabled={loading} className="w-full py-5 bg-emerald-600 text-white font-[950] rounded-2xl">
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "VERIFY OTP"}
    </button>
  </form>
);

export const ResetPasswordForm = ({ setFormData, loading, handleReset }: any) => (
  <form onSubmit={handleReset} className="space-y-4">
    <div className="relative">
      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="password" placeholder="New Password" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData((prev:any) => ({ ...prev, newPassword: e.target.value }))}
      />
    </div>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="password" placeholder="Confirm New Password" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData((prev:any) => ({ ...prev, confirmPassword: e.target.value }))}
      />
    </div>
    <button disabled={loading} className="w-full py-5 bg-blue-600 text-white font-[950] rounded-2xl">
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "UPDATE PASSWORD"}
    </button>
  </form>
);