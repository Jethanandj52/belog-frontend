"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  RefreshCcw,
  Crown,
  User,
  Trash2,
  Power,
  ShieldAlert,
  Fingerprint,
  Users
} from "lucide-react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  role?: "admin" | "author" | "guest";
  isActive?: boolean;
}

// =============================
// ENHANCED SKELETON (White/Grey contrast)
// =============================
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-b border-white/5">
        <td className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </td>
        <td className="p-6"><div className="h-7 w-20 bg-white/10 rounded-full animate-pulse" /></td>
        <td className="p-6"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
        <td className="p-6 text-right"><div className="h-10 w-36 bg-white/10 ml-auto rounded-xl animate-pulse" /></td>
      </tr>
    ))}
  </>
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/auth/getAllUsers`, getHeaders());
      if (res.data.success) setUsers(res.data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || "Secure Connection Failed");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Action Logic (Same as before but with headers)
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(`${API_BASE}/auth/update-role/${id}`, { role: newRole }, getHeaders());
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole as any } : u));
    } catch (err) { alert("Access Denied"); }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await axios.put(`${API_BASE}/auth/toggle-status/${id}`, {}, getHeaders());
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) { alert("Operation Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent deletion?")) return;
    try {
      await axios.delete(`${API_BASE}/auth/admin-delete-user/${id}`, getHeaders());
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { alert("Security Blocked"); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 lg:p-10  selection:bg-purple-500/30">
      
      {/* GLOW DECORATION */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#16161a] border border-white/10 p-8 rounded-[2rem] shadow-2xl"
      >
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <Users size={32} className="" />
          </div>
          <div className="text-black">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic   leading-none">
              User Protocol
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-purple-400/80 mt-2">
               Centralized Identity Management
            </p>
          </div>
        </div>

        <button 
          onClick={fetchUsers}
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover: transition-all duration-300 active:scale-95"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Database
        </button>
      </motion.div>

      {/* DATA TABLE */}
      <div className="relative z-10 bg-[#16161a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10">
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Details</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Security Clearance</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Connection</th>
                <th className="p-8 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <ShieldAlert size={48} className="mx-auto text-rose-500 mb-4 animate-bounce" />
                    <p className="text-rose-500 text-lg font-black uppercase italic">{error}</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-purple-400 text-xl shadow-inner group-hover:border-purple-500 transition-all">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black  uppercase italic tracking-tighter text-lg leading-tight">
                              {user.username}
                            </h4>
                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                              <Mail size={12} className="text-purple-500" />
                              <span className="text-[11px] font-bold tracking-tight">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                          user.role === 'admin' ? 'bg-purple-600/20 border-purple-500 text-purple-300' :
                          user.role === 'author' ? 'bg-blue-600/20 border-blue-500 text-blue-300' :
                          'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                          {user.role || "Operator"}
                        </span>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse' : 'bg-white/10'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${user.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {user.isActive ? 'Active' : 'Locked'}
                          </span>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleRoleChange(user._id, "author")} className="p-3 bg-white/5 hover:bg-blue-600 hover: text-slate-400 rounded-2xl transition-all border border-white/5"><User size={18} /></button>
                          <button onClick={() => handleRoleChange(user._id, "admin")} className="p-3 bg-white/5 hover:bg-purple-600 hover: text-slate-400 rounded-2xl transition-all border border-white/5"><Crown size={18} /></button>
                          <button onClick={() => handleToggleStatus(user._id)} className={`p-3 bg-white/5 rounded-2xl transition-all border border-white/5 ${user.isActive ? 'hover:bg-orange-600 hover: text-slate-400' : 'hover:bg-emerald-600 hover: text-emerald-400'}`}><Power size={18} /></button>
                          <button onClick={() => handleDelete(user._id)} className="p-3 bg-white/5 hover:bg-rose-600 hover: text-slate-400 rounded-2xl transition-all border border-white/5"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}