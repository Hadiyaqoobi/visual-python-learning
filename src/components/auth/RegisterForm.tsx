"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Rocket } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in registerSchema.shape) {
              setError(err.field as keyof RegisterInput, { type: "server", message: err.message });
            }
          });
        }
        setServerError(result.error || "Registration failed");
        return;
      }
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px",
        padding: "50px 36px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        textAlign: "center",
      }}>
        <div style={{ width: "80px", height: "80px", margin: "0 auto 20px", borderRadius: "50%", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 15px 35px rgba(34, 197, 94, 0.4)" }}>
          <CheckCircle style={{ width: "40px", height: "40px", color: "white" }} />
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>Welcome Aboard!</h2>
        <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "20px" }}>Your account has been created</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px", color: "#6366f1", fontWeight: "600" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: "16px", height: "16px", border: "2px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%" }} />
          Redirecting to login...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{
      background: "rgba(255, 255, 255, 0.98)",
      borderRadius: "24px",
      padding: "32px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: "1px solid rgba(255,255,255,0.8)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #22c55e, #6366f1, #8b5cf6, #22c55e)", backgroundSize: "200% 100%", animation: "gradientMove 3s ease infinite", borderRadius: "24px 24px 0 0" }} />
      <style>{`@keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ width: "64px", height: "64px", margin: "0 auto 16px", borderRadius: "18px", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(34, 197, 94, 0.4)" }}>
          <Rocket style={{ width: "32px", height: "32px", color: "white" }} />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>Start Your Journey</h2>
        <p style={{ fontSize: "14px", color: "#64748b" }}>Create your free account in seconds</p>
      </div>

      {serverError && (
        <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", marginBottom: "18px", color: "#dc2626", fontSize: "14px" }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Email Address</label>
          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "email" ? "#6366f1" : "#94a3b8" }} />
            <input type="email" placeholder="you@example.com" {...register("email")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} style={{ width: "100%", padding: "13px 14px 13px 42px", fontSize: "14px", border: focusedField === "email" ? "2px solid #6366f1" : "2px solid #e2e8f0", borderRadius: "12px", outline: "none", background: focusedField === "email" ? "white" : "#f8fafc", transition: "all 0.2s", boxSizing: "border-box" }} />
          </div>
          {errors.email && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.email.message}</p>}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Username</label>
          <div style={{ position: "relative" }}>
            <User style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "username" ? "#6366f1" : "#94a3b8" }} />
            <input type="text" placeholder="coolpythonist" {...register("username")} onFocus={() => setFocusedField("username")} onBlur={() => setFocusedField(null)} style={{ width: "100%", padding: "13px 14px 13px 42px", fontSize: "14px", border: focusedField === "username" ? "2px solid #6366f1" : "2px solid #e2e8f0", borderRadius: "12px", outline: "none", background: focusedField === "username" ? "white" : "#f8fafc", transition: "all 0.2s", boxSizing: "border-box" }} />
          </div>
          {errors.username ? <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.username.message}</p> : <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px" }}>3-20 characters, letters, numbers, underscores</p>}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Password</label>
          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "password" ? "#6366f1" : "#94a3b8" }} />
            <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" {...register("password")} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} style={{ width: "100%", padding: "13px 42px 13px 42px", fontSize: "14px", border: focusedField === "password" ? "2px solid #6366f1" : "2px solid #e2e8f0", borderRadius: "12px", outline: "none", background: focusedField === "password" ? "white" : "#f8fafc", transition: "all 0.2s", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {showPassword ? <EyeOff style={{ width: "18px", height: "18px", color: "#94a3b8" }} /> : <Eye style={{ width: "18px", height: "18px", color: "#94a3b8" }} />}
            </button>
          </div>
          {errors.password ? <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.password.message}</p> : <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "4px" }}>Min 8 chars with uppercase, lowercase & number</p>}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "confirmPassword" ? "#6366f1" : "#94a3b8" }} />
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" {...register("confirmPassword")} onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)} style={{ width: "100%", padding: "13px 42px 13px 42px", fontSize: "14px", border: focusedField === "confirmPassword" ? "2px solid #6366f1" : "2px solid #e2e8f0", borderRadius: "12px", outline: "none", background: focusedField === "confirmPassword" ? "white" : "#f8fafc", transition: "all 0.2s", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {showConfirmPassword ? <EyeOff style={{ width: "18px", height: "18px", color: "#94a3b8" }} /> : <Eye style={{ width: "18px", height: "18px", color: "#94a3b8" }} />}
            </button>
          </div>
          {errors.confirmPassword && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.confirmPassword.message}</p>}
        </div>

        <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ width: "100%", padding: "15px", fontSize: "15px", fontWeight: "700", color: "white", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", border: "none", borderRadius: "14px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 10px 25px rgba(34, 197, 94, 0.35)" }}>
          {isSubmitting ? "Creating Account..." : <>Create Account <ArrowRight style={{ width: "18px", height: "18px" }} /></>}
        </motion.button>
      </form>

      <div style={{ display: "flex", alignItems: "center", margin: "22px 0", gap: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Already a member?</span>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>

      <Link href="/login" style={{ textDecoration: "none" }}>
        <div style={{ padding: "13px", borderRadius: "12px", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Sign in to your account</span>
          <ArrowRight style={{ width: "16px", height: "16px", color: "#6366f1" }} />
        </div>
      </Link>
    </motion.div>
  );
}
