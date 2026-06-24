import { useState } from "react";
import { CheckCircle, ExternalLink, Trophy, BookOpen, Lock } from "lucide-react";

export const MilestoneNode = ({ milestone, index, completed, active, locked, onToggle, delay = 0, isLast }) => {
    const [pressed, setPressed] = useState(false);
    const phaseColors = {
        Explore: "#a855f7", Choose: "#3b82f6", Prepare: "#06b6d4",
        Build: "#f59e0b", Crack: "#ef4444", Entry: "#10b981",
        Specialize: "#ec4899", Study: "#6366f1", Deepen: "#8b5cf6",
        Launch: "#f97316", Practice: "#ffd700"
    };
    const color = phaseColors[milestone.phase] || "#8b5cf6";

    // Visual branching based on odd/even index
    const isEven = index % 2 === 0;

    return (
        <div style={{ display: "flex", flexDirection: isEven ? "row" : "row-reverse", alignItems: "flex-start", gap: 24, animation: `nodeReveal 0.5s ${delay}s both`, position: "relative", marginBottom: 32 }}>
            
            {/* Center Timeline Spine */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0, bottom: isLast ? 'auto' : -32, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
                <button
                    onMouseDown={() => !locked && setPressed(true)}
                    onMouseUp={() => { setPressed(false); !locked && onToggle(milestone.id); }}
                    onMouseLeave={() => setPressed(false)}
                    onTouchStart={() => !locked && setPressed(true)}
                    onTouchEnd={() => { setPressed(false); !locked && onToggle(milestone.id); }}
                    style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: completed
                            ? `linear-gradient(135deg, ${color}, ${color}aa)`
                            : locked
                                ? "rgba(255,255,255,0.02)"
                                : active
                                    ? `rgba(${color === "#a855f7" ? "168,85,247" : "139,92,246"},0.15)`
                                    : "rgba(255,255,255,0.04)",
                        border: `2px solid ${completed ? color : locked ? "rgba(255,255,255,0.05)" : active ? color + "88" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: locked ? "not-allowed" : "pointer", outline: "none",
                        transform: pressed ? "scale(0.92)" : "scale(1)",
                        boxShadow: completed ? `0 0 16px ${color}55, 0 4px 0 ${color}44` : active ? `0 0 12px ${color}33` : "none",
                        transition: "all 0.15s",
                        opacity: locked ? 0.4 : 1
                    }}>
                    {completed
                        ? <CheckCircle style={{ width: 22, height: 22, color: "white" }} />
                        : locked 
                            ? <Lock style={{ width: 18, height: 18, color: "#475569" }} />
                            : <span style={{ fontFamily: "Syne, sans-serif", color: active ? color : "#475569", fontWeight: 700, fontSize: "0.85rem" }}>{index + 1}</span>
                    }
                </button>
                {!isLast && (
                    <div style={{ flex: 1, width: 2, marginTop: 4, background: completed ? `linear-gradient(${color}, transparent)` : "rgba(255,255,255,0.06)", borderRadius: 1 }} />
                )}
            </div>

            {/* Connecting branch line */}
            <div style={{ position: "absolute", top: 24, left: "50%", width: "calc(50% - 24px)", height: 2, background: "rgba(255,255,255,0.06)", transform: isEven ? "translateX(0)" : "translateX(-100%)", zIndex: 5, borderRadius: 2 }} />

            {/* Content Side */}
            <div style={{
                width: "calc(50% - 36px)",
                opacity: active || completed ? 1 : 0.35,
                transition: "opacity 0.3s",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px",
                position: "relative", zIndex: 11,
                textAlign: isEven ? "left" : "right", alignSelf: "flex-start"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, justifyContent: isEven ? "flex-start" : "flex-end" }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.62rem", fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.12em", background: `${color}18`, padding: "2px 8px", borderRadius: 999 }}>{milestone.phase}</span>
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.7rem", color: "#475569" }}>{milestone.year}</span>
                </div>
                <p style={{ fontFamily: "Syne, sans-serif", color: completed ? "#e2e8f0" : active ? "#cbd5e1" : "#64748b", fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{milestone.title}</p>
                <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.78rem", lineHeight: 1.5 }}>{milestone.desc}</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                    {milestone.entranceExam && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: isEven ? "flex-start" : "flex-end", color: "#cbd5e1", fontSize: "0.75rem", fontFamily: "DM Sans, sans-serif" }}>
                            <BookOpen size={13} color="#f59e0b"/> Exam: <strong style={{color:"#f59e0b"}}>{milestone.entranceExam}</strong>
                        </div>
                    )}
                    {milestone.nirfRanking && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: isEven ? "flex-start" : "flex-end", color: "#cbd5e1", fontSize: "0.75rem", fontFamily: "DM Sans, sans-serif" }}>
                            <Trophy size={13} color="#10b981"/> Target: <strong style={{color:"#10b981"}}>{milestone.nirfRanking}</strong>
                        </div>
                    )}
                    {milestone.deepLink && active && (
                        <a href={milestone.deepLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, alignSelf: isEven ? "flex-start" : "flex-end", marginTop: 4, background: `${color}15`, border: `1px solid ${color}40`, padding: "4px 10px", borderRadius: 8, textDecoration: "none", color: color, fontSize: "0.7rem", fontFamily: "Syne, sans-serif", fontWeight: 600, transition: "background 0.2s" }}
                        onMouseEnter={e=>e.currentTarget.style.background = `${color}30`} onMouseLeave={e=>e.currentTarget.style.background = `${color}15`}>
                            Explore Resource <ExternalLink size={12}/>
                        </a>
                    )}
                </div>

                <div style={{ position: "absolute", top: 12, [isEven ? "right" : "left"]: 12 }}>
                     <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.65rem", color: "#ffd700", fontWeight: 700 }}>+{milestone.xp} XP</span>
                </div>
            </div>

            {/* Empty Spacer for alternating layout */}
            <div style={{ width: "calc(50% - 36px)" }} />
        </div>
    );
};
