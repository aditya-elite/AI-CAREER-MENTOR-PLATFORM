import { useState } from "react";
import { Brain, Sparkles, ArrowRight } from "lucide-react";
import { StarField } from "./Background";

import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
    const { login: performAuthLogin } = useAuth();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const submit = () => {
        if (!name.trim() || name.trim().length < 2) { setErr("Enter at least 2 characters"); return; }
        setLoading(true);
        setTimeout(() => performAuthLogin(name.trim()), 1000);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #04060f 0%, #080d1a 50%, #04060f 100%)", padding: 16, position: "relative" }}>
            <StarField />

            {/* Ambient blobs */}
            <div style={{ position: "fixed", top: "15%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "fixed", bottom: "15%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", width: "100%", maxWidth: 440, animation: "fadeUp 0.8s ease-out" }}>
                {/* CareerForge logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(139,92,246,0.15)", animation: "glowPulse 3s ease-in-out infinite" }}>
                            <Brain style={{ width: 38, height: 38, color: "white" }} />
                        </div>
                        <div style={{ position: "absolute", top: 10, right: -10, width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "twinkle 1s ease-in-out infinite" }} />
                    </div>
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "2.4rem", fontWeight: 800, background: "linear-gradient(135deg, #c4b5fd, #93c5fd, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em", lineHeight: 1 }}>CareerForge</h1>
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.85rem", marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Career Intelligence Engine</p>
                </div>

                {/* Card */}
                <div style={{ background: "rgba(8,13,26,0.85)", backdropFilter: "blur(24px)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24, padding: "32px 28px", boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                    <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)", borderRadius: 1 }} />

                    <p style={{ fontFamily: "Syne, sans-serif", color: "#cbd5e1", fontWeight: 600, fontSize: "1rem", marginBottom: 6 }}>What should I call you?</p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#475569", fontSize: "0.82rem", marginBottom: 24, lineHeight: 1.5 }}>I'm CareerForge — your AI career mentor. A 5-minute conversation with me will map out your entire career path.</p>

                    <input
                        value={name}
                        onChange={e => { setName(e.target.value); setErr(""); }}
                        onKeyDown={e => e.key === "Enter" && submit()}
                        placeholder="Your first name..."
                        autoFocus
                        style={{
                            width: "100%", padding: "14px 18px", borderRadius: 14,
                            background: "rgba(255,255,255,0.04)", border: err ? "1px solid #ef4444" : "1px solid rgba(139,92,246,0.25)",
                            color: "#e2e8f0", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem",
                            outline: "none", marginBottom: 6,
                        }}
                    />
                    {err && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: 10, fontFamily: "DM Sans, sans-serif" }}>{err}</p>}

                    <button onClick={submit} disabled={loading}
                        style={{
                            width: "100%", padding: "14px", marginTop: 12, borderRadius: 14,
                            background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #7c3aed, #6366f1)",
                            border: "none", color: "white", cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            boxShadow: "0 4px 0 rgba(109,40,217,0.6), 0 0 25px rgba(139,92,246,0.3)",
                            transition: "all 0.15s", letterSpacing: "0.03em",
                        }}>
                        {loading
                            ? <><div style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Initialising CareerForge...</>
                            : <><Sparkles style={{ width: 18, height: 18 }} /> Begin My Journey <ArrowRight style={{ width: 16, height: 16 }} /></>
                        }
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
                    {["🧠 AI-Powered", "🗺️ Visual Roadmap", "🎮 Gamified XP", "⚡ 5 Minutes"].map(f => (
                        <span key={f} style={{ fontFamily: "DM Sans, sans-serif", color: "#334155", fontSize: "0.72rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "4px 12px", borderRadius: 999 }}>{f}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
