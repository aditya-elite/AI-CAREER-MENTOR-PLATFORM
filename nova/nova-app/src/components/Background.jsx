import { useMemo } from "react";

export const StarField = () => {
    const stars = useMemo(() => Array.from({ length: 150 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        s: Math.random() * 2.5 + 0.3, d: Math.random() * 5, dur: Math.random() * 4 + 2,
    })), []);
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {stars.map(s => (
                <div key={s.id} style={{
                    position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
                    width: s.s, height: s.s, borderRadius: "50%", background: "white",
                    animation: `twinkle ${s.dur}s ${s.d}s infinite alternate`,
                }} />
            ))}
        </div>
    );
};

export const Confetti = ({ active }) => {
    if (!active) return null;
    const pieces = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        color: ["#f59e0b", "#ec4899", "#3b82f6", "#10b981", "#a855f7", "#f97316"][i % 6],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
    })), [active]);
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map(p => (
                <div key={p.id} style={{
                    position: "absolute", left: `${p.x}%`, top: "10%",
                    width: p.size, height: p.size,
                    background: p.color,
                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    animation: `confetti 2.5s ${p.delay}s ease-out forwards`,
                }} />
            ))}
        </div>
    );
};
