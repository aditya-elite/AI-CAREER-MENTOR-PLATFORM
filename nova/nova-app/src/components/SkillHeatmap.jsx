import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { MOCK_TEST_POOL } from '../data/mockTests';

export const SkillHeatmap = () => {
    const { completedSteps } = useAppContext();

    const skillMaturity = useMemo(() => {
        const skills = {}; // { skillName: { totalPoints: number, count: number } }
        
        Object.keys(completedSteps).forEach(stepId => {
            const data = completedSteps[stepId];
            const pool = MOCK_TEST_POOL[stepId];
            if (pool) {
                pool.forEach(q => {
                    if (!skills[q.skillTag]) skills[q.skillTag] = { total: 0, count: 0 };
                    // If pass step, assume skills in that pool get maturity from the score
                    skills[q.skillTag].total += data.score;
                    skills[q.skillTag].count += 1;
                });
            }
        });

        return Object.keys(skills).map(name => ({
            name,
            value: Math.round(skills[name].total / skills[name].count)
        }));
    }, [completedSteps]);

    if (skillMaturity.length === 0) {
        return (
            <div style={{ padding: 24, textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20 }}>
                <p style={{ color: "#475569", fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem" }}>
                    No skill data yet. Complete tests to build your heatmap.
                </p>
            </div>
        );
    }

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 24 }}>
            <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 700, marginBottom: 20 }}>🧠 Skill Heatmap</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skillMaturity.map((s, idx) => {
                    const opacity = s.value / 100;
                    return (
                        <div key={idx} style={{ flex: "1 0 calc(50% - 10px)", minWidth: 120, padding: "12px 14px", background: `rgba(139,92,246,${opacity * 0.3})`, border: `1px solid rgba(139,92,246,${opacity * 0.5})`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: "#e2e8f0", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>{s.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "#a78bfa", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>{s.value}%</span>
                        </div>
                    );
                })}
            </div>
            <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: 16, fontFamily: "DM Sans, sans-serif", textAlign: "center" }}>
                Opacity represents your competency level in each domain.
            </p>
        </div>
    );
};
