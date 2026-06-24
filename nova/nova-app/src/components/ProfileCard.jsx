import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, Award, Briefcase, CheckCircle2 } from 'lucide-react';

export const ProfileCard = ({ userName, career, role }) => {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#04060f',
                scale: 2, // High resolution
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `CareerForge_2032_Profile_${userName}.png`;
            link.click();
        } catch (err) {
            console.error(err);
        }
        setDownloading(false);
    };

    return (
        <div style={{ marginTop: 40, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${career.color}30, transparent 70%)`, pointerEvents: "none" }} />
            
            <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontWeight: 700, fontSize: "1.2rem", marginBottom: 6, textAlign: "center" }}>🔮 Your Future Vision: 2032</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.82rem", marginBottom: 24, textAlign: "center", maxWidth: 400 }}>This is a glimpse of where your trajectory might lead in 8 years if you follow this path.</p>
            
            {/* The Badge to Download */}
            <div ref={cardRef} style={{ width: "100%", maxWidth: 400, background: "linear-gradient(145deg, rgba(8,13,26,0.9), rgba(15,23,42,0.95))", border: `1px solid ${career.color}40`, borderRadius: 16, padding: "24px", position: "relative", overflow: "hidden", boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)` }}>
                {/* Header pattern */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 70, background: `linear-gradient(90deg, ${career.color}40, ${career.color}10)`, borderBottom: `1px solid ${career.color}40` }} />
                
                {/* Profile Pic area */}
                <div style={{ marginTop: 16, marginBottom: 16, position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${career.color}, #1e293b)`, border: "3px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", color: "white", fontSize: "1.8rem", fontWeight: 800, boxShadow: `0 0 20px ${career.color}50` }}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span style={{ display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontFamily: "Syne, sans-serif", fontSize: "0.6rem", padding: "4px 8px", borderRadius: 999, fontWeight: 700, letterSpacing: "0.1em" }}>CAREERFORGE VERIFIED</span>
                    </div>
                </div>

                {/* Details */}
                <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <h3 style={{ fontFamily: "Syne, sans-serif", color: "white", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{userName}</h3>
                        <CheckCircle2 color="#3b82f6" fill="white" size={16}/>
                    </div>
                    
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 600, marginTop: 4 }}>
                        Senior {role || career.branches[Object.keys(career.branches)[0]].roles[0]}
                    </p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                        Top Tier Expert · 8 Yrs Experience
                    </p>

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: "0.75rem", fontFamily: "Syne, sans-serif", textTransform: "uppercase" }}>
                                <Award size={14}/> Top Achievements
                            </div>
                            <ul style={{ margin: "8px 0 0 0", paddingLeft: 16, color: "#cbd5e1", fontSize: "0.8rem", fontFamily: "DM Sans, sans-serif", listStyle: "circle" }}>
                                <li style={{marginBottom: 4}}>Distinguished Alumni</li>
                                <li>Global Innovator 2032</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, zIndex: 10 }}>
                <button onClick={handleDownload} disabled={downloading} style={{ padding: "12px 20px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, color: "white", fontFamily: "Syne, sans-serif", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                    <Download size={16}/> {downloading ? "Saving..." : "Download as Image"}
                </button>
            </div>
        </div>
    );
};
