"use client";
import { useState } from "react";
import Navbar from "../components/Navbar"; // Path check karlein
import AuthModal from "../components/AuthModal"; // Path check karlein
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Modal ki state yahan handle hogi
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar ko function pass kiya jo state true karega */}
      <Navbar onJoinClick={() => setIsAuthOpen(true)} />

      <main>{children}</main>
<Footer/>
      {/* AuthModal ko state aur close function pass kiya */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
}