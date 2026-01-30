"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Cpu } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px",
        padding: "36px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1)",
        backgroundSize: "200% 100%",
        animation: "gradientMove 3s ease infinite",
        borderRadius: "24px 24px 0 0",
      }} />
      <style>{`@keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "70px",
          height: "70px",
          margin: "0 auto 18px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
        }}>
          <Cpu style={{ width: "35px", height: "35px", color: "white" }} />
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>Welcome Back</h2>
        <p style={{ fontSize: "14px", color: "#64748b" }}>Continue your visual learning journey</p>
      </div>

      {serverError && (
        <div style={{
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          marginBottom: "20px",
          color: "#dc2626",
          fontSize: "14px",
        }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Email Address</label>
          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "email" ? "#6366f1" : "#94a3b8" }} />
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 44px",
                fontSize: "15px",
                border: focusedField === "email" ? "2px solid #6366f1" : "2px solid #e2e8f0",
                borderRadius: "12px",
                outline: "none",
                background: focusedField === "email" ? "white" : "#f8fafc",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
            />
          </div>
          {errors.email && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "6px" }}>{errors.email.message}</p>}
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Password</label>
          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: focusedField === "password" ? "#6366f1" : "#94a3b8" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%",
                padding: "14px 44px 14px 44px",
                fontSize: "15px",
                border: focusedField === "password" ? "2px solid #6366f1" : "2px solid #e2e8f0",
                borderRadius: "12px",
                outline: "none",
                background: focusedField === "password" ? "white" : "#f8fafc",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {showPassword ? <EyeOff style={{ width: "18px", height: "18px", color: "#94a3b8" }} /> : <Eye style={{ width: "18px", height: "18px", color: "#94a3b8" }} />}
            </button>
          </div>
          {errors.password && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "6px" }}>{errors.password.message}</p>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#6366f1" }} />
            <span style={{ fontSize: "13px", color: "#64748b" }}>Remember me</span>
          </label>
          <Link href="/forgot-password" style={{ fontSize: "13px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Forgot password?</Link>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "700",
            color: "white",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            border: "none",
            borderRadius: "14px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.8 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.35)",
          }}
        >
          {isSubmitting ? "Signing in..." : <>Sign In <ArrowRight style={{ width: "18px", height: "18px" }} /></>}
        </motion.button>
      </form>

      <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>New to Visual Python?</span>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>

      <Link href="/register" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "14px",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Create your free account</span>
          <ArrowRight style={{ width: "16px", height: "16px", color: "#6366f1" }} />
        </div>
      </Link>
    </motion.div>
  );
}
