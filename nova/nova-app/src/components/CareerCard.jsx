import { ChevronRight } from "lucide-react";

export const CareerCard = ({ match, rank, selected, onSelect }) => {
    const { career, pct } = match;
    const Icon = career.icon;
    return (
        <button onClick={() => onSelect(career.id)}
            style={{
                width: "100%", background: selected
                    ? `linear-gradient(135deg, ${career.color}18, ${career.color}08)`
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${selected ? career.color + "55" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", outline: "none", textAlign: "left",
                boxShadow: selected ? `0 0 20px ${career.color}22` : "none",
                transition: "all 0.2s",
                animation: `fadeUp 0.4s ${rank * 0.1}s both`,
            }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${career.color}22`, border: `1px solid ${career.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon style={{ width: 20, height: 20, color: career.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    {rank === 0 && <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: "#ffd700", background: "rgba(255,215,0,0.12)", padding: "1px 6px", borderRadius: 999 }}>BEST MATCH</span>}
                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{career.emoji} {career.label}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: career.color, borderRadius: 2, boxShadow: `0 0 6px ${career.color}88`, transition: "width 1s ease" }} />
                    </div>
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.7rem", color: career.color, fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                </div>
            </div>
            {selected && <ChevronRight style={{ width: 16, height: 16, color: career.color, flexShrink: 0 }} />}
        </button>
    );
};
