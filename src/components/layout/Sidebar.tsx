"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Code,
  BookOpen,
  Trophy,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  Cpu,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Hardware", href: "/hardware", icon: Cpu },
  { name: "Python IDE", href: "/ide", icon: Code },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
        position: "relative",
        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        flexShrink: 0,
      }}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: "absolute",
          right: -14,
          top: 28,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "white",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {isCollapsed ? (
          <ChevronRight style={{ width: 16, height: 16, color: "#6366f1" }} />
        ) : (
          <ChevronLeft style={{ width: 16, height: 16, color: "#6366f1" }} />
        )}
      </button>

      {/* Logo */}
      <div
        style={{
          padding: isCollapsed ? "20px 16px" : "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🐍
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                Visual Python
              </motion.span>
            )}
          </div>
        </Link>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name || "Learner"}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "#a5b4fc",
                }}
              >
                <Zap style={{ width: 12, height: 12 }} />
                {user?.totalXp || 0} XP
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            const isHardware = item.name === "Hardware";

            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: isCollapsed ? 14 : "14px 18px",
                    borderRadius: 12,
                    background: isActive
                      ? isHardware
                        ? "linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.3) 100%)"
                        : "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "#a5b4fc",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    transition: "all 0.2s",
                    cursor: "pointer",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid transparent",
                  }}
                >
                  <Icon style={{ width: 20, height: 20, flexShrink: 0 }} />
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {item.name}
                    </motion.span>
                  )}
                  {!isCollapsed && isHardware && (
                    <span style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 6,
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}>
                      NEW
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link href="/settings" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ x: 4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: isCollapsed ? 14 : "14px 18px",
              borderRadius: 12,
              background: "transparent",
              color: "#a5b4fc",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              justifyContent: isCollapsed ? "center" : "flex-start",
              marginBottom: 6,
            }}
          >
            <Settings style={{ width: 20, height: 20, flexShrink: 0 }} />
            {!isCollapsed && <span>Settings</span>}
          </motion.div>
        </Link>

        <button
          onClick={() => logout()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            width: "100%",
            padding: isCollapsed ? 14 : "14px 18px",
            borderRadius: 12,
            background: "rgba(239, 68, 68, 0.1)",
            border: "none",
            color: "#fca5a5",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            justifyContent: isCollapsed ? "center" : "flex-start",
            transition: "all 0.2s",
          }}
        >
          <LogOut style={{ width: 20, height: 20, flexShrink: 0 }} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
