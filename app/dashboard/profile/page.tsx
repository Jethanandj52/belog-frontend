"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Calendar, Edit2, Share2, Award, Loader2, X } from "lucide-react";
import axios from "axios";

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

  // --- Real Data Fetching ---
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

  // --- Edit User Function ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "https://belogbackend.vercel.app/auth/edit-user",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUser(data.user);
        if (data.token) localStorage.setItem("token", data.token); // New token update
        setIsEditing(false);
        alert("Profile Updated!");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Banner & Avatar Section */}
      <div className="relative mb-24">
        <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-lg"></div>
        <div className="absolute -bottom-16 left-10 flex items-end gap-6">
          <div className="w-32 h-32 rounded-[2rem] border-8 border-[#f8fafc] bg-slate-200 overflow-hidden shadow-xl">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt="avatar" />
          </div>
          <div className="mb-4">
            <h2 className="text-3xl font-[1000] tracking-tighter text-slate-900 uppercase">{user?.username}</h2>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Verified Member</p>
          </div>
        </div>
        <div className="absolute -bottom-10 right-0 flex gap-2">
          <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-600">
             <Share2 size={18} />
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
             <Edit2 size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Account Information</h4>
            <div className="mt-6 space-y-3">
              <DetailRow icon={<Mail size={14}/>} text={user?.email} />
              <DetailRow icon={<MapPin size={14}/>} text="Location Not Set" />
              <DetailRow icon={<Calendar size={14}/>} text="Member Since 2025" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">User Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <Badge icon={<Award className="text-orange-500" />} title="Author Rank" desc="Starter" />
              <Badge icon={<Award className="text-blue-500" />} title="Platform Role" desc="Creator" />
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Update Profile</h3>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
              <button 
                type="submit"
                disabled={updating}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function DetailRow({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 text-slate-600 text-xs font-bold tracking-tight">
      <span className="text-slate-300 p-2 bg-slate-50 rounded-lg">{icon}</span> {text}
    </div>
  );
}

function Badge({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{title}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase">{desc}</p>
      </div>
    </div>
  );
}