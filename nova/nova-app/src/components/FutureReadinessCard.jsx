import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { predictionEngine } from '../utils/predictionEngine';
import { useAppContext } from '../context/AppContext';

export const FutureReadinessCard = ({ branchId, totalSteps }) => {
    const { userProfile, completedSteps } = useAppContext();
    const completedCount = Object.keys(completedSteps).length;
    
    const averageScore = useMemo(() => {
        const scores = Object.values(completedSteps).map(d => d.score || 0);
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }, [completedSteps]);

    const prediction = useMemo(() => {
        return predictionEngine.calculateFutureReadiness(
            completedCount, 
            totalSteps, 
            userProfile.graduationYear, 
            averageScore
        );
    }, [completedCount, totalSteps, userProfile.graduationYear, averageScore]);

    const roleData = useMemo(() => {
        return predictionEngine.mapRoleBySkills(branchId, completedCount * 1.5);
    }, [branchId, completedCount]);

    const riskColor = prediction.riskLevel === "High" ? "#ef4444" : prediction.riskLevel === "Medium" ? "#f59e0b" : "#10b981";

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)", pointerEvents: "none" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Target size={18} color="#a78bfa" />
                    </div>
                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 700 }}>🎯 Future Readiness</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${riskColor}15`, border: `1px solid ${riskColor}30`, padding: "4px 10px", borderRadius: 999 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: riskColor }} />
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.65rem", color: riskColor, fontWeight: 700 }}>{prediction.riskLevel} RISK</span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Predicted Role</p>
                    <p style={{ color: "#e2e8f0", fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700 }}>{roleData.recommendedRole}</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Next Readiness Target</p>
                    <p style={{ color: "#e2e8f0", fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700 }}>{prediction.predictedCompletionDate}</p>
                </div>
            </div>

            <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 16, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "#a78bfa", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>MATURITY INDEX</span>
                    <span style={{ fontSize: "0.85rem", color: "white", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>{prediction.maturityIdx}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.maturityIdx}%` }} transition={{ duration: 0.8 }}
                        style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #7c3aed, #3b82f6)", boxShadow: "0 0 10px rgba(139,92,246,0.3)" }} />
                </div>
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 12, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
                    {prediction.message}
                </p>
            </div>
        </div>
    );
};
