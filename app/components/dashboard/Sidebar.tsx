"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, BarChart3, 
  Settings, Users, LogOut, Sparkles, PlusCircle 
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FileText, label: "My Blogs", path: "/dashboard/blogs" },
  { icon: PlusCircle, label: "Create Post", path: "/dashboard/create" },
  // { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Users, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 z-[100]">
      {/* --- LOGO --- */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-lg">E</span>
        </div>
        <span className="text-xl font-black tracking-tighter uppercase text-slate-900">Entrovex</span>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* --- PREMIUM CARD --- */}
      {/* <div className="mt-auto bg-slate-900 rounded-3xl p-5 relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <Sparkles className="text-blue-400 mb-3" size={20} />
        <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-2">Upgrade to Pro</p>
        <p className="text-slate-400 text-[10px] mb-4 leading-relaxed">Get unlimited AI writing & SEO tools.</p>
        <button className="w-full py-2 bg-white text-slate-900 font-black text-[10px] uppercase rounded-xl hover:bg-blue-400 transition-all">
          Upgrade Now
        </button>
      </div> */}

      {/* --- LOGOUT --- */}
      <button className="mt-6 flex items-center gap-3 px-4 py-3 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all">
        <LogOut size={18} />
        Log Out
      </button>
    </aside>
  );
}