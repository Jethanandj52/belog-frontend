"use client";
import Sidebar from "../components/dashboard/Sidebar";
import UserMenu from "../components/dashboard/UserMenu"; // Path check karlein apne folder structure ke hisab se

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Sidebar />
      
      {/* Top Navbar */}
      <header className="lg:ml-64 h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* ✅ Ab yahan apka updated UserMenu show hoga */}
          <UserMenu />
        </div>
      </header>

      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  );
}