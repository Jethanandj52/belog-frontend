"use client";
import { Mail, ShieldCheck, KeyRound, Loader2, Lock } from "lucide-react";

// shared styles (same as login)
const inputStyles =
  "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none text-white placeholder:text-white/30 focus:border-[#e300b4]/50 focus:ring-1 focus:ring-[#e300b4]/20 transition-all backdrop-blur-md";

const iconStyles =
  "absolute left-4 top-1/2 -translate-y-1/2 text-[#9b2dee] group-focus-within:text-[#e300b4] transition-colors";

// ================= FORGOT =================
export const ForgotForm = ({ setFormData, loading, handleForgot }: any) => (
  <form onSubmit={handleForgot} className="space-y-5">
    <div className="relative group">
      <Mail className={iconStyles} size={18} />
      <input
        type="email"
        placeholder="Enter Registered Email"
        required
        className={inputStyles}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, email: e.target.value }))
        }
      />
    </div>

    <button
      disabled={loading}
      className="w-full py-5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white font-[950] rounded-2xl shadow-[0_0_20px_rgba(227,0,180,0.3)] hover:shadow-[#e300b4]/60 transition-all uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "SEND OTP"}
    </button>
  </form>
);

// ================= OTP =================
export const OTPForm = ({ setFormData, loading, handleVerify }: any) => (
  <form onSubmit={handleVerify} className="space-y-5">
    <div className="relative group">
      <ShieldCheck className={iconStyles} size={18} />
      <input
        type="number"
        placeholder="6 Digit OTP"
        required
        className={`${inputStyles} text-center text-2xl tracking-[0.5em]`}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, otp: e.target.value }))
        }
      />
    </div>

    <button
      disabled={loading}
      className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-[950] rounded-2xl shadow-lg hover:shadow-emerald-500/50 transition-all uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "VERIFY OTP"}
    </button>
  </form>
);

// ================= RESET =================
export const ResetPasswordForm = ({
  setFormData,
  loading,
  handleReset,
}: any) => (
  <form onSubmit={handleReset} className="space-y-5">
    <div className="relative group">
      <KeyRound className={iconStyles} size={18} />
      <input
        type="password"
        placeholder="New Password"
        required
        className={inputStyles}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            newPassword: e.target.value,
          }))
        }
      />
    </div>

    <div className="relative group">
      <Lock className={iconStyles} size={18} />
      <input
        type="password"
        placeholder="Confirm New Password"
        required
        className={inputStyles}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            confirmPassword: e.target.value,
          }))
        }
      />
    </div>

    <button
      disabled={loading}
      className="w-full py-5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white font-[950] rounded-2xl shadow-[0_0_20px_rgba(227,0,180,0.3)] hover:shadow-[#e300b4]/60 transition-all uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        "UPDATE PASSWORD"
      )}
    </button>
  </form>
);
