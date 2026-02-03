"use client";

import { useState } from "react";

interface Props {
  projectTitle: string;
  userName: string;
  certId: string;
  completionDate: string;
  technologies: string[];
}

export function CertificateActions({ projectTitle, certId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedInUrl = typeof window !== "undefined" 
    ? "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(window.location.href)
    : "#";

  const twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("I completed " + projectTitle + "! Certificate: " + certId);

  return (
    <div style={{ marginTop: "32px" }}>
      <div style={{ background: "rgba(30,30,46,0.8)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Share Your Achievement!</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 24px", borderRadius: "12px", background: "#0077b5", color: "white", fontWeight: "600", textDecoration: "none" }}>Share on LinkedIn</a>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 24px", borderRadius: "12px", background: "#000", color: "white", fontWeight: "600", textDecoration: "none", border: "1px solid #333" }}>Share on X</a>
          <button onClick={handleCopyLink} style={{ padding: "14px 24px", borderRadius: "12px", background: "rgba(139,92,246,0.2)", color: "#a78bfa", fontWeight: "600", border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer" }}>{copied ? "Copied!" : "Copy Link"}</button>
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>What is Next?</h3>
        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Keep learning and building!</p>
        <a href="/projects" style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "white", textDecoration: "none", fontWeight: "600" }}>Explore More Projects</a>
      </div>
    </div>
  );
}
