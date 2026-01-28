"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Settings, User, Bell, Shield, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      padding: "32px",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#1e293b", 
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <Settings style={{ width: "32px", height: "32px", color: "#6366f1" }} />
            Settings
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Manage your account and preferences.
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <User style={{ width: "20px", height: "20px", color: "#6366f1" }} />
            Profile
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#374151", 
                marginBottom: "8px" 
              }}>
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#374151", 
                marginBottom: "8px" 
              }}>
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  background: "#f8fafc",
                  color: "#64748b",
                }}
              />
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                Email cannot be changed.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
                alignSelf: "flex-start",
              }}
            >
              <Save style={{ width: "16px", height: "16px" }} />
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <Palette style={{ width: "20px", height: "20px", color: "#8b5cf6" }} />
            Preferences
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Default to Hardware Mode
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Always show hardware visualization when opening IDE
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "28px",
                borderRadius: "14px",
                background: "#e2e8f0",
                cursor: "pointer",
                position: "relative",
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }} />
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Animation Speed
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Default speed for hardware animations
                </div>
              </div>
              <select style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                background: "white",
                cursor: "pointer",
              }}>
                <option value="slow">🐢 Slow</option>
                <option value="normal" selected>🚶 Normal</option>
                <option value="fast">🏃 Fast</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#1e293b", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <Bell style={{ width: "20px", height: "20px", color: "#f59e0b" }} />
            Notifications
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Learning Reminders
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Get reminded to maintain your streak
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "28px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                cursor: "pointer",
                position: "relative",
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }} />
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Achievement Notifications
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Get notified when you unlock achievements
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "28px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                cursor: "pointer",
                position: "relative",
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
