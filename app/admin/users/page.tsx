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
  Users,
  ShieldCheck,
  Zap
} from "lucide-react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  role?: "admin" | "author" | "guest";
  isActive?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slash fix for double slashes in URL
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://belogbackend.vercel.app").replace(/\/$/, "");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      // Correct endpoint as per your backend route
      const res = await axios.get(`${API_BASE}/auth/getAllUsers`, getHeaders());
      
      if (res.data.success) {
        setUsers(res.data.users || []);
      } else {
        setError("Protocol rejected data access.");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Secure Connection Failed");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await axios.put(`${API_BASE}/api/auth/update-role/${id}`, { role: newRole }, getHeaders());
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole as any } : u));
      }
    } catch (err) { alert("Access Denied: Admin Clearance Required"); }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await axios.put(`${API_BASE}/api/auth/toggle-status/${id}`, {}, getHeaders());
      if (res.data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
      }
    } catch (err) { alert("Core Override Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Purge this identity from neural records?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/auth/admin-delete-user/${id}`, getHeaders());
      if (res.data.success) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) { alert("Purge Failed: Security Blocked"); }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-10 selection:bg-[#9b2dee]/30">
      
      {/* HEADER SECTION - Fully Responsive */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#11011A]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-gradient-to-br from-[#9b2dee] to-[#ff00c8] rounded-2xl md:rounded-3xl shadow-[0_0_20px_rgba(155,45,238,0.4)]">
            <Users size={28} className="text-white md:size-8" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-[1000] tracking-tighter uppercase italic text-white leading-none truncate">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Protocol</span>
            </h1>
            <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/40 mt-2 truncate">
              Centralized Identity Management
            </p>
          </div>
        </div>

        <button 
          onClick={fetchUsers}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#9b2dee] hover:text-white transition-all duration-300 active:scale-95"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Re-Scan Network
        </button>
      </motion.div>

      {/* DATA AREA */}
      <div className="relative z-10 bg-[#11011A]/40 backdrop-blur-md border border-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* DESKTOP TABLE (Visible on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 lg:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Identity</th>
                <th className="p-6 lg:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Clearance</th>
                <th className="p-6 lg:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                <th className="p-6 lg:p-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? <TableSkeleton /> : error ? <ErrorView message={error} /> : (
                <AnimatePresence mode="popLayout">
                  {users.map((user) => (
                    <UserRow key={user._id} user={user} onRole={handleRoleChange} onToggle={handleToggleStatus} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST (Visible on sm only) */}
        <div className="md:hidden divide-y divide-white/5 p-4 space-y-4">
          {loading ? <p className="text-center text-[10px] uppercase font-black py-10 text-white/20 animate-pulse">Scanning...</p> : 
           users.map((user) => (
             <UserMobileCard key={user._id} user={user} onRole={handleRoleChange} onToggle={handleToggleStatus} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================
// SUB-COMPONENTS (Clean & Responsive)
// =============================

const UserRow = ({ user, onRole, onToggle, onDelete }: any) => (
  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/[0.03] transition-colors">
    <td className="p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#9b2dee]/10 border border-white/5 flex items-center justify-center font-black text-[#9b2dee] text-lg group-hover:border-[#9b2dee]/40 transition-all uppercase">
          {user.username[0]}
        </div>
        <div className="min-w-0">
          <h4 className="font-black uppercase italic tracking-tighter text-white text-base truncate">{user.username}</h4>
          <div className="flex items-center gap-2 text-white/30 group-hover:text-white/60 transition-colors">
            <Mail size={10} className="text-[#ff00c8]" />
            <span className="text-[10px] font-bold truncate">{user.email}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="p-6">
      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
        user.role === 'admin' ? 'bg-[#9b2dee]/10 border-[#9b2dee]/50 text-[#9b2dee]' : 'bg-white/5 border-white/10 text-white/40'
      }`}>
        {user.role || "Operator"}
      </span>
    </td>
    <td className="p-6">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]' : 'bg-white/10'}`} />
        <span className={`text-[10px] font-black uppercase ${user.isActive ? 'text-[#00ff9d]' : 'text-white/20'}`}>
          {user.isActive ? 'Active' : 'Locked'}
        </span>
      </div>
    </td>
    <td className="p-6">
      <div className="flex justify-end gap-2">
        <ActionBtn onClick={() => onRole(user._id, "author")} icon={<User size={14} />} hoverColor="hover:bg-blue-600" />
        <ActionBtn onClick={() => onRole(user._id, "admin")} icon={<Crown size={14} />} hoverColor="hover:bg-[#9b2dee]" />
        <ActionBtn onClick={() => onToggle(user._id)} icon={<Power size={14} />} hoverColor={user.isActive ? "hover:bg-orange-600" : "hover:bg-emerald-600"} />
        <ActionBtn onClick={() => onDelete(user._id)} icon={<Trash2 size={14} />} hoverColor="hover:bg-red-600" />
      </div>
    </td>
  </motion.tr>
);

const UserMobileCard = ({ user, onRole, onToggle, onDelete }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#9b2dee]/20 flex items-center justify-center font-black text-[#9b2dee] uppercase">{user.username[0]}</div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-black text-white italic uppercase truncate">{user.username}</h4>
        <p className="text-[9px] text-white/40 truncate">{user.email}</p>
      </div>
      <div className={`px-2 py-1 rounded-md text-[8px] font-black border ${user.isActive ? 'border-[#00ff9d] text-[#00ff9d]' : 'border-white/10 text-white/20'}`}>
        {user.isActive ? 'ACTIVE' : 'LOCKED'}
      </div>
    </div>
    <div className="flex justify-between items-center gap-2 pt-3 border-t border-white/5">
       <span className="text-[9px] font-black text-[#9b2dee] uppercase">{user.role || "Operator"}</span>
       <div className="flex gap-2">
         <ActionBtn onClick={() => onToggle(user._id)} icon={<Power size={14} />} />
         <ActionBtn onClick={() => onDelete(user._id)} icon={<Trash2 size={14} />} />
       </div>
    </div>
  </div>
);

const ActionBtn = ({ onClick, icon, hoverColor = "hover:bg-white/10" }: any) => (
  <button 
    onClick={onClick} 
    className={`p-2.5 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all border border-white/5 active:scale-90 ${hoverColor}`}
  >
    {icon}
  </button>
);

const ErrorView = ({ message }: { message: string }) => (
  <tr>
    <td colSpan={4} className="p-20 text-center">
      <ShieldAlert size={40} className="mx-auto text-red-500 mb-4 animate-pulse" />
      <p className="text-red-500 text-xs font-black uppercase tracking-widest">{message}</p>
    </td>
  </tr>
);

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-6"><div className="flex gap-4"><div className="w-12 h-12 bg-white/5 rounded-xl"/><div className="space-y-2"><div className="h-4 w-24 bg-white/5 rounded"/><div className="h-3 w-32 bg-white/5 rounded"/></div></div></td>
        <td className="p-6"><div className="h-6 w-16 bg-white/5 rounded-lg"/></td>
        <td className="p-6"><div className="h-4 w-12 bg-white/5 rounded-full"/></td>
        <td className="p-6"><div className="h-10 w-32 bg-white/5 rounded-xl ml-auto"/></td>
      </tr>
    ))}
  </>
);