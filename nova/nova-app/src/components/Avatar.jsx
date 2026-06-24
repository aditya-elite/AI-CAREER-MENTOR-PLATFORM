import { Brain } from "lucide-react";

export const CareerForgeAvatar = ({ speaking, size = 48 }) => (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: speaking ? "0 0 0 3px rgba(139,92,246,0.5), 0 0 20px rgba(139,92,246,0.4)" : "none",
            transition: "box-shadow 0.3s",
        }}>
            <Brain style={{ width: size * 0.45, height: size * 0.45, color: "white" }} />
        </div>
        {speaking && (
            <div style={{
                position: "absolute", inset: -4, borderRadius: "50%",
                border: "2px solid rgba(139,92,246,0.6)",
                animation: "pulse-ring 1.2s ease-out infinite",
            }} />
        )}
    </div>
);
