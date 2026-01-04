"use client";
import React, { useState } from "react";
import { Shield, Bell, Eye, Smartphone, Lock, Loader2 } from "lucide-react";
import axios from "axios";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  // Change Password Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:5000/auth/change-password", passwords, {
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
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">System Preferences</h2>
      
      {/* 1. Change Password Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Lock size={20}/></div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Update</h4>
        </div>
        
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="password" 
            placeholder="Current Password"
            className="p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
            value={passwords.currentPassword}
          />
          <input 
            type="password" 
            placeholder="New Password"
            className="p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            value={passwords.newPassword}
          />
            
          <button 
            type="submit"
            className="bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin"/> : "Update Password"}
          </button>
        </form>
      </div>

      {/* 2. Toggles Section */}
      <SettingSection title="Privacy & Notifications">
        <SettingToggle icon={<Shield size={18}/>} label="Two-Factor Auth" sub="Request code on login" active />
        <SettingToggle icon={<Bell size={18}/>} label="Email Alerts" sub="Activity summaries via mail" active />
      </SettingSection>

      {/* 3. Danger Zone */}
      <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex justify-between items-center group">
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-widest text-red-600">Danger Zone</h4>
          <p className="text-[10px] font-bold text-red-400 uppercase mt-1">Erase all your data forever</p>
        </div>
        <button 
          onClick={() => { if(confirm("Are you sure?")) { /* Add Delete API Call */ } }}
          className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-red-700 transition-all shadow-lg"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

// Helper components remain the same...
function SettingSection({ title, children }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SettingToggle({ icon, label, sub, active = false }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl transition-colors ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-900">{label}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{sub}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? "bg-blue-600" : "bg-slate-200"}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? "left-7" : "left-1"}`} />
      </div>
    </div>
  );
}