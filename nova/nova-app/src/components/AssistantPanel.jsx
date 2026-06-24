import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Brain } from 'lucide-react';
import { CareerForgeAvatar } from './Avatar';
import { assistantEngine } from '../services/assistantEngine';
import { useAppContext } from '../context/AppContext';
import { CAREERS } from '../data/constants';

export const AssistantPanel = () => {
    const { completedSteps, userProfile, tasks } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: "bot", text: "I'm CareerForge. I track your roadmap and test scores to guide your next move. Ask me 'Analyze my progress'!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    const career = CAREERS[userProfile.preferredCareer];
    const branch = career ? Object.values(career.branches)[0] : null;
    const milestones = branch?.milestones || [];

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userText }]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const userData = {
                milestones,
                completedStepsData: completedSteps,
                userProfile,
                tasks,
                branchId: branch?.id
            };
            const response = assistantEngine.generateResponse(userText, userData);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: "bot", text: response }]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{ width: 340, height: 480, background: "rgba(15,23,42,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 24, marginBottom: 16, display: "flex", flexDirection: "column", overflow: "hidden", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 100px rgba(139,92,246,0.15)" }}>

                        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg, rgba(139,92,246,0.1), transparent)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <CareerForgeAvatar size={32} />
                                <div>
                                    <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem" }}>Intelligence Assistant</p>
                                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#64748b", fontSize: "0.65rem" }}>Context-Aware Active</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}><X size={18} /></button>
                        </div>

                        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                            {messages.map((m) => (
                                <div key={m.id} style={{ alignSelf: m.sender === "bot" ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                                    <div style={{
                                        background: m.sender === "bot" ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                        border: m.sender === "bot" ? "1px solid rgba(255,255,255,0.08)" : "none",
                                        borderRadius: m.sender === "bot" ? "16px 16px 16px 0" : "16px 16px 0 16px", padding: "10px 14px",
                                        color: m.sender === "bot" ? "#cbd5e1" : "white", fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", lineHeight: 1.5
                                    }}>
                                        {m.text.split('\n').map((line, idx) => (
                                            <p key={idx} style={{ margin: 0, marginBottom: 4 }}>
                                                {line.split("**").map((part, pidx) => pidx % 2 === 1 ? <strong key={pidx} style={{ color: "#a78bfa" }}>{part}</strong> : part)}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 16 }}><span style={{ color: "#8b5cf6", animation: "twinkle 1s infinite" }}>● ● ●</span></div>}
                            <div ref={bottomRef} />
                        </div>

                        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask for career advice..."
                                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 12px", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", outline: "none" }} />
                            <button onClick={handleSend} style={{ width: 38, height: 38, background: "#7c3aed", border: "none", borderRadius: 12, color: "white", cursor: "pointer" }}><Send size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)}
                style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #7c3aed, #3b82f6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", boxShadow: "0 10px 25px rgba(139,92,246,0.3)" }}>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};
