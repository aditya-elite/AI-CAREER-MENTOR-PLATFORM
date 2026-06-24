import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, ChevronRight, Award } from 'lucide-react';
import { testEngine } from '../utils/testEngine';

export const MockTestModal = ({ step, onComplete, onClose }) => {
    const [testData] = useState(() => testEngine.generateQuestions(step));
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);

    const handleSubmit = () => {
        const evalResults = testEngine.evaluateTest(testData.questions, Object.values(answers));
        setResults(evalResults);
    };

    const isAllAnswered = Object.keys(answers).length === testData.questions.length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>

            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                style={{ background: "#0f172a", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 24, padding: 32, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

                <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                    <X size={24} />
                </button>

                {!results ? (
                    <>
                        <div style={{ marginBottom: 24 }}>
                            <p style={{ fontFamily: "Syne, sans-serif", color: "#a78bfa", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Knowledge Validation</p>
                            <h2 style={{ fontFamily: "Syne, sans-serif", color: "white", fontSize: "1.6rem", marginTop: 8 }}>{step.title} Test</h2>
                            <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.9rem", marginTop: 4 }}>Difficulty: <strong style={{ color: "#e2e8f0" }}>{testData.difficulty}</strong> • Passing Score: 70%</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                            {testData.questions.map((q, qIdx) => (
                                <div key={qIdx}>
                                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", marginBottom: 16 }}>{qIdx + 1}. {q.question}</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {q.options.map((opt, optIdx) => (
                                            <button key={optIdx}
                                                onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                                style={{
                                                    padding: "12px 16px", borderRadius: 12, textAlign: "left",
                                                    background: answers[qIdx] === optIdx ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                                                    border: `1px solid ${answers[qIdx] === optIdx ? "rgba(139,92,246,0.5)" : "rgba(71,85,105,0.2)"}`,
                                                    color: answers[qIdx] === optIdx ? "white" : "#94a3b8",
                                                    fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s"
                                                }}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleSubmit} disabled={!isAllAnswered}
                            style={{
                                marginTop: 40, width: "100%", padding: "16px", borderRadius: 14, border: "none",
                                background: isAllAnswered ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "#334155",
                                color: "white", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem",
                                cursor: isAllAnswered ? "pointer" : "not-allowed", transition: "all 0.2s", opacity: isAllAnswered ? 1 : 0.6
                            }}>
                            Submit Answers
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: results.passed ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            {results.passed ? <Award size={40} color="#10b981" /> : <AlertTriangle size={40} color="#ef4444" />}
                        </div>
                        <h2 style={{ fontFamily: "Syne, sans-serif", color: "white", fontSize: "1.8rem", marginBottom: 8 }}>{results.passed ? "Success!" : "Test Failed"}</h2>
                        <p style={{ fontFamily: "Syne, sans-serif", color: results.passed ? "#10b981" : "#ef4444", fontSize: "1.4rem", fontWeight: 800 }}>{results.score}%</p>
                        <p style={{ color: "#64748b", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", marginTop: 8 }}>{results.passed ? `Skill validated: ${step.title}` : "You need 70% to unlock the next milestone."}</p>

                        {results.weakSkills.length > 0 && (
                            <div style={{ marginTop: 24, padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, textAlign: "left" }}>
                                <p style={{ fontSize: "0.7rem", color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Weak Points Detected</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {results.weakSkills.map(s => <span key={s} style={{ padding: "4px 8px", background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.2)", borderRadius: 6, color: "#fda4af", fontSize: "0.7rem" }}>{s}</span>)}
                                </div>
                            </div>
                        )}

                        <button onClick={() => onComplete(results.score, results.passed)}
                            style={{
                                marginTop: 32, width: "100%", padding: "14px", borderRadius: 12, border: "none",
                                background: results.passed ? "#10b981" : "#334155",
                                color: "white", fontFamily: "Syne, sans-serif", fontWeight: 700, cursor: "pointer"
                            }}>
                            {results.passed ? "Unlock Next Step" : "Close and Review"}
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
