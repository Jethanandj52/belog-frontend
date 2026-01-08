"use client";
import { User, Mail, Lock, Loader2, ArrowRight, Zap, ShieldCheck } from "lucide-react";

// Helper style for inputs to avoid repetition
const inputStyles = "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none text-white placeholder:text-white/30 focus:border-[#e300b4]/50 focus:ring-1 focus:ring-[#e300b4]/20 transition-all backdrop-blur-md";
const iconStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-[#9b2dee]";

export const LoginForm = ({ formData, setFormData, setMode, loading, handleSubmit }: any) => (
  <form onSubmit={handleSubmit} className="space-y-5">
    <div className="relative group">
      <Mail className={`${iconStyles} group-focus-within:text-[#e300b4] transition-colors`} size={18} />
      <input
        type="email" placeholder="Enter Your Email" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    
    <div className="relative group">
      <Lock className={`${iconStyles} group-focus-within:text-[#e300b4] transition-colors`} size={18} />
      <input
        type="password" placeholder="Enter Your Password" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>

    <div className="flex justify-end">
      <button 
        type="button" 
        onClick={() => setMode("forgot")} 
        className="text-[10px] font-black uppercase tracking-widest text-[#9b2dee] hover:text-[#e300b4] transition-colors"
      >
      Forget Password?
      </button>
    </div>

    <button 
      disabled={loading} 
      className="w-full py-5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white font-[950] rounded-2xl shadow-[0_0_20px_rgba(227,0,180,0.3)] hover:shadow-[#e300b4]/60 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="animate-spin text-white" />
      ) : (
        <>Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
      )}
    </button>
  </form>
);

export const RegisterForm = ({ formData, setFormData, loading, handleSubmit }: any) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="relative group">
      <User className={iconStyles} size={18} />
      <input
        type="text" placeholder="User Name" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
    </div>

    <div className="relative group">
      <Mail className={iconStyles} size={18} />
      <input
        type="email" placeholder="Enter your email" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>

    <div className="relative group">
      <Lock className={iconStyles} size={18} />
      <input
        type="password" placeholder="Enter Your Password" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>

    <div className="relative group">
      <ShieldCheck className={iconStyles} size={18} />
      <input
        type="password" placeholder="Enter Your Confirm Password" required
        className={inputStyles}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />
    </div>

    <button 
      disabled={loading} 
      className="w-full mt-2 py-5 bg-white/10 border border-white/20 text-white font-[950] rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] shadow-xl backdrop-blur-md"
    >
      {loading ? (
        <Loader2 className="animate-spin text-white" />
      ) : (
        <>Register<Zap size={16} className="fill-[#e300b4] text-[#e300b4]" /></>
      )}
    </button>
  </form>
);