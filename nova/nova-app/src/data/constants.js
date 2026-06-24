import {
    Send, ChevronRight, Star, Zap, Trophy, Flame, Target,
    Map, MessageCircle, BarChart2, User, Sparkles, ArrowRight,
    Lock, CheckCircle, Clock, TrendingUp, Award, Brain,
    Compass, Lightbulb, RefreshCw, ChevronDown, ChevronUp,
    ExternalLink, Heart, Code, Palette, FlaskConical, Globe,
    Music, Cpu, Building, Stethoscope, Scale, Camera,
    Rocket, GraduationCap, LogIn, X, Info
} from "lucide-react";

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #04060f; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 10px; }
  @keyframes twinkle { 0%,100%{opacity:0.08} 50%{opacity:0.6} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
  @keyframes orbit { from{transform:rotate(0deg) translateX(60px) rotate(0deg)} to{transform:rotate(360deg) translateX(60px) rotate(-360deg)} }
  @keyframes typewriter { from{width:0} to{width:100%} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }
  @keyframes nodeReveal { 0%{transform:scale(0.4) translateY(20px);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes pathDraw { from{stroke-dashoffset:500} to{stroke-dashoffset:0} }
  @keyframes gradMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 12px rgba(139,92,246,0.3)} 50%{box-shadow:0 0 30px rgba(139,92,246,0.7),0 0 60px rgba(139,92,246,0.2)} }
  @keyframes slideDown { from{transform:translateY(-12px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
`;

export const CAREERS = {
    tech: {
        id: "tech", label: "Technology & Engineering",
        icon: Cpu, color: "#3b82f6", glow: "#3b82f620",
        emoji: "💻",
        branches: {
            software: {
                id: "software", label: "Software Engineering",
                color: "#6366f1",
                milestones: [
                    { id: "s1", phase: "Foundation", title: "Class 10 Core", desc: "Build strong logic, algorithmic thinking, and foundational maths.", year: "Class 10", xp: 200, deepLink: "https://code.org/" },
                    { id: "s2", phase: "Build", title: "Class 11 Programming", desc: "Learn your first language (Python/JS) alongside advanced subjects.", year: "Class 11", xp: 300, deepLink: "https://www.freecodecamp.org/" },
                    { id: "s3", phase: "Excel", title: "Class 12 Boards & Prep", desc: "Master concepts while preparing for major engineering entrances.", year: "Class 12", xp: 400, deepLink: "https://jeemain.nta.ac.in/" },
                ],
                roles: ["Full Stack Developer", "AI Engineer", "DevOps Engineer", "Cybersecurity Analyst"],
                colleges: ["IITs", "NITs", "BITS Pilani", "IIITs", "VIT", "SRM"],
                exams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "State CETs"],
            },
            data: {
                id: "data", label: "Data Science & AI",
                color: "#8b5cf6",
                milestones: [
                    { id: "d1", phase: "Explore", title: "Class 10 Statistics", desc: "Maths, patterns, and data literacy foundation.", year: "Class 10", xp: 200, deepLink: "https://khanacademy.org" },
                    { id: "d2", phase: "Analytics", title: "Class 11 Prob & Python", desc: "Master Python fundamentals and basic data visualisation.", year: "Class 11", xp: 350, deepLink: "https://kaggle.com" },
                    { id: "d3", phase: "Pre-AI", title: "Class 12 Advance Maths", desc: "Solidify Calculus and Algebra for Data Science entrance exams.", year: "Class 12", xp: 500, deepLink: "https://cuet.samarth.ac.in/" },
                ],
                roles: ["Data Scientist", "ML Engineer", "AI Researcher", "Data Analyst"],
                colleges: ["IISc", "ISI Kolkata", "IIT Bombay", "CMI", "SNU", "NITs"],
                exams: ["JEE", "CUET", "ISI Entrance", "CMI Entrance"],
            },
        },
    },
    medicine: {
        id: "medicine", label: "Medicine & Healthcare",
        icon: Stethoscope, color: "#10b981", glow: "#10b98120",
        emoji: "🩺",
        branches: {
            mbbs: {
                id: "mbbs", label: "MBBS / Clinical Medicine",
                color: "#10b981",
                milestones: [
                    { id: "m1", phase: "Life Science", title: "Class 10 Biology", desc: "Understand human systems to build a medical core.", year: "Class 10", xp: 200, deepLink: "https://kidshealth.org" },
                    { id: "m2", phase: "Core Prep", title: "Class 11 PCB", desc: "Physics, Chemistry, Biology — NCERT foundational mastery.", year: "Class 11", xp: 400, deepLink: "https://ncert.nic.in" },
                    { id: "m3", phase: "Crack", title: "Class 12 & NEET", desc: "Accelerated preparation for boards and NEET UG.", year: "Class 12", xp: 600, deepLink: "https://neet.nta.nic.in/" },
                ],
                roles: ["General Physician", "Surgeon", "Cardiologist", "Neurologist", "Psychiatrist"],
                colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "AFMC", "MAMC"],
                exams: ["NEET-UG"],
            },
            pharma: {
                id: "pharma", label: "Pharmacy & Biotech",
                color: "#06b6d4",
                milestones: [
                    { id: "p1", phase: "Explore", title: "Class 10 Chemistry", desc: "Understanding the building blocks of science.", year: "Class 10", xp: 150, deepLink: "https://khanacademy.org/science/chemistry" },
                    { id: "p2", phase: "Compounds", title: "Class 11 Organic Chem", desc: "Dive into organic structures and living systems.", year: "Class 11", xp: 300, deepLink: "https://ncert.nic.in" },
                    { id: "p3", phase: "Entrance", title: "Class 12 & Pharma Exams", desc: "Gear up for State CETs and CUET for top Biotech programs.", year: "Class 12", xp: 450, deepLink: "https://cuet.samarth.ac.in/" },
                ],
                roles: ["Pharmacist", "Drug Researcher", "Biotech Analyst", "Regulatory Affairs"],
                colleges: ["NIPER", "Jamia Hamdard", "Manipal", "BITS Pilani Pharmacy", "JSS"],
                exams: ["NEET", "CUET", "State Pharmacy CETs", "BITSAT"],
            },
        },
    },
    law: {
        id: "law", label: "Law & Justice",
        icon: Scale, color: "#f59e0b", glow: "#f59e0b20",
        emoji: "⚖️",
        branches: {
            clat: {
                id: "clat", label: "Law (CLAT / NLU)",
                color: "#f59e0b",
                milestones: [
                    { id: "l1", phase: "Awareness", title: "Class 10 Civics", desc: "Debate, current affairs and democratic foundations.", year: "Class 10", xp: 150, deepLink: "https://www.thehindu.com" },
                    { id: "l2", phase: "Logic", title: "Class 11 CLAT Prep", desc: "Logical reasoning, English comprehension & legal awareness starts.", year: "Class 11", xp: 350, deepLink: "https://consortiumofnlus.ac.in/" },
                    { id: "l3", phase: "Defend", title: "Class 12 CLAT Crunch", desc: "Mock tests, current affairs analysis, and board management.", year: "Class 12", xp: 500, deepLink: "https://nludelhi.ac.in/" },
                ],
                roles: ["Advocate", "Corporate Lawyer", "Judge", "Legal Advisor", "Policy Analyst"],
                colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "NUJS Kolkata", "Symbiosis Law"],
                exams: ["CLAT", "AILET", "LSAT India", "SLAT"],
            },
        },
    },
    design: {
        id: "design", label: "Design & Creative Arts",
        icon: Palette, color: "#ec4899", glow: "#ec489920",
        emoji: "🎨",
        branches: {
            ux: {
                id: "ux", label: "UI/UX & Product Design",
                color: "#ec4899",
                milestones: [
                    { id: "ux1", phase: "Curiosity", title: "Class 10 Arts", desc: "Sketching, observing aesthetics, and learning design basics.", year: "Class 10", xp: 150, deepLink: "https://awwwards.com" },
                    { id: "ux2", phase: "Digital", title: "Class 11 Interfaces", desc: "Figma introduction, color theory, and digital layout experiments.", year: "Class 11", xp: 300, deepLink: "https://figma.com/community" },
                    { id: "ux3", phase: "Portfolio", title: "Class 12 UCEED Prep", desc: "Building your first mini-portfolio and preparing for Design entrances.", year: "Class 12", xp: 500, deepLink: "https://uceed.iitb.ac.in/" },
                ],
                roles: ["UI Designer", "UX Researcher", "Product Designer", "Motion Designer"],
                colleges: ["NID Ahmedabad", "IDC IIT Bombay", "NIFT", "Srishti Bangalore"],
                exams: ["UCEED", "NID DAT", "NIFT Entrance", "CEED"],
            },
            film: {
                id: "film", label: "Film, Media & Animation",
                color: "#f97316",
                milestones: [
                    { id: "f1", phase: "Story", title: "Class 10 Storytelling", desc: "Narrative foundations, photography, and creative writing.", year: "Class 10", xp: 150, deepLink: "https://vimeo.com" },
                    { id: "f2", phase: "Tools", title: "Class 11 Video Editing", desc: "Adobe tools, visual effects basics, and short film experiments.", year: "Class 11", xp: 300, deepLink: "https://blender.org" },
                    { id: "f3", phase: "Direct", title: "Class 12 Media Exams", desc: "Prepare portfolio for Film institutes alongside your exams.", year: "Class 12", xp: 450, deepLink: "https://ftii.ac.in/" },
                ],
                roles: ["Film Director", "VFX Artist", "3D Animator", "Content Creator", "DoP"],
                colleges: ["FTII Pune", "Symbiosis Mass Comm", "SRFTI Kolkata", "NID (Animation)"],
                exams: ["FTII Entrance", "Portfolio Reviews", "Symbiosis SET"],
            },
        },
    },
    business: {
        id: "business", label: "Business & Commerce",
        icon: TrendingUp, color: "#06b6d4", glow: "#06b6d420",
        emoji: "📈",
        branches: {
            management: {
                id: "management", label: "Management & Entrepreneurship",
                color: "#06b6d4",
                milestones: [
                    { id: "b1", phase: "Leadership", title: "Class 10 Economics", desc: "Understanding the market, debate clubs, and communication.", year: "Class 10", xp: 150, deepLink: "https://hbr.org" },
                    { id: "b2", phase: "Commerce", title: "Class 11 Accounts & Biz", desc: "Mastering balance sheets, econ, and business studies.", year: "Class 11", xp: 250, deepLink: "https://economictimes.indiatimes.com/" },
                    { id: "b3", phase: "Crack", title: "Class 12 IPMAT/CUET", desc: "Prepare for Integrated BBA/MBA programs at IIMs and DU.", year: "Class 12", xp: 400, deepLink: "https://www.iimidr.ac.in/" },
                ],
                roles: ["Product Manager", "Founder/CEO", "Management Consultant", "Financial Analyst", "Marketing Head"],
                colleges: ["IIM Indore (IPM)", "IIM Rohtak", "SRCC (Delhi University)", "NMIMS", "Christ University"],
                exams: ["IPMAT", "CUET", "NPAT", "SET", "IPU CET"],
            },
        },
    },
    science: {
        id: "science", label: "Pure Science & Research",
        icon: FlaskConical, color: "#a855f7", glow: "#a855f720",
        emoji: "🔬",
        branches: {
            research: {
                id: "research", label: "Scientific Research",
                color: "#a855f7",
                milestones: [
                    { id: "r1", phase: "Query", title: "Class 10 Deep Science", desc: "Nurturing fundamental curiosity in laws of physics and nature.", year: "Class 10", xp: 150, deepLink: "https://nasa.gov" },
                    { id: "r2", phase: "Olympiad", title: "Class 11 Competitive Sci", desc: "Entering Olympiads, KVPY prep, and advanced problem solving.", year: "Class 11", xp: 350, deepLink: "https://olympiads.hbcse.tifr.res.in/" },
                    { id: "r3", phase: "Discovery", title: "Class 12 IISc Prep", desc: "IAT, NEST, and JEE preparation for top tier science institutes.", year: "Class 12", xp: 500, deepLink: "https://iiseradmission.in/" },
                ],
                roles: ["Research Scientist", "Professor", "ISRO Scientist", "Drug Discoverer", "Astrophysicist"],
                colleges: ["IISc Bangalore", "IISERs", "NISER", "TIFR (Postgrad)", "Central Universities"],
                exams: ["IAT", "NEST", "JEE Main", "JEE Advanced", "CUET"],
            },
        },
    },
};

export const QUESTIONS = [
    {
        id: "q_intro",
        CareerForge: "Hey! I'm CareerForge — your personal career intelligence. 🌌\n\nI'm going to ask you a few questions to understand who you are and what lights you up inside. There are no right or wrong answers — just be honest.\n\nReady to discover your path?",
        type: "choice",
        choices: [{ label: "Let's go! 🚀", value: "start" }, { label: "Sure, I'm curious 👀", value: "start" }],
        key: null,
    },
    {
        id: "q_vibe",
        CareerForge: "When you imagine your future self at work — what feels most like YOU?",
        type: "choice",
        key: "vibe",
        choices: [
            { label: "💻 Building things with tech", value: "tech" },
            { label: "🎨 Creating art, design or media", value: "creative" },
            { label: "🩺 Helping people stay healthy", value: "helping" },
            { label: "🔬 Discovering how things work", value: "curious" },
            { label: "📈 Leading, selling, building companies", value: "leader" },
            { label: "⚖️ Fighting for justice & rights", value: "justice" },
        ],
    },
    {
        id: "q_strength",
        CareerForge: "Nice! Now, what do people around you say you're genuinely good at?",
        type: "choice",
        key: "strength",
        choices: [
            { label: "🧠 Thinking logically & solving problems", value: "logical" },
            { label: "🗣️ Communicating & convincing people", value: "social" },
            { label: "✏️ Drawing, designing or making things", value: "artistic" },
            { label: "📚 Remembering and understanding complex stuff", value: "academic" },
            { label: "🔧 Fixing things or building projects", value: "hands_on" },
            { label: "🌍 Understanding people and society", value: "empathy" },
        ],
    },
    {
        id: "q_saturday",
        CareerForge: "It's Saturday morning — no school, no plans. What do you actually end up doing?",
        type: "choice",
        key: "leisure",
        choices: [
            { label: "🎮 Gaming, coding or tinkering with gadgets", value: "tech" },
            { label: "🎬 Watching films, editing videos, making art", value: "creative" },
            { label: "📖 Reading news, history or random Wikipedia holes", value: "curious" },
            { label: "🏃 Sports, outdoors or social activities", value: "social" },
            { label: "💡 Thinking about a business idea or side project", value: "entrepreneurial" },
            { label: "🤝 Volunteering or helping someone out", value: "helping" },
        ],
    },
    {
        id: "q_fear",
        CareerForge: "Let's flip it. What sounds like your personal nightmare as a career?",
        type: "choice",
        key: "aversion",
        choices: [
            { label: "😰 Sitting at a computer all day", value: "no_tech" },
            { label: "🏥 Dealing with illness or blood", value: "no_medical" },
            { label: "📝 Memorising huge textbooks", value: "no_rote" },
            { label: "💬 Constant presentations or public speaking", value: "no_social" },
            { label: "🔢 Lots of maths and calculations", value: "no_math" },
            { label: "🎨 Unpredictable creative work with no structure", value: "no_chaos" },
        ],
    },
    {
        id: "q_impact",
        CareerForge: "Deep question: What kind of impact do you want to have in the world?",
        type: "choice",
        key: "impact",
        choices: [
            { label: "🚀 Build technology that changes industries", value: "tech_impact" },
            { label: "❤️ Save or improve people's lives directly", value: "health_impact" },
            { label: "⚖️ Make society more fair and just", value: "justice_impact" },
            { label: "🎭 Make people feel, think or see differently", value: "creative_impact" },
            { label: "💡 Discover new knowledge for humanity", value: "research_impact" },
            { label: "💰 Create wealth and jobs through enterprise", value: "business_impact" },
        ],
    },
    {
        id: "q_class",
        CareerForge: "Last one! What class are you in right now?",
        type: "choice",
        key: "class",
        choices: [
            { label: "Class 9", value: "9" },
            { label: "Class 10", value: "10" },
            { label: "Class 11", value: "11" },
            { label: "Class 12", value: "12" },
        ],
    },
    {
        id: "q_grad",
        CareerForge: "When do you expect to graduate your 12th Board Exams? (Approximate year)",
        type: "choice",
        key: "graduationYear",
        choices: [
            { label: "2024", value: 2024 },
            { label: "2025", value: 2025 },
            { label: "2026", value: 2026 },
            { label: "2027", value: 2027 },
            { label: "2028+", value: 2028 },
        ],
    },
];
