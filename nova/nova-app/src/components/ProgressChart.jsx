import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { chartUtils } from '../utils/chartUtils';
import { useAppContext } from '../context/AppContext';

export const ProgressChart = () => {
    const { completedSteps } = useAppContext();
    const [view, setView] = useState("Weekly");

    const data = useMemo(() => {
        if (view === "Weekly") return chartUtils.groupByWeek(completedSteps);
        if (view === "Hourly") return chartUtils.groupByHour(completedSteps);
        return [];
    }, [completedSteps, view]);

    const activeColor = view === "Weekly" ? "#3b82f6" : "#8b5cf6";

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 700 }}>Trajectory Velocity</p>
                <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10 }}>
                    {["Weekly", "Hourly"].map(v => (
                        <button key={v} onClick={() => setView(v)}
                            style={{
                                padding: "6px 14px", borderRadius: 8, border: "none",
                                background: view === v ? activeColor : "transparent",
                                color: view === v ? "white" : "#64748b",
                                fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s"
                            }}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ height: 240, width: "100%" }}>
                {Object.keys(completedSteps).length === 0 ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem" }}>
                        Complete your first milestone test to generate your performance map.
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeColor} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={activeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: `1px solid ${activeColor}44`, borderRadius: 8, color: "#fff" }} itemStyle={{ color: activeColor }} />
                            <Area type="monotone" dataKey="steps" stroke={activeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorTrajectory)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
