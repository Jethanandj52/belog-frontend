"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Calendar, Edit2, Share2, Award, X, ShieldCheck } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast"; // 1. Import Toasts

interface UserType {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [updating, setUpdating] = useState(false);

  // Custom Toast Style
  const glassToastStyle = {
    background: "rgba(26, 1, 46, 0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 0, 200, 0.3)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "15px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const { data } = await axios.get(
          `https://belogbackend.vercel.app/auth/getUserById/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setUser(data.user);
          setFormData({ username: data.user.username, email: data.user.email });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    // Loading toast start
    const loadingToast = toast.loading("Syncing with Network...", { style: glassToastStyle });

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "https://belogbackend.vercel.app/auth/edit-user",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUser(data.user);
        if (data.token) localStorage.setItem("token", data.token);
        setIsEditing(false);
        // 2. Success Toast
        toast.success("Identity Updated Successfully!", { id: loadingToast, style: glassToastStyle });
      }
    } catch (err: any) {
      // 3. Error Toast
      const errMsg = err.response?.data?.message || "Update failed";
      toast.error(errMsg, { id: loadingToast, style: glassToastStyle });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0118]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-t-2 border-[#ff00c8] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-2 border-[#9b2dee] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Syncing Identity...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0118] text-white p-4 sm:p-6 md:p-8 relative selection:bg-[#ff00c8] selection:text-white overflow-x-hidden">
      {/* 4. Add Toaster Component */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Banner & Avatar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-44 md:mb-32"
        >
          {/* Futuristic Banner */}
          <div className="h-48 sm:h-56 md:h-64 w-full bg-gradient-to-br from-[#1a012e] via-[#9b2dee]/20 to-[#ff00c8]/20 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#ff00c8]" /> <span className="hidden sm:inline">Secure Profile</span><span className="sm:hidden">Secure</span>
            </div>
          </div>

          <div className="absolute -bottom-24 md:-bottom-20 left-0 md:left-10 w-full md:w-auto flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 px-4 md:px-0 text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3rem] border-4 md:border-8 border-[#0d0118] bg-[#1a012e] overflow-hidden shadow-[0_0_50px_rgba(255,0,200,0.2)] relative group">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt="avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#ff00c8]/10 group-hover:bg-transparent transition-all"></div>
            </div>
            <div className="mb-2 md:mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-[1000] tracking-tighter text-white uppercase italic leading-none">{user?.username}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 md:mt-3">
                <span className="h-2 w-2 rounded-full bg-[#ff00c8] animate-pulse shadow-[0_0_10px_#ff00c8]" />
                <p className="text-[#ff00c8] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Verified Creator</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-36 md:-bottom-10 left-0 right-0 md:left-auto md:right-0 flex justify-center md:justify-end gap-3 md:gap-4 px-4">
            <button className="p-4 md:p-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-xl hover:bg-[#ff00c8]/20 hover:border-[#ff00c8]/40 transition-all text-white/60 hover:text-white">
               <Share2 size={18} />
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-4 md:py-5 bg-white text-black rounded-xl md:rounded-2xl font-[1000] text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-[#ff00c8] hover:text-white transition-all shadow-2xl active:scale-[0.98]"
            >
               <Edit2 size={14} /> Edit Identity
            </button>
          </div>
        </motion.div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-xl">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#ff00c8] mb-6 md:mb-8">Metadata</h4>
              <div className="space-y-4 md:space-y-5">
                <DetailRow icon={<Mail size={14}/>} text={user?.email} />
                <DetailRow icon={<MapPin size={14}/>} text="Cyberspace / Earth" />
                <DetailRow icon={<Calendar size={14}/>} text="Node Joined 2026" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-xl">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#ff00c8] mb-6 md:mb-8">Reputation Stats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <Badge icon={<Award size={20} className="text-[#9b2dee]" />} title="Author Rank" desc="Starter Node" />
                <Badge icon={<Award size={20} className="text-[#ff00c8]" />} title="Platform Role" desc="Master Creator" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- EDIT MODAL --- */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-[#0d0118]/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-[#1a012e] border border-white/10 w-full max-w-md rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative z-[210]"
              >
                <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-white/20 hover:text-[#ff00c8] transition-all">
                  <X size={24} />
                </button>
                <h3 className="text-2xl sm:text-3xl font-[1000] uppercase tracking-tighter italic mb-8">Update <span className="text-[#ff00c8]">Profile</span></h3>
                
                <form onSubmit={handleUpdate} className="space-y-5 md:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Digital Pseudonym</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full p-4 sm:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 outline-none focus:border-[#ff00c8]/50 font-bold text-white transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Communication Link</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 sm:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 outline-none focus:border-[#ff00c8]/50 font-bold text-white transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={updating}
                    className="w-full py-4 sm:py-5 bg-white text-black rounded-xl md:rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-[#ff00c8] hover:text-white transition-all disabled:opacity-50 mt-4"
                  >
                    {updating ? "SYNCING..." : "COMMIT CHANGES"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-components
function DetailRow({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 md:gap-4 text-white/60 text-[10px] md:text-[11px] font-bold tracking-widest break-all">
      <span className="text-[#ff00c8] p-2.5 md:p-3 bg-white/5 rounded-xl border border-white/5 flex-shrink-0">{icon}</span> {text}
    </div>
  );
}

function Badge({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 group hover:border-[#ff00c8]/30 transition-all">
      <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl shadow-xl group-hover:scale-110 transition-transform flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] md:text-[10px] font-[1000] uppercase tracking-widest text-white">{title}</p>
        <p className="text-[8px] md:text-[9px] font-black text-[#ff00c8] uppercase tracking-tighter mt-1 opacity-70">{desc}</p>
      </div>
    </div>
  );
}