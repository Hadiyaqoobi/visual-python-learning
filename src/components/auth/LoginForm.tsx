"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Cpu, Binary, Braces } from "lucide-react";

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
    defaultValues: {
      email: "",
      password: "",
    },
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        padding: "48px",
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.8) inset",
        border: "1px solid rgba(255,255,255,0.6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient border */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1)",
        backgroundSize: "200% 100%",
        animation: "gradientMove 3s ease infinite",
      }} />

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 24px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4), 0 0 0 8px rgba(99, 102, 241, 0.1)",
            position: "relative",
          }}
        >
          <Cpu style={{ width: "40px", height: "40px", color: "white" }} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "32px",
              border: "2px dashed rgba(99, 102, 241, 0.3)",
            }}
          />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#1e293b", 
            marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome Back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: "16px", color: "#64748b" }}
        >
          Continue your visual learning journey
        </motion.p>
      </div>

      {/* Error Message */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            border: "1px solid #fecaca",
            borderRadius: "16px",
            marginBottom: "24px",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#dc2626",
          }} />
          {serverError}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: "20px" }}
        >
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "700", 
            color: "#374151", 
            marginBottom: "10px",
            letterSpacing: "0.3px",
          }}>
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ 
                scale: focusedField === "email" ? 1.05 : 1,
                color: focusedField === "email" ? "#6366f1" : "#94a3b8",
              }}
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <Mail style={{ width: "22px", height: "22px" }} />
            </motion.div>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%",
                padding: "18px 20px 18px 54px",
                fontSize: "16px",
                border: focusedField === "email" ? "2px solid #6366f1" : "2px solid #e2e8f0",
                borderRadius: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                background: focusedField === "email" ? "white" : "#f8fafc",
                boxShadow: focusedField === "email" ? "0 0 0 4px rgba(99, 102, 241, 0.15), 0 10px 40px rgba(99, 102, 241, 0.1)" : "none",
              }}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: "#dc2626", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: "24px" }}
        >
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "700", 
            color: "#374151", 
            marginBottom: "10px",
            letterSpacing: "0.3px",
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ 
                scale: focusedField === "password" ? 1.05 : 1,
                color: focusedField === "password" ? "#6366f1" : "#94a3b8",
              }}
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <Lock style={{ width: "22px", height: "22px" }} />
            </motion.div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%",
                padding: "18px 54px 18px 54px",
                fontSize: "16px",
                border: focusedField === "password" ? "2px solid #6366f1" : "2px solid #e2e8f0",
                borderRadius: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                background: focusedField === "password" ? "white" : "#f8fafc",
                boxShadow: focusedField === "password" ? "0 0 0 4px rgba(99, 102, 241, 0.15), 0 10px 40px rgba(99, 102, 241, 0.1)" : "none",
              }}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                right: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#94a3b8",
              }}
            >
              {showPassword ? (
                <EyeOff style={{ width: "22px", height: "22px" }} />
              ) : (
                <Eye style={{ width: "22px", height: "22px" }} />
              )}
            </motion.button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: "#dc2626", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}
        >
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
            <div style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: "2px solid #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}>
              <input
                type="checkbox"
                style={{ opacity: 0, position: "absolute" }}
              />
            </div>
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            style={{ 
              fontSize: "14px", 
              color: "#6366f1", 
              textDecoration: "none", 
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "20px 28px",
            fontSize: "17px",
            fontWeight: "700",
            color: "white",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            border: "none",
            borderRadius: "18px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.8 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 15px 35px rgba(99, 102, 241, 0.35)",
            transition: "all 0.3s ease",
            letterSpacing: "0.3px",
          }}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "22px",
                  height: "22px",
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                }}
              />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight style={{ width: "22px", height: "22px" }} />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        margin: "32px 0",
        gap: "16px",
      }}>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>New to Visual Python?</span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link href="/register" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "#6366f1" }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "18px 24px",
              borderRadius: "16px",
              border: "2px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "white",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}>
              Create your free account
            </span>
            <ArrowRight style={{ width: "18px", height: "18px", color: "#6366f1" }} />
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
