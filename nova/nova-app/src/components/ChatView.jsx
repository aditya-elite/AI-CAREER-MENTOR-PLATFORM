import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { QUESTIONS } from "../data/constants";
import { computeCareerMatch, getPersonalizedMessage } from "../utils/engine";
import { StarField, Confetti } from "./Background";
import { CareerForgeAvatar } from "./Avatar";
import { CareerCard } from "./CareerCard";
import { useAppContext } from "../context/AppContext";

const TypingDots = () => (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
        {[0, 1, 2].map(i => (
            <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6",
                animation: `twinkle 0.8s ${i * 0.2}s infinite`,
            }} />
        ))}
    </div>
);

export const ChatView = ({ userName }) => {
    const { updateProfile } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [profile, setProfile] = useState({});
    const [careerForgeTyping, setCareerForgeTyping] = useState(false);
    const [phase, setPhase] = useState("chat"); // chat | reveal
    const [matches, setMatches] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const bottomRef = useRef(null);

    // Voice states
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, []);

    const speakCareerForge = useCallback((text) => {
        if (!voiceEnabled) return;
        const msg = new SpeechSynthesisUtterance(text.replace(/[\*🌌🚀🥺👀💻🎨🩺🔬📈⚖️]/g, ""));
        msg.rate = 1.0;
        msg.pitch = 1.05;
        // Optionally select a nice English voice
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Female")) || voices.find(v => v.lang.startsWith("en"));
        if (engVoice) msg.voice = engVoice;
        window.speechSynthesis.speak(msg);
    }, [voiceEnabled]);

    useEffect(() => {
        setCareerForgeTyping(true);
        setTimeout(() => {
            const q = QUESTIONS[0];
            const greeting = `Hey ${userName}! ` + q.CareerForge;
            setMessages([{ id: "careerforge_0", from: "careerforge", text: greeting, choices: q.choices, qIndex: 0 }]);
            setCareerForgeTyping(false);
            if(voiceEnabled) speakCareerForge(greeting);
        }, 1200);
    }, [userName, voiceEnabled]);

    useEffect(() => { scrollToBottom(); }, [messages, careerForgeTyping]);

    const handleChoice = useCallback((choice, qIndex) => {
        // stop any ongoing voice
        window.speechSynthesis.cancel();
        if (isListening) stopListening();

        const question = QUESTIONS[qIndex];
        // Record profile
        const newProfile = { ...profile };
        if (question.key) newProfile[question.key] = choice.value;
        setProfile(newProfile);

        // Add user message
        const userMsg = { id: `user_${qIndex}`, from: "user", text: choice.label };
        setMessages(prev => [
            ...prev.map(m => m.qIndex === qIndex ? { ...m, answered: choice.label } : m),
            userMsg,
        ]);

        const nextIndex = qIndex + 1;
        if (nextIndex >= QUESTIONS.length) {
            // Final — compute matches
            setCareerForgeTyping(true);
            setTimeout(() => {
                const computed = computeCareerMatch(newProfile);
                setMatches(computed);
                const personalMsg = getPersonalizedMessage(computed, newProfile);
                const finalText = `${personalMsg}\n\nBased on everything you've shared, I've built your personalised career map. Here are your top matches — pick one to see your full roadmap! 🗺️`;
                setMessages(prev => [...prev, { id: "careerforge_final", from: "careerforge", text: finalText }]);
                setCareerForgeTyping(false);
                setPhase("reveal");
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                if(voiceEnabled) speakCareerForge(finalText);
            }, 1800);
        } else {
            setCareerForgeTyping(true);
            setTimeout(() => {
                const q = QUESTIONS[nextIndex];
                setMessages(prev => [...prev, { id: `careerforge_${nextIndex}`, from: "careerforge", text: q.CareerForge, choices: q.choices, qIndex: nextIndex }]);
                setCareerForgeTyping(false);
                setCurrentQ(nextIndex);
                if(voiceEnabled) speakCareerForge(q.CareerForge);
            }, 1000 + Math.random() * 600);
        }
    }, [profile, voiceEnabled, isListening]);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                setIsListening(false);
                
                // Find current question choices
                const currentMsg = messages.filter(m => m.from === "careerforge" && !m.answered).pop();
                if (currentMsg && currentMsg.choices) {
                    // primitive fuzzy matching
                    let matchedChoice = currentMsg.choices.find(c => 
                        transcript.includes(c.label.toLowerCase().replace(/[^a-z0-9]/g, '')) || 
                        transcript.includes(c.value.toLowerCase()) ||
                        c.label.toLowerCase().replace(/[^a-z0-9]/g, '').includes(transcript)
                    );
                    
                    if(!matchedChoice && currentMsg.choices.length > 0) {
                        // if numbers are spoken
                        if(transcript.includes("first") || transcript.includes("one") || transcript === "1") matchedChoice = currentMsg.choices[0];
                        else if(transcript.includes("second") || transcript.includes("two") || transcript === "2") matchedChoice = currentMsg.choices[1];
                        else if(transcript.includes("third") || transcript.includes("three") || transcript === "3") matchedChoice = currentMsg.choices[2];
                        else if(transcript.includes("fourth") || transcript.includes("four") || transcript === "4") matchedChoice = currentMsg.choices[3];
                        else if(transcript.includes("fifth") || transcript.includes("five") || transcript === "5") matchedChoice = currentMsg.choices[4];
                        else if(transcript.includes("sixth") || transcript.includes("six") || transcript === "6") matchedChoice = currentMsg.choices[5];
                    }

                    if (matchedChoice) {
                        handleChoice(matchedChoice, currentMsg.qIndex);
                    } else {
                        // could not understand
                        if(voiceEnabled) speakCareerForge("I couldn't quite catch that. Could you tap your choice instead?");
                    }
                }
            };
            recognitionRef.current.onerror = (e) => {
                setIsListening(false);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [messages, handleChoice, voiceEnabled]);

    const toggleListening = () => {
        if (!recognitionRef.current) return alert("Speech Recognition not supported in this browser.");
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if(isListening && recognitionRef.current){
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }

    const progress = Math.round((Object.keys(profile).length / (QUESTIONS.length - 1)) * 100);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #04060f 0%, #080d1a 100%)", display: "flex", flexDirection: "column", position: "relative" }}>
            <StarField />
            <Confetti active={showConfetti} />

            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "12px 16px", background: "rgba(4,6,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
                <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
                    <CareerForgeAvatar speaking={careerForgeTyping || !!window.speechSynthesis.speaking} size={36} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem" }}>CareerForge <span style={{ fontSize: "0.65rem", color: "#10b981", fontFamily: "DM Sans, sans-serif", fontWeight: 400 }}>● online</span></p>
                        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#475569", fontSize: "0.72rem" }}>Career Intelligence Engine</p>
                    </div>
                    {/* Voice Controls */}
                    <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{ background: "transparent", border: "none", cursor: "pointer", color: voiceEnabled ? "#10b981" : "#475569", marginRight: 8 }}>
                        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    {phase === "chat" && (
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontFamily: "Syne, sans-serif", color: "#8b5cf6", fontSize: "0.7rem", marginBottom: 4 }}>{progress}%</p>
                            <div style={{ width: 80, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)", borderRadius: 2, transition: "width 0.5s ease" }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
                {messages.map((msg, i) => (
                    <div key={msg.id} style={{ marginBottom: 20, animation: `fadeUp 0.4s ease-out` }}>
                        {msg.from === "careerforge" ? (
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <CareerForgeAvatar speaking={false} size={34} />
                                <div style={{ maxWidth: "78%", flex: "none" }}>
                                    <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "0 16px 16px 16px", padding: "12px 16px" }}>
                                        {msg.text.split("\n\n").map((para, pi) => (
                                            <p key={pi} style={{ fontFamily: "DM Sans, sans-serif", color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: pi < msg.text.split("\n\n").length - 1 ? 10 : 0 }}>
                                                {para.split("**").map((part, idx) =>
                                                    idx % 2 === 1
                                                        ? <strong key={idx} style={{ color: "#a78bfa", fontWeight: 600 }}>{part}</strong>
                                                        : part
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                    {/* Choices */}
                                    {msg.choices && !msg.answered && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                                            {msg.choices.map(c => (
                                                <button key={c.value} onClick={() => handleChoice(c, msg.qIndex)}
                                                    style={{
                                                        padding: "8px 14px", borderRadius: 999,
                                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                                                        color: "#cbd5e1", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                                                        fontSize: "0.82rem", transition: "all 0.15s", outline: "none",
                                                    }}
                                                    onMouseEnter={e => { e.target.style.background = "rgba(139,92,246,0.2)"; e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.color = "#e2e8f0"; }}
                                                    onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.color = "#cbd5e1"; }}>
                                                    {c.label}
                                                </button>
                                            ))}
                                            {window.SpeechRecognition || window.webkitSpeechRecognition ? (
                                                <button onClick={toggleListening}
                                                    style={{
                                                        padding: "8px 14px", borderRadius: 999,
                                                        background: isListening ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.1)",
                                                        border: isListening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(16,185,129,0.3)",
                                                        color: isListening ? "#fca5a5" : "#6ee7b7", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                                                        fontSize: "0.82rem", transition: "all 0.15s", outline: "none", display: "flex", alignItems:"center", gap: 6
                                                    }}>
                                                    {isListening ? <MicOff size={14}/> : <Mic size={14}/>}
                                                    {isListening ? "Listening..." : "Speak Answer"}
                                                </button>
                                            ) : null}
                                        </div>
                                    )}
                                    {msg.answered && (
                                        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#334155", fontSize: "0.7rem", marginTop: 6, marginLeft: 4 }}>You answered: {msg.answered}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px 0 16px 16px", padding: "10px 16px", maxWidth: "65%" }}>
                                    <p style={{ fontFamily: "DM Sans, sans-serif", color: "#e2e8f0", fontSize: "0.88rem" }}>{msg.text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {careerForgeTyping && (
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
                        <CareerForgeAvatar speaking={true} size={34} />
                        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "0 16px 16px 16px", padding: "12px 16px" }}>
                            <TypingDots />
                        </div>
                    </div>
                )}

                {/* Career match results */}
                {phase === "reveal" && matches.length > 0 && (
                    <div style={{ marginTop: 8, animation: "fadeUp 0.5s ease-out" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                            {matches.slice(0, 4).map((m, i) => (
                                <CareerCard key={m.career.id} match={m} rank={i} selected={false}
                                    onSelect={(careerId) => updateProfile({ ...profile, preferredCareer: careerId })} />
                            ))}
                        </div>
                        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#334155", fontSize: "0.75rem", textAlign: "center" }}>Tap any career to see your full personalised roadmap →</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
