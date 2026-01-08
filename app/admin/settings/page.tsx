"use client";
import React, { useState } from "react";
import { Shield, Bell, Lock, Loader2, Zap, Trash2, ShieldCheck } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("https://belogbackend.vercel.app/auth/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        alert("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <Zap size={16} className="text-[#9b2dee] fill-[#9b2dee]" />
        <h2 className="text-2xl md:text-3xl font-[1000] uppercase tracking-tighter italic text-white">
          System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Preferences</span>
        </h2>
      </div>
      
      {/* 1. CHANGE PASSWORD SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#11011A]/60 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#9b2dee]/10 text-[#9b2dee] rounded-xl border border-[#9b2dee]/20">
            <Lock size={20}/>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Security Protocol</h4>
            <p className="text-[9px] font-bold text-[#ff00c8] uppercase">Update access credentials</p>
          </div>
        </div>
        
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Current Key</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-bold text-white focus:border-[#9b2dee] focus:ring-1 focus:ring-[#9b2dee] transition-all"
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              value={passwords.currentPassword}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">New Uplink Key</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-bold text-white focus:border-[#ff00c8] focus:ring-1 focus:ring-[#ff00c8] transition-all"
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              value={passwords.newPassword}
            />
          </div>
            
          <button 
            type="submit"
            className="md:mt-6 h-[52px] bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(155,45,238,0.3)] active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin"/> : "Sync Password"}
          </button>
        </form>
      </motion.div>

      {/* 2. TOGGLES SECTION */}
      <SettingSection title="Privacy & Neural Alerts">
        <SettingToggle icon={<ShieldCheck size={18}/>} label="Neural 2FA" sub="Request biometric code on login" active />
        <SettingToggle icon={<Bell size={18}/>} label="Stream Alerts" sub="Activity summaries via encrypted mail" />
      </SettingSection>

      {/* 3. DANGER ZONE */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-red-950/20 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-red-900/30 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-red-600/50 transition-all"
      >
        <div className="text-center md:text-left">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500">Purge Protocol</h4>
          <p className="text-[10px] font-bold text-red-400/50 uppercase mt-1">Permanently erase your neural footprint</p>
        </div>
        <button 
          onClick={() => { if(confirm("Are you sure?")) { /* Add Delete API Call */ } }}
          className="w-full md:w-auto px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Terminate Account
        </button>
      </motion.div>
    </div>
  );
}

// Sub-components optimized for Dark Theme
function SettingSection({ title, children }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#11011A]/60 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl"
    >
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 ml-2">{title}</h4>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function SettingToggle({ icon, label, sub, active = false }: any) {
  const [isOn, setIsOn] = useState(active);

  return (
    <div 
      onClick={() => setIsOn(!isOn)}
      className="flex items-center justify-between p-4 md:p-5 hover:bg-white/5 rounded-[1.5rem] md:rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-white/5"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`p-3 rounded-xl transition-all duration-500 shrink-0 ${isOn ? "bg-[#ff00c8] text-white shadow-[0_0_15px_#ff00c8]" : "bg-white/5 text-white/20"}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] md:text-xs font-[1000] uppercase tracking-widest text-white truncate">{label}</p>
          <p className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase mt-1 tracking-tighter truncate">{sub}</p>
        </div>
      </div>
      
      {/* Switch Component */}
      <div className={`w-11 h-6 md:w-12 md:h-7 rounded-full relative transition-all duration-500 shrink-0 ${isOn ? "bg-[#ff00c8]/40" : "bg-white/10"}`}>
        <div className={`absolute top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-all duration-500 shadow-lg ${isOn ? "left-6 md:left-6" : "left-1"}`} />
      </div>
    </div>
  );
}