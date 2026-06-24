import { useState, useMemo, useEffect } from "react";
import { Brain, Flame, Star, Zap, CheckCircle, Map, Compass, User, ExternalLink, ChevronRight, Eye, BarChart2, Award, ClipboardCheck } from "lucide-react";
import { StarField, Confetti } from "./Background";
import { MilestoneNode } from "./MilestoneNode";
import { ProfileCard } from "./ProfileCard";
import { CAREERS } from "../data/constants";

// New Components
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { ProgressChart } from "./ProgressChart";
import { SkillHeatmap } from "./SkillHeatmap";
import { FutureReadinessCard } from "./FutureReadinessCard";
import { LiveReportPanel } from "./LiveReportPanel";
import { MockTestModal } from "./MockTestModal";
import { AssistantPanel } from "./AssistantPanel";

export const RoadmapView = ({ userName, initialCareer }) => {
    const { userProfile, completedSteps, completeStep, updateProfile, reset } = useAppContext();
    const { logout } = useAuth();

    // UI State
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [activeTab, setActiveTab] = useState("roadmap");
    const [showConfetti, setShowConfetti] = useState(false);
    const [show2030Profile, setShow2030Profile] = useState(false);
    const [testTarget, setTestTarget] = useState(null); // Milestone object or null

    const career = CAREERS[userProfile.preferredCareer || initialCareer];
    const branches = career ? Object.values(career.branches) : [];

    useEffect(() => {
        if (career && !selectedBranchId) setSelectedBranchId(Object.keys(career.branches)[0]);
    }, [career]);

    const branch = selectedBranchId ? career?.branches[selectedBranchId] : branches[0];
    const milestones = branch?.milestones || [];

    // Analytics computation
    const completedCount = Object.keys(completedSteps).filter(id => milestones.some(m => m.id === id)).length;
    const totalXP = useMemo(() => Object.values(completedSteps).reduce((a, s) => a + (s.xp || 0), 0), [completedSteps]);

    // Level Logic
    const level = Math.max(1, Math.floor(totalXP / 500));
    const xpPct = Math.round(((totalXP % 500) / 500) * 100);

    const handleMilestoneClick = (id) => {
        const milestone = milestones.find(m => m.id === id);
        if (completedSteps[id]) return; // Already done

        // Enforce lock logic: Step N-1 must be completed
        const idx = milestones.findIndex(m => m.id === id);
        if (idx > 0 && (!completedSteps[milestones[idx - 1].id] || completedSteps[milestones[idx - 1].id].score < 70)) {
            return; // Target is locked
        }

        setTestTarget(milestone);
    };

    const handleTestComplete = (score, passed) => {
        if (passed) {
            completeStep(testTarget.id, score, testTarget.xp);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2500);
        }
        setTestTarget(null);
    };

    if (!career) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "white" }}>Initializing Career Path...</p>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #04060f 0%, #080d1a 100%)", color: "#e2e8f0" }}>
            <StarField />
            <Confetti active={showConfetti} />

            {/* Test Modal Overlay */}
            {testTarget && (
                <MockTestModal step={testTarget} onComplete={handleTestComplete} onClose={() => setTestTarget(null)} />
            )}

            {/* HEADER */}
            <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "10px 16px", background: "rgba(4,6,15,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Brain style={{ width: 18, height: 18, color: "white" }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontWeight: 800, fontSize: "0.95rem" }}>CareerForge</p>
                        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#475569", fontSize: "0.6rem", textTransform: "uppercase" }}>Gamified Career AI</p>
                    </div>

                    <div style={{ ml: "auto", flex: 1, maxWidth: 180, margin: "0 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontFamily: "Syne, sans-serif", color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700 }}>LEVEL {level}</span>
                            <span style={{ fontFamily: "DM Sans, sans-serif", color: "#475569", fontSize: "0.65rem" }}>{totalXP % 500} / 500 XP</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
                            <div style={{ height: "100%", width: `${xpPct}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)", borderRadius: 2, boxShadow: "0 0 10px rgba(139,92,246,0.4)", transition: "width 0.8s ease" }} />
                        </div>
                    </div>

                    <button onClick={() => logout()} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "6px 12px", borderRadius: 8, color: "#64748b", fontSize: "0.75rem", fontFamily: "Syne, sans-serif", cursor: "pointer" }}>Exit</button>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", color: "#a78bfa", fontWeight: 800, fontSize: "0.85rem" }}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* NAV */}
            <div style={{ background: "rgba(4,6,15,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", gap: 8, padding: "0 16px" }}>
                    {[
                        { id: "roadmap", label: "My Roadmap", icon: Map },
                        { id: "analytics", label: "Intelligence", icon: BarChart2 },
                        { id: "profile", label: "Identity", icon: User },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: "12px 16px", background: "transparent", border: "none",
                                    borderBottom: active ? `2px solid #7c3aed` : "2px solid transparent",
                                    color: active ? "#e2e8f0" : "#475569",
                                    fontFamily: "Syne, sans-serif", fontSize: "0.8rem", fontWeight: active ? 700 : 500,
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                                }}>
                                <Icon style={{ width: 14, height: 14 }} />{tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CONTENT */}
            <div style={{ maxWidth: 840, margin: "0 auto", padding: "32px 16px 80px" }}>

                {/* ─── ROADMAP TAB ─── */}
                {activeTab === "roadmap" && (
                    <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                        <div style={{ background: `linear-gradient(135deg, ${career.color}15, transparent)`, border: `1px solid ${career.color}30`, borderRadius: 24, padding: "24px", marginBottom: 32, position: "relative" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                                <div>
                                    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "white" }}>{career.emoji} {career.label}</h2>
                                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>You've mastered {completedCount} of {milestones.length} core competencies.</p>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {branches.map(b => (
                                        <button key={b.id} onClick={() => setSelectedBranchId(b.id)}
                                            style={{
                                                padding: "6px 14px", borderRadius: 10, border: `1px solid ${selectedBranchId === b.id ? career.color : "rgba(255,255,255,0.08)"}`,
                                                background: selectedBranchId === b.id ? `${career.color}20` : "transparent",
                                                color: selectedBranchId === b.id ? "white" : "#475569",
                                                fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.2s"
                                            }}>
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
                            <FutureReadinessCard branchId={selectedBranchId || "software"} totalSteps={milestones.length} />
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 700, marginBottom: 2 }}>🏆 Skill Validation</p>
                                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.8rem" }}>Pass mock tests to unlock your future.</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "DM Sans, sans-serif" }}>
                                        <span style={{ color: "#475569" }}>Steps Completed</span>
                                        <span style={{ color: "#3b82f6", fontWeight: 700 }}>{completedCount} / {milestones.length}</span>
                                    </div>
                                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                                        <div style={{ height: "100%", width: `${(completedCount / milestones.length) * 100}%`, background: "#3b82f6", borderRadius: 2 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SKILL TREE */}
                        <div style={{ marginBottom: 40 }}>
                            {milestones.map((m, i) => {
                                const stepData = completedSteps[m.id];
                                const isCompleted = !!stepData;

                                const prevCompleted = i === 0 || (completedSteps[milestones[i - 1].id] && completedSteps[milestones[i - 1].id].score >= 70);
                                const isLocked = !prevCompleted;
                                const isActive = prevCompleted && !isCompleted;
                                const isLast = i === milestones.length - 1;

                                return (
                                    <MilestoneNode key={m.id} milestone={m} index={i}
                                        completed={isCompleted} active={isActive} locked={isLocked}
                                        onToggle={handleMilestoneClick} delay={i * 0.05} isLast={isLast} />
                                );
                            })}
                        </div>

                        {completedCount === milestones.length && (
                            <div style={{ background: "rgba(16,185,129,0.05)", border: "1px dashed rgba(16,185,129,0.4)", borderRadius: 24, padding: 32, textAlign: "center", animation: "fadeUp 0.6s ease-out" }}>
                                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", color: "#10b981", marginBottom: 8 }}>Grade 12 Journey Complete! 🎉</h3>
                                <p style={{ color: "#94a3b8", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", marginBottom: 24 }}>You have mastered the core curriculum for Grades 10, 11, and 12. Great job! Here's what's next for your career in {career.label}:</p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, textAlign: "left" }}>
                                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 16 }}>
                                        <p style={{ color: "#a78bfa", fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: 12 }}>Top Entrance Exams</p>
                                        <ul style={{ color: "#e2e8f0", fontSize: "0.9rem", paddingLeft: 20, lineHeight: 1.6 }}>
                                            {branch.exams?.map(e => <li key={e} style={{ marginBottom: 6 }}>{e}</li>)}
                                        </ul>
                                    </div>
                                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 16 }}>
                                        <p style={{ color: "#3b82f6", fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: 12 }}>Target Elite Opportunities</p>
                                        <ul style={{ color: "#e2e8f0", fontSize: "0.9rem", paddingLeft: 20, lineHeight: 1.6 }}>
                                            {branch.colleges?.map(c => <li key={c} style={{ marginBottom: 6 }}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── INTELLIGENCE TAB ─── */}
                {activeTab === "analytics" && (
                    <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: 20 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <ProgressChart />
                                <SkillHeatmap />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <LiveReportPanel totalSteps={milestones.length} />
                                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24 }}>
                                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>⚡ Adaptive Nudge</p>
                                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6 }}>
                                        {completedCount === 0
                                            ? "The first step is always the hardest. Take the Foundations test to kickstart your trajectory map."
                                            : "You're consistently beating your concept targets. Consider setting your graduation year profile to 'High Ambition'."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── PROFILE TAB ─── */}
                {activeTab === "profile" && (
                    <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div style={{ background: "rgba(139,92,246,0.03)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 28, padding: 24, textAlign: "center" }}>
                                <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: "Syne, sans-serif", color: "white", fontSize: "2rem", fontWeight: 800 }}>
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", color: "white" }}>{userName}</h3>
                                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", marginTop: 4 }}>Level {level} Pathfinder</p>

                                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
                                    <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                                        <p style={{ color: "#ffd700", fontWeight: 800, fontSize: "1.1rem" }}>{totalXP}</p>
                                        <p style={{ color: "#475569", fontSize: "0.6rem", textTransform: "uppercase" }}>Total XP</p>
                                    </div>
                                    <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                                        <p style={{ color: "#3b82f6", fontWeight: 800, fontSize: "1.1rem" }}>{completedCount}</p>
                                        <p style={{ color: "#475569", fontSize: "0.6rem", textTransform: "uppercase" }}>Mastered</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 28, padding: 24 }}>
                                <p style={{ fontFamily: "Syne, sans-serif", color: "#a78bfa", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 20 }}>Account Parameters</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ color: "#475569", fontSize: "0.85rem" }}>Graduation Year</span>
                                        <select value={userProfile.graduationYear} onChange={(e) => updateProfile({ graduationYear: parseInt(e.target.value) })}
                                            style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "4px 8px", color: "white" }}>
                                            {[2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ color: "#475569", fontSize: "0.85rem" }}>Current Class</span>
                                        <span style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: 600 }}>Class {userProfile.class}</span>
                                    </div>
                                    <button onClick={() => { reset(); logout(); }} style={{ marginTop: 20, width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", color: "#f87171", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>Reset Session Data</button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 24 }}>
                            {completedCount === milestones.length && <ProfileCard userName={userName} career={career} role={branch?.roles?.[0]} />}
                        </div>
                    </div>
                )}
            </div>

            <AssistantPanel />
        </div>
    );
};
