"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginForm, RegisterForm } from "./AuthForms";
import { ForgotForm, OTPForm, ResetPasswordForm } from "./RecoveryForms";

type AuthMode = "login" | "register" | "forgot" | "otp" | "reset";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    newPassword: "",
  });

  const API_URL = "https://belogbackend.vercel.app/auth";

  // ================= LOGIN / REGISTER =================
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      mode === "login" ? "Logging in..." : "Creating account..."
    );

    try {
      const endpoint = mode === "login" ? "login" : "register";
      const { data } = await axios.post(`${API_URL}/${endpoint}`, formData);

      toast.success(data.message || "Success", { id: toastId });

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);

        const isAdmin =
          data.role === "admin" ||
          formData.email === "jethanandj52@gmail.com";

        setTimeout(() => {
          window.location.href = isAdmin ? "/admin" : "/home";
        }, 800);
      } else {
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/forgot-password`,
        { email: formData.email }
      );

      toast.success(data.message || "OTP sent to email");
      setMode("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/verify-otp`,
        {
          email: formData.email,
          otp: formData.otp,
        }
      );

      toast.success(data.message || "OTP verified");
      setMode("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/reset-password`,
        {
          email: formData.email,
        
          newPassword: formData.newPassword,
          confirmPassword:formData.confirmPassword
        }
      );

      toast.success(data.message || "Password updated");
      setMode("login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06010a]/5 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-md z-10"
          >
            <div className="absolute -inset-[2px] bg-gradient-to-tr from-[#9b2dee] via-[#ff00c8] to-[#ff7700] rounded-[2.5rem] blur-lg opacity-30 animate-pulse" />

            <div className="relative bg-[#1a022d]/80 backdrop-blur-[50px] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-4">
                  <UserCheck className="text-[#e300b4]" size={24} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic">
                  {mode === "forgot" ? "Find Account" : mode}
                </h2>
                <div className="h-1 w-12 bg-[#9b2dee] mx-auto mt-2 rounded-full" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {mode === "login" && (
                    <LoginForm
                      {...{
                        formData,
                        setFormData,
                        setMode,
                        loading,
                        handleSubmit: handleAuth,
                      }}
                    />
                  )}

                  {mode === "register" && (
                    <RegisterForm
                      {...{
                        formData,
                        setFormData,
                        loading,
                        handleSubmit: handleAuth,
                      }}
                    />
                  )}

                  {mode === "forgot" && (
                    <ForgotForm
                      {...{ setFormData, loading, handleForgot }}
                    />
                  )}

                  {mode === "otp" && (
                    <OTPForm
                      {...{ setFormData, loading, handleVerify }}
                    />
                  )}

                  {mode === "reset" && (
                    <ResetPasswordForm
                      {...{ setFormData, loading, handleReset }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                {mode === "login" ? (
                  <p className="text-sm text-white/50">
                    New here?
                    <button
                      onClick={() => setMode("register")}
                      className="ml-2 text-[#ff00c8] font-bold hover:underline"
                    >
                      Join Now
                    </button>
                  </p>
                ) : (
                  <button
                    onClick={() => setMode("login")}
                    className="text-sm font-bold text-white/50 hover:text-white"
                  >
                    Go Back to Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
