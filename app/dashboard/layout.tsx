"use client";
import Sidebar from "../components/dashboard/Sidebar";
import UserMenu from "../components/dashboard/UserMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Background: Radial gradient starts from dark purple to almost black
    <div className="bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] min-h-screen relative text-white selection:bg-[#ff00c8]/30">
      
      {/* Background Noise & Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#ff00c8]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-[#9b2dee]/10 blur-[100px] rounded-full" />
      </div>

      {/* Persistent Sidebar */}
      <Sidebar />
      
      {/* Top Navbar: Integrated into the dark theme */}
      <header className="lg:ml-64 h-24 bg-[#0d0118] flex items-center justify-end px-10 sticky top-0 z-50">
        <div className="flex items-center gap-6">
           
          
          <div className="h-10 w-[1px] bg-white/90 mx-2 hidden sm:block" />
          
          {/* Your updated UserMenu will glow here */}
          <UserMenu />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lg:ml-64 relative z-10 p-8 min-h-[calc(100vh-6rem)]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Subtle Sidebar Border Line for visual depth */}
      <div className="fixed left-64 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}