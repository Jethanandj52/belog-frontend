"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginForm, RegisterForm } from "./AuthForms";
import { ForgotForm, OTPForm, ResetPasswordForm } from "./RecoveryForms";

type AuthMode = "login" | "register" | "forgot" | "otp" | "reset";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", email: "", password: "", confirmPassword: "", otp: "", newPassword: "" 
  });

  const API_URL = "http://localhost:5000/auth";

  // 1. Login aur Register handle karne ke liye
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(mode === "login" ? "Logging in..." : "Creating account...");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const { data } = await axios.post(`${API_URL}/${endpoint}`, formData);

      if (data.success) {
        toast.success(data.message || "Success!", { id: toastId });

        if (mode === "login") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.id);

          const isAdmin = data.role === "admin" || formData.email === "jethanandj52@gmail.com";
          
          // Thoda delay taaki user success message dekh sake
          setTimeout(() => {
            window.location.href = isAdmin ? "/admin" : "/home";
          }, 1000);
        } else {
          setMode("login");
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 2. Forgot Password (OTP Send)
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Sending OTP to your email...");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/forgot-password`, { email: formData.email });
      if (data.success) { 
        toast.success("OTP sent successfully!", { id: toastId }); 
        setMode("otp"); 
      }
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to send OTP", { id: toastId }); 
    } finally { 
      setLoading(false); 
    }
  };

  // 3. OTP Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Verifying code...");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/verify-otp`, { 
        email: formData.email, 
        otp: formData.otp 
      });
      if (data.success) { 
        toast.success("Identity verified!", { id: toastId }); 
        setMode("reset"); 
      }
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Invalid OTP", { id: toastId }); 
    } finally { 
      setLoading(false); 
    }
  };

  // 4. Password Reset
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
    }
    const toastId = toast.loading("Updating password...");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/reset-password`, { 
        email: formData.email, 
        newPassword: formData.newPassword, 
        confirmPassword: formData.confirmPassword 
      });
      if (data.success) { 
        toast.success("Password updated! Please login.", { id: toastId }); 
        setMode("login"); 
      }
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Reset failed", { id: toastId }); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-black transition-colors">
              <X />
            </button>
            
            <div className="text-center mb-8 uppercase">
              <h2 className="text-3xl font-[1000] tracking-tighter text-slate-900">{mode}</h2>
              <div className="h-1.5 w-12 bg-blue-600 mx-auto mt-2 rounded-full" />
            </div>

            {/* Forms Components */}
            <div className="min-h-[300px] flex flex-col justify-center">
                {mode === "login" && <LoginForm {...{formData, setFormData, setMode, loading, handleSubmit: handleAuth}} />}
                {mode === "register" && <RegisterForm {...{formData, setFormData, loading, handleSubmit: handleAuth}} />}
                {mode === "forgot" && <ForgotForm {...{formData, setFormData, loading, handleForgot}} />}
                {mode === "otp" && <OTPForm {...{formData, setFormData, loading, handleVerify}} />}
                {mode === "reset" && <ResetPasswordForm {...{formData, setFormData, loading, handleReset}} />}
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center text-sm font-bold text-slate-500">
              {mode === "login" ? (
                <p>New here? <button onClick={() => setMode("register")} className="text-blue-600 hover:underline">Create Account</button></p>
              ) : (
                <button onClick={() => setMode("login")} className="text-blue-600 hover:underline">Back to Login</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}