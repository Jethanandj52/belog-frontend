"use client";
import React, { useState } from "react";
import { Shield, Bell, Eye, Lock, Loader2, AlertTriangle, Zap } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);

  // High Quality Toast Theme
  const toastTheme = {
    style: {
      background: "#1a012e",
      color: "#fff",
      border: "1px solid #ff00c8",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow: "0 0 20px rgba(255, 0, 200, 0.2)",
    },
    duration: 4000,
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Client Side Checks
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("All fields are required", toastTheme);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!", toastTheme);
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters", toastTheme);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating security keys...", toastTheme);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("https://belogbackend.vercel.app/auth/change-password", 
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success("Password changed successfully!", { id: toastId, ...toastTheme });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to update", { id: toastId, ...toastTheme });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Connection Error. Try again.";
      toast.error(message, { id: toastId, ...toastTheme });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0118] text-white p-4 sm:p-8 relative selection:bg-[#ff00c8]">
      {/* Toaster with high Z-index to ensure visibility */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        containerStyle={{ zIndex: 99999 }} 
      />
      
      {/* Background Radial Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 md:space-y-10">
        <header>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Account <span className="text-[#ff00c8]">Settings</span>
          </h2>
          <p className="text-white/40 text-sm mt-2">Secure your account and manage preferences</p>
        </header>
        
        {/* Password Section */}
        <section className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#ff00c8]/20 text-[#ff00c8] rounded-xl border border-[#ff00c8]/30 shadow-[0_0_15px_rgba(255,0,200,0.1)]">
              <Lock size={20}/>
            </div>
            <div>
              <h4 className="text-lg font-bold">Password Update</h4>
              <p className="text-sm text-white/30">Enter your old and new password</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="password" 
                placeholder="Current Password"
                className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff00c8] transition-all text-sm w-full focus:bg-white/10"
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                value={passwords.currentPassword}
              />
              <div className="hidden md:block"></div> 
              
              <input 
                type="password" 
                placeholder="New Password"
                className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff00c8] transition-all text-sm w-full focus:bg-white/10"
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                value={passwords.newPassword}
              />
              
              <input 
                type="password" 
                placeholder="Confirm New Password"
                className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#ff00c8] transition-all text-sm w-full focus:bg-white/10"
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                value={passwords.confirmPassword}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-max px-12 bg-white text-black rounded-xl font-bold py-4 hover:bg-[#ff00c8] hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg shadow-white/5"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18} />}
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* Preferences Section */}
        <section className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl">
          <h4 className="text-[#9b2dee] font-bold mb-6 uppercase text-xs tracking-[0.2em]">Preferences</h4>
          <div className="space-y-1">
            <ToggleItem icon={<Shield />} title="Security Alerts" desc="Notifications for unusual logins" active />
            <ToggleItem icon={<Bell />} title="Email Notifications" desc="Weekly summaries of your activity" active />
            <ToggleItem icon={<Eye />} title="Stealth Mode" desc="Hide your profile from public discovery" />
          </div>
        </section>

        {/* Danger Zone */}
        <div className="bg-red-500/5 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-red-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-500">Delete Account</h4>
              <p className="text-sm text-red-500/40">Permanently erase your account and all data</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => toast.error("System Purge is currently disabled", toastTheme)}
            className="w-full md:w-auto px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm uppercase tracking-wider"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ icon, title, desc, active = false }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl transition-all ${active ? "bg-[#ff00c8] text-white shadow-[0_0_15px_rgba(255,0,200,0.3)]" : "bg-white/5 text-white/20"}`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div>
          <p className="font-bold text-sm text-white group-hover:text-white transition-colors">{title}</p>
          <p className="text-xs text-white/30">{desc}</p>
        </div>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition-all border ${active ? "bg-[#ff00c8]/20 border-[#ff00c8]/50" : "bg-white/5 border-white/10"}`}>
        <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${active ? "right-1 bg-[#ff00c8]" : "left-1 bg-white/20"}`} />
      </div>
    </div>
  );
}