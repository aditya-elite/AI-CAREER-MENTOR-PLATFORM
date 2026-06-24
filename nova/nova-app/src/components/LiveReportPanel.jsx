import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import { reportEngine } from '../utils/reportEngine';
import { useAppContext } from '../context/AppContext';

export const LiveReportPanel = ({ totalSteps }) => {
    const { completedSteps } = useAppContext();
    const completedCount = Object.keys(completedSteps).length;
    
    const report = useMemo(() => {
        return reportEngine.generateLiveReport(completedCount, totalSteps, completedSteps);
    }, [completedCount, totalSteps, completedSteps]);

    const reportItems = [
        { label: "Completion Grade", val: `${report.completionPct}%`, color: "#3b82f6", icon: TrendingUp },
        { label: "Consistency Score", val: report.consistency, color: "#10b981", icon: Zap },
        { label: "Concept Average", val: `${report.averageScore}%`, color: "#ffd700", icon: Award }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
                <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 700, marginBottom: 20 }}>📊 Current Performance Analysis</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
                    {reportItems.map(item => (
                        <div key={item.label} style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
                            <p style={{ color: "#475569", fontFamily: "DM Sans, sans-serif", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{item.label}</p>
                            <p style={{ color: item.color, fontFamily: "Syne, sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>{item.val}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: 12, borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ background: "#10b981", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Zap size={14} color="white" />
                        </div>
                        <div>
                            <p style={{ color: "#34d399", fontFamily: "Syne, sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>STRENGTH DETECTED</p>
                            <p style={{ color: "#e2e8f0", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", lineHeight: 1.4 }}>{report.strength}</p>
                        </div>
                    </div>

                    <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: 12, borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ background: "#ef4444", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AlertTriangle size={14} color="white" />
                        </div>
                        <div>
                            <p style={{ color: "#f87171", fontFamily: "Syne, sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>POTENTIAL WEAKNESS</p>
                            <p style={{ color: "#e2e8f0", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", lineHeight: 1.4 }}>{report.weakness}</p>
                        </div>
                    </div>

                    <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", padding: 12, borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ background: "#7c3aed", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Lightbulb size={14} color="white" />
                        </div>
                        <div>
                            <p style={{ color: "#a78bfa", fontFamily: "Syne, sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>RECOMMENDATION</p>
                            <p style={{ color: "#e2e8f0", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", lineHeight: 1.4 }}>{report.recommendation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
