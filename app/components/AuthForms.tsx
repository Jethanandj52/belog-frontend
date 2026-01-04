"use client";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export const LoginForm = ({ formData, setFormData, setMode, loading, handleSubmit }: any) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="relative">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="email" placeholder="Email Address" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500/20"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="password" placeholder="Password" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <button type="button" onClick={() => setMode("forgot")} className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
    <button disabled={loading} className="w-full py-5 bg-blue-600 text-white font-[950] rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
      {loading ? <Loader2 className="animate-spin" /> : <>SIGN IN <ArrowRight size={18} /></>}
    </button>
  </form>
);

export const RegisterForm = ({ formData, setFormData, loading, handleSubmit }: any) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="relative">
      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text" placeholder="Username" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
    </div>
    <div className="relative">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="email" placeholder="Email Address" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="password" placeholder="Password" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="password" placeholder="Confirm Password" required
        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold outline-none"
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />
    </div>
    <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-[950] rounded-2xl">
      {loading ? <Loader2 className="animate-spin mx-auto" /> : "CREATE ACCOUNT"}
    </button>
  </form>
);