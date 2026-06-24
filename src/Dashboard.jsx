import { useState, useEffect, useRef, useCallback, useMemo, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error("UI crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#fff", background: "#0f172a" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Something went wrong</h2>
          <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 13 }}>
            {String(this.state.error?.message || this.state.error || "Unknown error")}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ════════════════════════════════════════════════════════════════
//  SECTION 0 ─ CONSTANTS & STATIC DATA  (unchanged from v1)
// ════════════════════════════════════════════════════════════════
const JOB_ROLES = [
  {
    id: "data-scientist", title: "Data Scientist", icon: "🧬", color: "#6366f1",
    skills: ["Python", "Machine Learning", "Statistics", "TensorFlow", "SQL", "Data Visualization", "R", "Deep Learning"],
    avgSalary: "₹115,000", salaryNum: 115000, growth: "36%", growthNum: 36,
    demand: "Very High", demandScore: 95, desc: "Build ML models and extract insights from complex datasets",
    marketTrend: [80, 85, 88, 90, 92, 94, 95, 97], hiringCompanies: ["Google", "Meta", "Amazon", "Netflix", "Uber"]
  },
  {
    id: "frontend-dev", title: "Frontend Developer", icon: "🎨", color: "#f59e0b",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Tailwind CSS", "GraphQL", "Testing"],
    avgSalary: "₹105,000", salaryNum: 105000, growth: "25%", growthNum: 25,
    demand: "High", demandScore: 82, desc: "Craft beautiful, responsive user interfaces",
    marketTrend: [70, 72, 75, 76, 78, 80, 82, 83], hiringCompanies: ["Shopify", "Airbnb", "Twitter", "Stripe", "Figma"]
  },
  {
    id: "backend-dev", title: "Backend Developer", icon: "⚙️", color: "#10b981",
    skills: ["Node.js", "Python", "Java", "SQL", "MongoDB", "REST APIs", "Docker", "AWS"],
    avgSalary: "₹110,000", salaryNum: 110000, growth: "28%", growthNum: 28,
    demand: "High", demandScore: 85, desc: "Build scalable server-side systems and APIs",
    marketTrend: [72, 74, 76, 78, 80, 83, 85, 86], hiringCompanies: ["Microsoft", "Salesforce", "Oracle", "IBM", "SAP"]
  },
  {
    id: "data-analyst", title: "Data Analyst", icon: "📊", color: "#3b82f6",
    skills: ["SQL", "Excel", "Python", "Tableau", "Statistics", "Data Visualization", "Power BI", "R"],
    avgSalary: "₹85,000", salaryNum: 85000, growth: "23%", growthNum: 23,
    demand: "High", demandScore: 80, desc: "Transform raw data into actionable business insights",
    marketTrend: [60, 65, 68, 70, 74, 77, 80, 81], hiringCompanies: ["McKinsey", "Deloitte", "Accenture", "PwC", "KPMG"]
  },
  {
    id: "devops", title: "DevOps Engineer", icon: "🔧", color: "#8b5cf6",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Python", "Monitoring"],
    avgSalary: "₹120,000", salaryNum: 120000, growth: "22%", growthNum: 22,
    demand: "Very High", demandScore: 91, desc: "Bridge development and operations through automation",
    marketTrend: [75, 78, 81, 84, 86, 88, 90, 91], hiringCompanies: ["HashiCorp", "Red Hat", "GitLab", "CircleCI", "Datadog"]
  },
  {
    id: "ml-engineer", title: "ML Engineer", icon: "🤖", color: "#ec4899",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "MLOps", "SQL", "Docker", "Statistics"],
    avgSalary: "₹130,000", salaryNum: 130000, growth: "40%", growthNum: 40,
    demand: "Critical", demandScore: 98, desc: "Deploy production-grade machine learning systems",
    marketTrend: [70, 75, 80, 85, 88, 92, 95, 98], hiringCompanies: ["OpenAI", "Anthropic", "DeepMind", "Cohere", "Mistral"]
  },
  {
    id: "product-manager", title: "Product Manager", icon: "🗺️", color: "#f97316",
    skills: ["Agile", "User Research", "Data Analysis", "SQL", "Communication", "Roadmapping", "A/B Testing", "Excel"],
    avgSalary: "₹125,000", salaryNum: 125000, growth: "19%", growthNum: 19,
    demand: "Medium", demandScore: 72, desc: "Define product vision and lead cross-functional teams",
    marketTrend: [60, 62, 65, 67, 68, 70, 71, 72], hiringCompanies: ["Apple", "Spotify", "Notion", "Linear", "Figma"]
  },
  {
    id: "cybersecurity", title: "Security Engineer", icon: "🔐", color: "#ef4444",
    skills: ["Network Security", "Python", "Linux", "Penetration Testing", "SIEM", "Cloud Security", "Cryptography", "Risk Analysis"],
    avgSalary: "₹118,000", salaryNum: 118000, growth: "35%", growthNum: 35,
    demand: "Very High", demandScore: 93, desc: "Protect systems and data from cyber threats",
    marketTrend: [78, 81, 83, 86, 88, 90, 92, 93], hiringCompanies: ["CrowdStrike", "Palo Alto", "SentinelOne", "Okta", "Cloudflare"]
  }
];

const ALL_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Java", "C++",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Statistics",
  "Data Visualization", "Tableau", "Power BI", "Excel", "R", "Scala",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "CI/CD", "Linux",
  "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST APIs", "Microservices",
  "CSS", "HTML", "Tailwind CSS", "Vue.js", "Angular", "Testing",
  "Agile", "Scrum", "User Research", "Communication", "Roadmapping", "A/B Testing",
  "Network Security", "Penetration Testing", "Cryptography", "Risk Analysis",
  "MLOps", "Monitoring", "Spark", "Hadoop", "SIEM", "Cloud Security"
];

const NON_TECHNICAL_SKILLS = [
  "Leadership", "Team Management", "Public Speaking", "Negotiation", "Time Management",
  "Critical Thinking", "Problem Solving", "Creativity", "Adaptability", "Emotional Intelligence",
  "Conflict Resolution", "Decision Making", "Strategic Planning", "Mentoring", "Networking",
  "Project Management", "Customer Service", "Presentation Skills", "Analytical Thinking", "Attention to Detail"
];

const GENERAL_LEARNING_SKILLS = [
  "Carpentry", "Electrical Basics", "Plumbing", "Welding", "Automotive Repair",
  "Tailoring", "Baking", "Cooking", "Hospitality Service", "Warehouse Operations",
  "Retail Operations", "Library Sciences", "Art", "Music", "Photography",
  "Graphic Design", "Community Health Support", "Handcraft", "Event Setup", "Driving"
];

const BLUE_COLLAR_ROLE_BANK = [
  {
    title: "Driver Partner (Rapido/Uber/Ola)",
    icon: "🛵",
    demand: "Very High",
    salaryRange: "₹20,000 - ₹45,000 / month",
    growth: "Fast growth in hyperlocal mobility",
    description: "Handle city rides safely, maintain punctuality, and maximize peak-hour earnings.",
    skillHints: ["Driving", "Navigation", "Customer Service", "Time Management", "Communication"]
  },
  {
    title: "Bakery Assistant (ABC Bakes / Local Bakery)",
    icon: "🍞",
    demand: "High",
    salaryRange: "₹15,000 - ₹30,000 / month",
    growth: "Steady demand in food retail",
    description: "Support dough prep, baking batches, quality checks, and counter service.",
    skillHints: ["Baking", "Food Safety", "Attention to Detail", "Teamwork", "Time Management"]
  },
  {
    title: "Warehouse Associate",
    icon: "📦",
    demand: "Very High",
    salaryRange: "₹16,000 - ₹32,000 / month",
    growth: "Driven by e-commerce logistics",
    description: "Manage picking, packing, inventory checks, and dispatch operations.",
    skillHints: ["Warehouse Operations", "Inventory Basics", "Physical Stamina", "Accuracy", "Teamwork"]
  },
  {
    title: "Carpentry Apprentice",
    icon: "🪚",
    demand: "High",
    salaryRange: "₹18,000 - ₹40,000 / month",
    growth: "Consistent local contracting demand",
    description: "Assist in measuring, cutting, fitting, and finishing woodwork projects.",
    skillHints: ["Carpentry", "Measurement", "Safety", "Problem Solving", "Attention to Detail"]
  },
  {
    title: "Electrician Helper",
    icon: "🔌",
    demand: "High",
    salaryRange: "₹17,000 - ₹35,000 / month",
    growth: "Strong demand in residential/commercial maintenance",
    description: "Support installation, wiring checks, and basic maintenance work.",
    skillHints: ["Electrical Basics", "Safety", "Troubleshooting", "Discipline", "Adaptability"]
  },
  {
    title: "Retail Store Associate",
    icon: "🏪",
    demand: "High",
    salaryRange: "₹14,000 - ₹28,000 / month",
    growth: "Stable openings across retail chains",
    description: "Handle customer support, billing, product display, and stock checks.",
    skillHints: ["Customer Service", "Communication", "Retail Operations", "Presentation Skills", "Patience"]
  }
];

// XAI weight factors used by the Explainable AI engine
const XAI_FACTORS = {
  skillMatch: { weight: 0.45, label: "Skill Match", icon: "⚡" },
  marketDemand: { weight: 0.20, label: "Market Demand", icon: "📈" },
  interestAlign: { weight: 0.20, label: "Interest Alignment", icon: "❤️" },
  salaryFit: { weight: 0.15, label: "Salary Potential", icon: "💰" }
};

const SAMPLE_INTERVIEWS = {
  "data-scientist": ["Walk me through how you handle a highly imbalanced classification dataset.", "Explain the bias-variance tradeoff and how you mitigate each.", "How would you validate a machine learning model before deploying to production?", "Describe a time you solved a business problem with data.", "What is regularization and when do you choose L1 vs L2?"],
  "frontend-dev": ["Explain the Virtual DOM and why React uses it.", "How do you approach performance optimization in a React app?", "What are closures in JavaScript and how do you use them?", "Describe your approach to responsive and accessible design.", "How would you handle state management in a large-scale React app?"],
  "backend-dev": ["What strategies do you use to design scalable REST APIs?", "Explain CAP theorem and how it affects database selection.", "How do you handle distributed transactions in microservices?", "What are the tradeoffs between SQL and NoSQL?", "How would you debug a performance bottleneck in production?"],
  "data-analyst": ["How do you approach exploratory data analysis on a new dataset?", "Explain correlation vs causation with an example.", "How do you present complex findings to non-technical stakeholders?", "Walk me through how you detect and handle outliers.", "What metrics would you track to measure e-commerce funnel performance?"],
  "devops": ["Explain the CI/CD pipeline you'd set up for microservices.", "How do you approach disaster recovery and high availability?", "What is Infrastructure as Code and what tools have you used?", "How do you monitor a distributed system in production?", "How do you handle secrets management in a containerized environment?"],
  "ml-engineer": ["How do you ensure reproducibility in ML experiments?", "Explain feature engineering with an example that improved performance.", "How would you deploy and monitor an ML model in production?", "Describe the MLOps lifecycle and tools you have used.", "How do you handle data drift in deployed models?"],
  "product-manager": ["How do you prioritize a product backlog with limited resources?", "How would you identify and validate a new product opportunity?", "How do you work with engineering on technical debt vs features?", "Walk me through launching a product internationally.", "How do you measure success of a feature post-launch?"],
  "cybersecurity": ["Walk me through a pen test on a web application.", "Explain authentication vs authorization with examples.", "How do you approach threat modeling for a new system?", "What is least privilege and how do you implement it?", "How would you respond to a confirmed data breach?"]
};

// ════════════════════════════════════════════════════════════════
//  SECTION 1 ─ BLOCKCHAIN / CREDENTIAL ENGINE  (NEW)
// ════════════════════════════════════════════════════════════════

/**
 * Lightweight in-browser credential ledger that simulates the behaviour of
 * an Ethereum/Polygon smart contract without requiring a real wallet.
 *
 * In production this module is replaced by:
 *   • Solidity smart contract  (CareerForgeCredential.sol)
 *   • ethers.js integration    (blockchainService.js)
 *
 * The hash algorithm replicates keccak256 inputs so migrating to the real
 * chain only requires swapping simulateMint() with a real tx call.
 */

// --- Simulated on-chain ledger (localStorage-backed) ---
const LEDGER_KEY = "cf_blockchain_ledger";

function getLedger() {
  try { return JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]"); }
  catch { return []; }
}
function saveLedger(l) { localStorage.setItem(LEDGER_KEY, JSON.stringify(l)); }

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function mintCredential({ userName, jobTitle, score, skills, timestamp }) {
  // Replicate the keccak256(abi.encodePacked(...)) input pattern
  const payload = `${userName}|${jobTitle}|${score}|${skills.join(",")}|${timestamp}`;
  const hash = await sha256(payload);
  const tokenId = Math.floor(Math.random() * 1_000_000);
  const record = {
    tokenId, hash, userName, jobTitle, score,
    skills, timestamp, txHash: "0x" + hash.slice(0, 40),
    blockNumber: 19_000_000 + tokenId % 100_000,
    network: "Polygon Mumbai (simulated)"
  };
  const ledger = getLedger();
  ledger.push(record);
  saveLedger(ledger);
  return record;
}

async function verifyCredential(hash) {
  const ledger = getLedger();
  return ledger.find(r => r.hash === hash || r.txHash === hash) || null;
}

// ════════════════════════════════════════════════════════════════
//  SECTION 2 ─ XAI ENGINE  (NEW)
// ════════════════════════════════════════════════════════════════

function computeXAI(userSkills, userInterests, job) {
  const skillMatchRaw = (() => {
    if (!userSkills.length) return 0;
    const matched = job.skills.filter(s =>
      userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
    return matched.length / job.skills.length;
  })();

  const interestRaw = (() => {
    if (!userInterests) return 0.3;
    // `userInterests` should be a string from the DB, but coerce safely because
    // older/incorrect call-sites may pass arrays.
    const interestStr = Array.isArray(userInterests)
      ? userInterests.join(" ")
      : String(userInterests);
    const words = interestStr.toLowerCase().split(/\W+/);
    const jobWords = (job.title + " " + job.desc).toLowerCase().split(/\W+/);
    const overlap = words.filter(w => w.length > 3 && jobWords.includes(w)).length;
    return Math.min(1, 0.2 + overlap * 0.15);
  })();

  const marketRaw = job.demandScore / 100;
  const salaryRaw = Math.min(1, job.salaryNum / 140_000);

  const scores = {
    skillMatch: Math.round(skillMatchRaw * 100),
    interestAlign: Math.round(interestRaw * 100),
    marketDemand: Math.round(marketRaw * 100),
    salaryFit: Math.round(salaryRaw * 100)
  };

  const composite = Math.round(
    scores.skillMatch * XAI_FACTORS.skillMatch.weight +
    scores.marketDemand * XAI_FACTORS.marketDemand.weight +
    scores.interestAlign * XAI_FACTORS.interestAlign.weight +
    scores.salaryFit * XAI_FACTORS.salaryFit.weight
  );

  const matchedSkills = job.skills.filter(s =>
    userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));

  return { scores, composite, matchedSkills };
}

// ════════════════════════════════════════════════════════════════
//  SECTION 3 ─ ANALYTICS ENGINE  (NEW)
// ════════════════════════════════════════════════════════════════

// Simulates what Metabase would query from MongoDB aggregation pipelines.
// In production: replace with GET /api/analytics/* endpoints that Metabase
// or your own backend serves after querying the DB.
function buildAnalytics(profile, completedTasks, interviewScores, allUsers) {
  const skills = profile.skills || [];
  const totalUsers = allUsers.length + 1;
  const avgScore = interviewScores.length
    ? Math.round(interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length) : 0;

  // Skill frequency across simulated user cohort
  const skillFreq = ALL_SKILLS.map(s => ({
    skill: s,
    count: skills.includes(s) ? 12 + Math.floor(Math.random() * 8) : 2 + Math.floor(Math.random() * 6)
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  // Career demand vs match
  const careerStats = JOB_ROLES.map(j => ({
    title: j.title, icon: j.icon, color: j.color,
    match: skills.length ? Math.round((j.skills.filter(s => skills.map(u => u.toLowerCase()).includes(s.toLowerCase())).length / j.skills.length) * 100) : 0,
    demand: j.demandScore, salary: j.salaryNum
  })).sort((a, b) => b.match - a.match);

  const taskTotal = Object.keys(completedTasks).length;
  const taskDone = Object.values(completedTasks).filter(Boolean).length;

  return {
    skillFreq, careerStats, totalUsers, avgScore, taskTotal, taskDone,
    profileScore: Math.round(([!!skills.length, !!profile.education, !!profile.interests, !!profile.projects].filter(Boolean).length / 4) * 100)
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "career";
}

function mapToDagGoal(skills = [], title = "") {
  const lowered = String(title || "").toLowerCase();
  if (lowered.includes("carpenter") || lowered.includes("technician") || lowered.includes("operator")) return "backend-dev";
  if (lowered.includes("artist") || lowered.includes("designer") || lowered.includes("creator")) return "frontend-dev";
  if (lowered.includes("health") || lowered.includes("security")) return "cybersecurity";

  const normalized = (skills || []).map((s) => String(s).toLowerCase());
  const ranked = JOB_ROLES
    .map((role) => ({
      id: role.id,
      overlap: role.skills.filter((s) => normalized.includes(String(s).toLowerCase())).length
    }))
    .sort((a, b) => b.overlap - a.overlap);

  return ranked[0]?.id || "frontend-dev";
}

function dynamicLocalRecommendations(profile, freshMode) {
  const techSkills = profile.skills || [];
  const nonTech = profile.nonTechnicalSkills || [];
  const learning = profile.learningSkills || [];
  const interestText = `${profile.interests || ""} ${learning.join(" ")}`.toLowerCase();
  const blueFocus = profile.jobTypePreference === "blue-collar";
  const rolePool = blueFocus ? BLUE_COLLAR_ROLE_BANK : JOB_ROLES;

  const scored = rolePool.map((role, idx) => {
    const roleSkills = role.skillHints || role.skills || [];
    const skillSource = blueFocus ? [...nonTech, ...learning] : [...techSkills, ...nonTech, ...learning];
    const overlap = roleSkills.filter((s) =>
      skillSource.map((k) => String(k).toLowerCase()).includes(String(s).toLowerCase())
    ).length;
    const interestBoost = roleSkills.some((s) => interestText.includes(String(s).toLowerCase())) ? 12 : 0;
    const demandBoost = role.demand === "Critical" ? 20 : role.demand === "Very High" ? 16 : role.demand === "High" ? 10 : 6;
    const fitScore = Math.min(96, 40 + overlap * 12 + interestBoost + (freshMode ? demandBoost : 0));
    const dagGoalId = mapToDagGoal(roleSkills, role.title);

    return {
      id: `local-${slugify(role.title)}-${idx}`,
      dagGoalId,
      title: role.title,
      icon: role.icon || "💼",
      color: JOB_ROLES.find((j) => j.id === dagGoalId)?.color || "#6366f1",
      skills: roleSkills.slice(0, 8),
      demand: role.demand || "High",
      demandScore: fitScore,
      desc: role.description || "Role suggested from your profile inputs.",
      avgSalary: role.salaryRange || role.avgSalary || "Not specified",
      salaryNum: 70000,
      growth: role.growth || "Growing",
      growthNum: 20,
      marketTrend: [55, 60, 64, 68, 72, 75, 78, 82],
      hiringCompanies: []
    };
  });

  return scored.sort((a, b) => b.demandScore - a.demandScore).slice(0, 6);
}

// ════════════════════════════════════════════════════════════════
//  SECTION 4 ─ API / CLAUDE HELPERS
// ════════════════════════════════════════════════════════════════

async function callClaude(messages, systemPrompt = "", maxTokens = 1000) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY || (typeof localStorage !== 'undefined' ? localStorage.getItem("VITE_CLAUDE_API_KEY") : "");
  
  if (!apiKey) {
    console.warn("AI API Key missing. Using optimized mock behavior.");
    if (systemPrompt.includes("parser")) return "[]";
    if (systemPrompt.includes("interviewer")) {
      return JSON.stringify({
        score: 85,
        confidence: "high",
        feedback: "Excellent response! You've touched on key concepts. In a real interview, try to provide a specific example from your past work.",
        keywords_present: ["React", "State", "Logic"],
        keywords_missing: [],
        improved_answer: "Consider mentioning performance implications of your choice."
      });
    }
    return "Dynamic and results-oriented professional with a strong foundation in modern technology and problem-solving. Proven ability to adapt to new challenges and deliver high-quality outcomes in fast-paced environments. (Connect your Anthropic API Key in .env for live analysis)";
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "dangerously-allow-browser": "true"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "AI service error");
    return data.content?.[0]?.text || "";
  } catch (err) {
    console.error("AI Service Failure:", err);
    throw err;
  }
}

// ════════════════════════════════════════════════════════════════
//  SECTION 5 ─ SHARED UI PRIMITIVES
// ════════════════════════════════════════════════════════════════

function ProgressBar({ value, max = 100, color = "#6366f1", height = 8 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "#1e293b", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function Badge({ children, color = "#6366f1", size = "sm" }) {
  return (
    <span style={{
      display: "inline-block", padding: size === "sm" ? "3px 10px" : "5px 14px",
      borderRadius: 99, fontSize: size === "sm" ? 11 : 13, fontWeight: 600,
      background: color + "22", color, border: `1px solid ${color}44`
    }}>{children}</span>
  );
}

function Card({ children, style = {}, glow = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#0f172a",
      border: glow ? "1px solid #6366f133" : "1px solid #1e293b",
      borderRadius: 16, padding: "1.5rem",
      boxShadow: glow ? "0 0 30px #6366f122" : "none",
      cursor: onClick ? "pointer" : "default",
      transition: "border-color .2s", ...style
    }}>{children}</div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#6366f1",
          animation: `cfBounce .9s ${i * .15}s infinite`
        }} />
      ))}
    </span>
  );
}

function MiniSparkline({ data = [], color = "#6366f1", width = 120, height = 36 }) {
  if (!data.length) return null;
  const mn = Math.min(...data), mx = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - mn) / (mx - mn || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]}
        r="3" fill={color} />
    </svg>
  );
}

// Horizontal bar for analytics
function HBar({ value, max, color, label, sub }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{sub}</span>
      </div>
      <ProgressBar value={value} max={max} color={color} height={6} />
    </div>
  );
}

// Donut chart (pure SVG, no lib)
function DonutChart({ value, max = 100, color = "#6366f1", size = 80, label }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (value / max) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s" }} />
      </svg>
      <div style={{ marginTop: -size / 2 - 4, fontSize: 16, fontWeight: 700, color }}>{value}%</div>
      {label && <div style={{ fontSize: 10, color: "#64748b", marginTop: size / 2 + 2 }}>{label}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 6 ─ AUTH PAGE  (enhanced with role-based access)
// ════════════════════════════════════════════════════════════════

function AuthPage({ onAuth }) {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialMode = params.get("mode");
  const initialRole = params.get("role");

  const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [qualification, setQualification] = useState("");
  const [hasDegree, setHasDegree] = useState("not-sure");
  const [workTypePreference, setWorkTypePreference] = useState("both");
  const [jobTypePreference, setJobTypePreference] = useState("white-collar");
  const [role, setRole] = useState(() => {
    // Used mainly for "signup"; login keeps the role from the backend user record.
    const allowed = ["user", "mentor", "admin"];
    return allowed.includes(initialRole) ? initialRole : "user";
  });   // NEW: role-based access
  const [err, setErr] = useState("");

  const handle = async () => {
    if (!email || password.length < 3) { setErr("Please fill all fields"); return; }
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email, password }
        : {
            name: name || email.split("@")[0],
            email,
            password,
            role,
            age: age ? Number(age) : null,
            qualification,
            hasDegree: hasDegree === "yes" ? true : hasDegree === "no" ? false : null,
            workTypePreference,
            jobTypePreference
          };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Authentication failed");
        return;
      }

      const user = data.user;
      user.token = data.token;
      user.xp = 0;
      user.badges = [];

      localStorage.setItem("cf_user", JSON.stringify(user));

      // Career Mentor choice on login (or mentor role user) goes to the Nova app.
      const mentorLoginSelected = initialRole === "mentor";
      if (user?.role === "mentor" || mentorLoginSelected) {
        const ports = [5179, 5180, 5181, 5182, 5183];
        let reachablePort = null;
        for (const port of ports) {
          const ctrl = new AbortController();
          const timeout = setTimeout(() => ctrl.abort(), 800);
          try {
            await fetch(`http://localhost:${port}/`, { method: "GET", mode: "no-cors", signal: ctrl.signal });
            reachablePort = port;
            break;
          } catch {
            // try next port
          } finally {
            clearTimeout(timeout);
          }
        }
        if (!reachablePort) {
          alert(
            "Nova (Career Mentor) app is not responding.\n\n" +
              "Start it first, then login again.\n" +
              "Tip: run `npm run nova` from the project root."
          );
          return;
        }
        window.location.assign(`http://localhost:${reachablePort}/`);
        return;
      }

      onAuth(user);
    } catch {
      setErr("Failed to connect to backend server");
    }
  };

  // Quick demo logins
  const demos = [
    { label: "User Demo", email: "user@demo.com", role: "user" },
    { label: "Admin Demo", email: "admin@demo.com", role: "admin" }
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#020617", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "2rem"
    }}>
      <style>{globalCSS}</style>

      {/* Animated BG */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}>
        {["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"].map((c, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 300 + i * 80, height: 300 + i * 80, borderRadius: "50%",
            background: `radial-gradient(circle, ${c}11 0%, transparent 70%)`,
            left: `${[10, 60, 20, 70, 40, 80][i]}%`, top: `${[20, 50, 70, 10, 80, 40][i]}%`,
            transform: "translate(-50%,-50%)", animation: `cfPulse ${3 + i}s ${i * .5}s ease-in-out infinite`
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, animation: "cfFadeUp .6s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 48 }}>🚀</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0.5rem 0 0" }}>CareerForge AI</h1>
          <p style={{ color: "#64748b", margin: "0.5rem 0 0" }}>v2.0 — Hackathon Edition</p>
        </div>

        <Card glow>
          {/* Tab */}
          <div style={{ display: "flex", background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: "1.5rem", gap: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 13, transition: "all .2s",
                background: mode === m ? "#6366f1" : "transparent",
                color: mode === m ? "#fff" : "#64748b"
              }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
            ))}
          </div>

          {mode === "signup" && (
            <>
              <Field label="Full Name" value={name} set={setName} placeholder="Alex Johnson" />
              <Field label="Age" value={age} set={setAge} placeholder="22" type="number" />
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>EDUCATIONAL QUALIFICATION</label>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="10th / 12th / Diploma / B.A. / B.Tech / M.A. ..."
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                    background: "#1e293b", border: "1px solid #334155", color: "#fff"
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>DO YOU HAVE A DEGREE?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ id: "yes", label: "Yes" }, { id: "no", label: "No" }, { id: "not-sure", label: "Prefer not to say" }].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setHasDegree(opt.id)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${hasDegree === opt.id ? "#6366f1" : "#334155"}`,
                        background: hasDegree === opt.id ? "#6366f122" : "transparent",
                        color: hasDegree === opt.id ? "#6366f1" : "#64748b", fontSize: 12, fontWeight: 600
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>JOB TYPE INTEREST</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ id: "blue-collar", label: "Blue-collar" }, { id: "white-collar", label: "White-collar" }, { id: "both", label: "Both" }].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setJobTypePreference(opt.id)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${jobTypePreference === opt.id ? "#10b981" : "#334155"}`,
                        background: jobTypePreference === opt.id ? "#10b98122" : "transparent",
                        color: jobTypePreference === opt.id ? "#10b981" : "#64748b", fontSize: 12, fontWeight: 600
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>WORK SETTING PREFERENCE</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ id: "onsite", label: "On-site" }, { id: "remote", label: "Remote" }, { id: "both", label: "Both" }].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setWorkTypePreference(opt.id)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${workTypePreference === opt.id ? "#f59e0b" : "#334155"}`,
                        background: workTypePreference === opt.id ? "#f59e0b22" : "transparent",
                        color: workTypePreference === opt.id ? "#f59e0b" : "#64748b", fontSize: 12, fontWeight: 600
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <Field label="Email" value={email} set={setEmail} placeholder="you@example.com" type="email" />
          <Field label="Password" value={password} set={setPassword} placeholder="••••••••" type="password" />

          {/* Role selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>ACCOUNT ROLE</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: "user", label: "User" }, { v: "mentor", label: "Career Mentor 🎓" }, { v: "admin", label: "Admin 🔑" }].map(r => (
                <button key={r.v} onClick={() => setRole(r.v)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${role === r.v ? "#6366f1" : "#334155"}`,
                  background: role === r.v ? "#6366f122" : "transparent",
                  color: role === r.v ? "#6366f1" : "#64748b", fontSize: 13, fontWeight: 600
                }}>{r.label}</button>
              ))}
            </div>
          </div>

          {err && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{err}</p>}

          <button onClick={handle} style={primaryBtn}>{mode === "login" ? "Sign In →" : "Create Account →"}</button>

          <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
            {demos.map(d => (
              <button key={d.role} onClick={() => { setEmail(d.email); setRole(d.role); setPassword("demo123"); }}
                style={{
                  flex: 1, padding: "6px", borderRadius: 8, border: "1px solid #334155",
                  background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 11
                }}>{d.label}</button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 7 ─ ANALYTICS DASHBOARD  (NEW – Metabase-equivalent)
// ════════════════════════════════════════════════════════════════

function AnalyticsPage({ profile, completedTasks, interviewScores }) {
  const [tab, setTab] = useState("overview");
  const data = useMemo(() => buildAnalytics(profile, completedTasks, interviewScores, []), [profile, completedTasks, interviewScores]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills" },
    { id: "careers", label: "Careers" },
    { id: "progress", label: "Progress" }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Analytics Dashboard</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
            Real-time insights — powered by aggregation pipelines (Metabase-compatible)
          </p>
        </div>
        <Badge color="#3b82f6" size="md">Live Data</Badge>
      </div>

      {/* Metabase setup callout */}
      <Card style={{ marginBottom: "1.5rem", borderColor: "#3b82f633", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>📡</span>
          <div>
            <p style={{ color: "#93c5fd", fontWeight: 600, fontSize: 13, margin: "0 0 2px" }}>Metabase Integration Active</p>
            <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
              In production: Metabase connects directly to MongoDB via the JSON API driver.
              Dashboards at <code style={{ color: "#7dd3fc" }}>localhost:3001</code> embed via iframe using signed embedding tokens.
              Run: <code style={{ color: "#7dd3fc" }}>docker run -p 3001:3000 metabase/metabase</code>
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t.id ? "#6366f1" : "#1e293b",
            color: tab === t.id ? "#fff" : "#64748b"
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: "1.5rem" }}>
            {[
              { label: "Profile Score", value: `${data.profileScore}%`, icon: "📊", color: "#10b981" },
              { label: "Skills Known", value: data.skillFreq.filter(s => (profile.skills || []).includes(s.skill)).length, icon: "⚡", color: "#6366f1" },
              { label: "Tasks Done", value: `${data.taskDone}/${data.taskTotal || "—"}`, icon: "✅", color: "#f59e0b" },
              { label: "Interview Avg", value: data.avgScore ? `${data.avgScore}/100` : "—", icon: "🎤", color: "#ec4899" }
            ].map(s => (
              <Card key={s.label} style={{ textAlign: "center", padding: "1rem" }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "monospace", marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Market trend sparklines */}
          <Card style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>📈 Job Market Demand Trends (8-month)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
              {JOB_ROLES.map(j => (
                <div key={j.id} style={{ padding: 12, background: "#1e293b", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{j.icon} {j.title}</span>
                    <Badge color={j.color}>{j.demand}</Badge>
                  </div>
                  <MiniSparkline data={j.marketTrend} color={j.color} width={160} height={32} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#64748b" }}>
                    <span>{j.avgSalary}/yr</span>
                    <span style={{ color: "#10b981" }}>+{j.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "skills" && (
        <Card>
          <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>🔥 Most In-Demand Skills (Cohort Analysis)</h3>
          {data.skillFreq.map((s) => (
            <HBar key={s.skill} label={s.skill}
              value={s.count} max={20}
              color={(profile.skills || []).includes(s.skill) ? "#10b981" : "#6366f1"}
              sub={(profile.skills || []).includes(s.skill) ? "✓ You have this" : `${s.count} users`} />
          ))}
          <div style={{ marginTop: "1rem", display: "flex", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10b981" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981", display: "inline-block" }} /> You have this skill
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6366f1" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#6366f1", display: "inline-block" }} /> Not yet in your profile
            </span>
          </div>
        </Card>
      )}

      {tab === "careers" && (
        <div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {data.careerStats.map(c => (
              <Card key={c.title} style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{c.title}</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <Badge color={c.color}>Match: {c.match}%</Badge>
                    <Badge color="#3b82f6">Demand: {c.demand}</Badge>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Your match</div>
                    <ProgressBar value={c.match} color={c.color} height={6} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Market demand</div>
                    <ProgressBar value={c.demand} color="#3b82f6" height={6} />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
                  💰 ₹${c.salary.toLocaleString()}/yr average
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "progress" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Card>
            <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1.5rem" }}>Readiness Gauges</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <DonutChart value={data.profileScore} color="#6366f1" label="Profile" />
              <DonutChart value={data.taskTotal ? Math.round((data.taskDone / data.taskTotal) * 100) : 0} color="#10b981" label="Tasks" />
              <DonutChart value={data.avgScore || 0} color="#f59e0b" label="Interview" />
              <DonutChart value={(profile.skills || []).length * 5 > 100 ? 100 : (profile.skills || []).length * 5} color="#ec4899" label="Skills" />
            </div>
          </Card>
          <Card>
            <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>Interview Performance</h3>
            {interviewScores.length === 0 ? (
              <p style={{ color: "#475569", fontSize: 13 }}>No interviews taken yet. Go to the Interview tab to practice!</p>
            ) : (
              <div>
                {interviewScores.map((s, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: "#94a3b8" }}>Session {i + 1}</span>
                      <span style={{ color: s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{s}/100</span>
                    </div>
                    <ProgressBar value={s} color={s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444"} height={6} />
                  </div>
                ))}
                <div style={{ marginTop: "1rem", padding: "10px", background: "#1e293b", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>{data.avgScore}/100</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>Average Score</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 8 ─ BLOCKCHAIN CREDENTIALS PAGE  (NEW)
// ════════════════════════════════════════════════════════════════

function BlockchainPage({ user, profile }) {
  const [creds, setCreds] = useState([]);
  const [minting, setMinting] = useState(false);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [tab, setTab] = useState("mine");

  useEffect(() => { setCreds(getLedger().filter(c => c.userName === user.name)); }, [user]);

  const mint = async (job) => {
    setMinting(true);
    const score = profile.skills?.length
      ? Math.round((job.skills.filter(s => (profile.skills || []).map(u => u.toLowerCase()).includes(s.toLowerCase())).length / job.skills.length) * 100)
      : 0;
    const record = await mintCredential({
      userName: user.name, jobTitle: job.title, score,
      skills: (profile.skills || []).slice(0, 6),
      timestamp: new Date().toISOString()
    });
    setCreds(prev => [...prev, record]);
    setMinting(false);
  };

  const verify = async () => {
    const r = await verifyCredential(verifyHash.trim());
    setVerifyResult(r ? { found: true, ...r } : { found: false });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Blockchain Credentials</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Tamper-proof achievement certificates on Polygon</p>
        </div>
        <Badge color="#8b5cf6" size="md">ERC-721 NFT</Badge>
      </div>

      {/* How it works */}
      <Card style={{ marginBottom: "1.5rem", borderColor: "#8b5cf633" }}>
        <h3 style={{ color: "#c4b5fd", fontWeight: 600, fontSize: 14, marginBottom: "0.75rem" }}>
          🔗 How Credential Verification Works
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
          {[
            { step: "1", title: "Skill Verified", desc: "Your skills + score are hashed using SHA-256 / keccak256" },
            { step: "2", title: "On-Chain Storage", desc: "Hash stored in CareerForgeCredential.sol smart contract (Polygon)" },
            { step: "3", title: "Certificate Issued", desc: "ERC-721 NFT token minted to your wallet address" },
            { step: "4", title: "Instant Verification", desc: "Anyone can verify authenticity using the transaction hash" }
          ].map(s => (
            <div key={s.step} style={{ padding: 12, background: "#1e293b", borderRadius: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, background: "#8b5cf622",
                color: "#8b5cf6", fontWeight: 700, fontSize: 12, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 6
              }}>{s.step}</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 12, marginBottom: 3 }}>{s.title}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        {/* Solidity snippet */}
        <details style={{ marginTop: "1rem" }}>
          <summary style={{ color: "#7dd3fc", fontSize: 12, cursor: "pointer", userSelect: "none" }}>
            View Smart Contract (CareerForgeCredential.sol)
          </summary>
          <pre style={{
            marginTop: "0.75rem", background: "#020617", padding: "1rem",
            borderRadius: 8, fontSize: 11, color: "#a5f3fc", overflowX: "auto"
          }}>{
              `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CareerForgeCredential is ERC721, Ownable {
    uint256 private _tokenIds;

    struct Credential {
        string  userName;
        string  jobTitle;
        uint8   score;      // 0-100
        bytes32 dataHash;   // keccak256(userName|jobTitle|score|skills|ts)
        uint256 issuedAt;
    }

    mapping(uint256 => Credential) public credentials;
    mapping(bytes32 => uint256)    public hashToToken;

    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        bytes32 dataHash
    );

    constructor() ERC721("CareerForgeCredential","CFC") Ownable(msg.sender) {}

    function mintCredential(
        address  to,
        string   memory userName,
        string   memory jobTitle,
        uint8    score,
        bytes32  dataHash
    ) external onlyOwner returns (uint256) {
        require(hashToToken[dataHash] == 0, "Credential already exists");
        _tokenIds++;
        uint256 newId = _tokenIds;
        _safeMint(to, newId);
        credentials[newId] = Credential(userName,jobTitle,score,dataHash,block.timestamp);
        hashToToken[dataHash] = newId;
        emit CredentialMinted(newId, to, dataHash);
        return newId;
    }

    function verify(bytes32 dataHash) external view returns (bool, uint256) {
        uint256 tokenId = hashToToken[dataHash];
        return (tokenId != 0, tokenId);
    }
}`}</pre>
        </details>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
        {[{ id: "mine", label: "My Credentials" }, { id: "mint", label: "Mint New" }, { id: "verify", label: "Verify" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t.id ? "#8b5cf6" : "#1e293b",
            color: tab === t.id ? "#fff" : "#64748b"
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "mine" && (
        <div>
          {creds.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>🏆</div>
              <p style={{ color: "#64748b" }}>No credentials yet. Mint your first certificate from the "Mint New" tab.</p>
            </Card>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {creds.map(c => (
                <Card key={c.tokenId} style={{ borderColor: "#8b5cf633" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>🏅</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{c.jobTitle}</span>
                        <Badge color="#10b981">Score: {c.score}%</Badge>
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>Issued to {c.userName} · {new Date(c.timestamp).toLocaleDateString()}</div>
                    </div>
                    <Badge color="#8b5cf6">Token #{c.tokenId}</Badge>
                  </div>

                  <div style={{
                    marginTop: "1rem", padding: "10px 12px", background: "#020617",
                    borderRadius: 8, fontFamily: "monospace", fontSize: 11
                  }}>
                    <div style={{ color: "#64748b", marginBottom: 2 }}>TX Hash</div>
                    <div style={{ color: "#7dd3fc", wordBreak: "break-all" }}>{c.txHash}</div>
                    <div style={{ color: "#64748b", marginTop: 6, marginBottom: 2 }}>Cert Hash (SHA-256)</div>
                    <div style={{ color: "#a5f3fc", wordBreak: "break-all" }}>{c.hash}</div>
                    <div style={{ color: "#64748b", marginTop: 6, marginBottom: 2 }}>Network · Block</div>
                    <div style={{ color: "#94a3b8" }}>{c.network} · #{c.blockNumber.toLocaleString()}</div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "0.75rem" }}>
                    {(c.skills || []).map(s => <Badge key={s} color="#6366f1">{s}</Badge>)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "mint" && (
        <div>
          <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: 14 }}>
            Select a role to mint a verified credential based on your current skill match score.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            {JOB_ROLES.map(job => {
              const score = profile.skills?.length
                ? Math.round((job.skills.filter(s => (profile.skills || []).map(u => u.toLowerCase()).includes(s.toLowerCase())).length / job.skills.length) * 100)
                : 0;
              const alreadyMinted = creds.some(c => c.jobTitle === job.title);
              return (
                <div key={job.id} style={{
                  padding: "1.25rem", borderRadius: 12,
                  border: `1px solid ${job.color}33`, background: "#0f172a"
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{job.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{job.title}</div>
                  <div style={{ color: job.color, fontSize: 20, fontWeight: 700, margin: "6px 0" }}>{score}%</div>
                  <ProgressBar value={score} color={job.color} height={4} />
                  <button onClick={() => mint(job)} disabled={minting || alreadyMinted || score < 30} style={{
                    marginTop: 12, width: "100%", padding: "7px",
                    borderRadius: 8, border: "none", cursor: alreadyMinted || score < 30 ? "not-allowed" : "pointer",
                    background: alreadyMinted ? "#1e293b" : score < 30 ? "#1e293b" : "#8b5cf6",
                    color: alreadyMinted || score < 30 ? "#475569" : "#fff",
                    fontWeight: 600, fontSize: 12
                  }}>
                    {minting ? "Minting…" : alreadyMinted ? "✓ Minted" : score < 30 ? "Need ≥30%" : "Mint Certificate"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "verify" && (
        <Card>
          <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>🔍 Verify a Credential</h3>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>
            Paste a certificate hash or transaction hash to verify its authenticity on-chain.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
            <input value={verifyHash} onChange={e => setVerifyHash(e.target.value)}
              placeholder="0x… or certificate hash"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                background: "#1e293b", border: "1px solid #334155", color: "#fff", fontSize: 13
              }} />
            <button onClick={verify} style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              cursor: "pointer", background: "#8b5cf6", color: "#fff", fontWeight: 700
            }}>Verify</button>
          </div>
          {verifyResult && (
            <div style={{
              padding: "1rem", borderRadius: 10,
              background: verifyResult.found ? "#10b98111" : "#ef444411",
              border: `1px solid ${verifyResult.found ? "#10b98133" : "#ef444433"}`
            }}>
              {verifyResult.found ? (
                <div>
                  <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 4 }}>✅ Credential Verified On-Chain</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    <b style={{ color: "#fff" }}>{verifyResult.userName}</b> — {verifyResult.jobTitle} — Score: {verifyResult.score}%
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    Block #{verifyResult.blockNumber?.toLocaleString()} · {verifyResult.network}
                  </div>
                </div>
              ) : (
                <div style={{ color: "#ef4444", fontWeight: 700 }}>❌ No credential found for this hash</div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 9 ─ AI CAREER CHATBOT  (NEW)
// ════════════════════════════════════════════════════════════════

function ChatbotPage({ profile }) {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: `Hi! I'm your AI career coach 🤖\n\nI know your profile — you have ${(profile.skills || []).length} skills including ${(profile.skills || []).slice(0, 3).join(", ") || "none added yet"}.\n\nAsk me anything: career advice, which skills to learn next, salary negotiation, interview prep, or how to pivot careers!`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "What career fits me best?",
    "What should I learn next?",
    "How do I negotiate salary?",
    "Help me prepare for interviews",
    "How to transition to ML?"
  ]);
  const ref = useRef(null);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const history = msgs.slice(-8).map(m => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content: msg });

    try {
      const reply = await callClaude(history,
        `You are an expert AI career coach integrated into CareerForge AI.
User profile:
- Skills: ${(profile.skills || []).join(", ") || "Not specified"}
- Education: ${profile.education || "Not specified"}
- Interests: ${profile.interests || "Not specified"}
- Projects: ${profile.projects || "Not specified"}

Give specific, actionable advice tailored to their profile. Be conversational, warm, and concise (2-4 paragraphs max).
When recommending skills or careers, reference their existing skills. Use bullet points sparingly.`, 600);
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Sorry, I hit an error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>AI Career Coach</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>Context-aware advice powered by Claude + your profile</p>
        </div>
        <Badge color="#10b981">Profile-Aware</Badge>
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading} style={{
            padding: "5px 12px", borderRadius: 99, border: "1px solid #334155",
            background: "#1e293b", color: "#94a3b8", cursor: "pointer", fontSize: 12
          }}>💡 {s}</button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Chat window */}
        <div ref={ref} style={{ height: 440, overflowY: "auto", padding: "1.25rem" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "1rem" }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: "#6366f133",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0, marginRight: 8
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%", padding: "10px 14px", fontSize: 13, lineHeight: 1.7,
                background: m.role === "user" ? "#6366f1" : "#1e293b",
                color: m.role === "user" ? "#fff" : "#c8d6ef",
                borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "#6366f133",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
              }}>🤖</div>
              <div style={{ background: "#1e293b", padding: "10px 16px", borderRadius: "12px 12px 12px 4px" }}>
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ borderTop: "1px solid #1e293b", padding: "1rem", display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Ask anything about your career…"
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #334155",
              background: "#1e293b", color: "#fff", fontSize: 13
            }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            background: loading || !input.trim() ? "#334155" : "#6366f1",
            color: "#fff", fontWeight: 700
          }}>→</button>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 10 ─ XAI RECOMMENDATIONS PAGE  (enhanced v1 + XAI)
// ════════════════════════════════════════════════════════════════

function RecommendationsPage({ profile, onSelectJob, currentCareerId, allowFreshSuggestions = false }) {
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [freshMode, setFreshMode] = useState(allowFreshSuggestions);
  const [recommendations, setRecommendations] = useState([]);

  const fallbackRecommendations = useMemo(() => {
    const baseRecommendations = JOB_ROLES.map(job => {
      const xai = computeXAI(profile.skills || [], profile.interests || "", job);
      return { ...job, xai };
    });
    
    if (freshMode) {
      // For fresh suggestions, prioritize market demand over skill match
      return [...baseRecommendations].sort((a, b) => {
        // Prioritize Critical/Very High demand jobs
        const demandPriority = { "Critical": 4, "Very High": 3, "High": 2, "Medium": 1 };
        const aDemand = demandPriority[a.demand] || 0;
        const bDemand = demandPriority[b.demand] || 0;
        
        if (aDemand !== bDemand) {
          return bDemand - aDemand;
        }
        
        // If same demand level, consider market demand factor more heavily
        const aScore = a.xai.marketDemand * 0.6 + a.xai.composite * 0.4;
        const bScore = b.xai.marketDemand * 0.6 + b.xai.composite * 0.4;
        
        return bScore - aScore;
      });
    }
    
    return [...baseRecommendations].sort((a, b) => b.xai.composite - a.xai.composite);
  }, [profile, freshMode]);

  useEffect(() => {
    let cancelled = false;
    async function loadRecommendations() {
      setLoading(true);
      const hasApiKey = Boolean(
        import.meta.env.VITE_CLAUDE_API_KEY ||
        (typeof localStorage !== "undefined" ? localStorage.getItem("VITE_CLAUDE_API_KEY") : "")
      );
      try {
        if (!hasApiKey) throw new Error("No API key");
        const raw = await callClaude(
          [{
            role: "user", content: `Create 6 job recommendations as JSON array only for this user.
Profile:
- Age: ${profile.age || "not specified"}
- Qualification: ${profile.qualification || "not specified"}
- Has degree: ${String(profile.hasDegree)}
- Job type preference: ${profile.jobTypePreference || "not specified"}
- Work setting preference: ${profile.workTypePreference || "not specified"}
- Technical skills: ${(profile.skills || []).join(", ") || "none"}
- Non-technical skills: ${(profile.nonTechnicalSkills || []).join(", ") || "none"}
- Skills they want to learn: ${(profile.learningSkills || []).join(", ") || "none"}
Interests: ${profile.interests || "not specified"}.
Return each item with:
{"title":"...","description":"...","skills":["..."],"demand":"Critical|Very High|High|Medium","salaryRange":"₹...","fitScore":0-100,"growth":"...","icon":"emoji"}
Ensure at least 2 recommendations are non-tech if user is blue-collar/both.` }],
          "Career advisor. Return only strict JSON array.", 1200
        );
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No recommendations");
        const formatted = parsed.slice(0, 6).map((item, idx) => {
          const skills = Array.isArray(item.skills) && item.skills.length ? item.skills.map((s) => String(s)) : ["Communication", "Problem Solving"];
          const mappedGoalId = mapToDagGoal(skills, item.title);
          return {
            id: `ai-${slugify(item.title)}-${idx}`,
            dagGoalId: mappedGoalId,
            title: String(item.title || "Suggested Career"),
            icon: item.icon || ["🛠️", "🎨", "📦", "🧰", "📚", "🌱"][idx % 6],
            color: JOB_ROLES.find((j) => j.id === mappedGoalId)?.color || ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#3b82f6"][idx % 6],
            skills,
            demand: String(item.demand || "High"),
            demandScore: Number(item.fitScore) || 70,
            desc: String(item.description || "AI-generated role based on your profile."),
            avgSalary: String(item.salaryRange || "Not specified"),
            salaryNum: 90000,
            growth: String(item.growth || "Growing"),
            growthNum: 20,
            marketTrend: [60, 65, 70, 72, 75, 78, 80, 82],
            hiringCompanies: []
          };
        });
        if (!cancelled) setRecommendations(formatted);
      } catch {
        if (!cancelled) setRecommendations(dynamicLocalRecommendations(profile, freshMode));
      }

      try {
        const candidateList = recommendations.length
          ? recommendations
          : (profile.jobTypePreference === "blue-collar"
            ? dynamicLocalRecommendations(profile, freshMode)
            : fallbackRecommendations);
        const top3 = candidateList.slice(0, 3);
        const insight = await callClaude(
          [{
            role: "user", content: `User skills: ${(profile.skills || []).join(", ") || "none"}.
Interests: ${profile.interests || "not specified"}.
Job preference: ${profile.jobTypePreference || "not specified"}.
Top matches: ${top3.map(j => `${j.title}`).join(", ")}.
Write 2 personalized sentences.` }],
          "Expert career counselor. Be concise and motivating.", 180
        );
        if (!cancelled) setAiInsight(insight);
      } catch {
        if (!cancelled) {
          const pathType = profile.jobTypePreference === "blue-collar" ? "hands-on roles" : "career roles";
          setAiInsight(`Based on your profile, these ${pathType} are matched to your current strengths and interests. Start with the top option and continue to skill-gap analysis for a personalized roadmap.`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRecommendations();
    return () => { cancelled = true; };
  }, [profile, fallbackRecommendations, freshMode]);

  const demandColor = { "Critical": "#ef4444", "Very High": "#f97316", "High": "#f59e0b", "Medium": "#10b981" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
            {freshMode ? "Fresh Career Suggestions" : "Career Recommendations"}
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
            {freshMode ? "Market-demand focused · High-growth opportunities" : "XAI-powered · multi-factor scoring"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {allowFreshSuggestions && (
            <button
              onClick={() => setFreshMode(!freshMode)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: freshMode ? "1px solid #10b981" : "1px solid #334155",
                background: freshMode ? "#10b98133" : "#1e293b",
                color: freshMode ? "#10b981" : "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {freshMode ? "🔥 Market Focus" : "🎯 Skill Match"}
            </button>
          )}
          <Badge color="#10b981">XAI Enabled</Badge>
        </div>
      </div>

      {/* AI Insight */}
      {(loading || aiInsight) && (
        <Card style={{ marginBottom: "1.5rem", borderColor: "#6366f133", background: "linear-gradient(135deg,#0f172a,#1a1040)" }} glow>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 22 }}>✨</span>
            {loading ? <LoadingDots /> : <p style={{ color: "#c4b5fd", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{aiInsight}</p>}
          </div>
        </Card>
      )}

      {/* (Legend removed per simplified Careers UI requirement) */}

      {/* Careers grid (3 per row, spacious gutters) */}
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {(recommendations.length
          ? recommendations
          : (profile.jobTypePreference === "blue-collar"
            ? dynamicLocalRecommendations(profile, freshMode)
            : fallbackRecommendations)
        ).map((job, i) => {
          const score = job?.xai?.composite ?? job?.demandScore ?? 0;
          return (
          <Card
            key={job.id}
            style={{
              borderColor: i === 0 ? `${job.color}44` : "#1e293b",
              transition: "all .2s",
              minHeight: 160,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>
                  {job.title}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Badge color={demandColor[job.demand] || "#64748b"}>{job.demand} demand</Badge>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: job.color, fontFamily: "monospace" }}>
                  {(score / 10).toFixed(2)}/10
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>career rating based on your profile</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <ProgressBar value={score} color={job.color} height={8} />
            </div>

            <button
              onClick={() => onSelectJob(job)}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: job.color + "33",
                color: job.color,
                fontWeight: 800,
                fontSize: 12
              }}
            >
              View career →
            </button>
          </Card>
        );
      })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 11 ─ SKILL GAP PAGE  (enhanced with visual skill tree)
// ════════════════════════════════════════════════════════════════

function SkillTree({ job, matched }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: "1rem" }}>
        All required skills for <strong style={{ color: "#fff" }}>{job.title}</strong>:
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
        {job.skills.map((s) => {
          const have = matched?.includes(s);
          return (
            <div key={s} style={{
              padding: "10px 14px", borderRadius: 10,
              background: have ? "#10b98111" : "#1e293b",
              border: `1px solid ${have ? "#10b98144" : "#334155"}`,
              display: "flex", gap: 8, alignItems: "center"
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 2,
                background: have ? "#10b981" : "#475569", flexShrink: 0
              }} />
              <div>
                <div style={{ color: have ? "#10b981" : "#94a3b8", fontSize: 13, fontWeight: 500 }}>{s}</div>
                <div style={{ fontSize: 10, color: have ? "#059669" : "#475569" }}>
                  {have ? "✓ You have this" : "To learn"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillGapPage({ profile, selectedJob, onGoRoadmap }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetJob, setTargetJob] = useState(selectedJob || null);
  const [view, setView] = useState("gap"); // gap | tree | market
  const [compareJobs, setCompareJobs] = useState(() => (selectedJob ? [selectedJob] : []));
  const [compareAnalyses, setCompareAnalyses] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);

  const suggestedCareers = useMemo(() => {
    return JOB_ROLES
      .map(job => ({ ...job, xai: computeXAI(profile.skills || [], profile.interests || "", job) }))
      .sort((a, b) => b.xai.composite - a.xai.composite);
  }, [profile.skills, profile.interests]);

  const analyzeGap = useCallback(async (job, { setActive = true } = {}) => {
    setLoading(true);
    if (setActive) setTargetJob(job);
    const userSkills = profile.skills || [];
    const matched = job.skills.filter(s => userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
    const missing = job.skills.filter(s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
    const score = Math.round((matched.length / job.skills.length) * 100);
    let next;
    try {
      const raw = await callClaude(
        [{
          role: "user", content:
            `User wants to be ${job.title}. Has: ${userSkills.join(", ")}. Missing: ${missing.join(", ")}. Readiness: ${score}%.
Return JSON only:
{"summary":"2 sentences","priorities":[{"skill":"name","reason":"why critical","timeToLearn":"X weeks","priority":"high|medium|low"}],"strengths":["s1"],"timeline":"X months"}` }],
        "Expert career advisor. Return only valid JSON.", 500
      );
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      next = { score, matched, missing, ...parsed };
    } catch {
      next = {
        score, matched, missing,
        summary: `You match ${score}% of ${job.title} requirements.`,
        priorities: missing.map(s => ({ skill: s, reason: "Required for the role", timeToLearn: "4-6 weeks", priority: "high" })),
        strengths: matched.slice(0, 3), timeline: "3-6 months"
      };
    }
    setAnalysis(next);
    setCompareAnalyses(prev => ({ ...prev, [job.id]: next }));
    setLoading(false);
  }, [profile]);

  useEffect(() => { if (selectedJob) analyzeGap(selectedJob, { setActive: true }); }, [selectedJob, analyzeGap]);

  const pColor = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
  const addJobToCompare = async (job) => {
    if (!job) return;
    setCompareJobs(prev => {
      if (prev.some(j => j.id === job.id)) return prev;
      return [...prev, job];
    });
    if (!compareAnalyses[job.id] && !loading) {
      await analyzeGap(job, { setActive: false });
    }
  };

  const renderCareerSummaryCard = (job, a, isPrimary = false) => (
    <Card
      key={job.id}
      style={{
        padding: "1rem",
        borderColor: `${job.color}55`,
        background: isPrimary ? "#111827" : "#0f172a",
        minHeight: 230,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 900 }}>{isPrimary ? "CURRENT CAREER" : "COMPARE CAREER"}</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 14, marginTop: 3 }}>{job.title}</div>
          </div>
          <div style={{ color: job.color, fontWeight: 900, fontFamily: "monospace", fontSize: 30 }}>
            {a ? `${a.score}%` : "—"}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Badge color={job.color}>{job.demand} demand</Badge>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ marginBottom: 8 }}>
          <ProgressBar value={a?.score || 0} color={job.color} height={8} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 9, background: "#1e293b", borderRadius: 10, textAlign: "center" }}>
            <div style={{ color: "#10b981", fontWeight: 900, fontSize: 15 }}>{a?.matched?.length || 0}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Matched</div>
          </div>
          <div style={{ padding: 9, background: "#1e293b", borderRadius: 10, textAlign: "center" }}>
            <div style={{ color: "#f59e0b", fontWeight: 900, fontSize: 15 }}>{a?.missing?.length || 0}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>To Gain</div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: "0.5rem" }}>Skill Gap Analyzer</h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>AI-powered readiness analysis with visual skill tree</p>

      {/* Target Role Display */}
      {targetJob && (
        <Card style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800, marginBottom: "0.75rem" }}>TARGET ROLE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "1rem", background: `${targetJob.color}11`, borderRadius: 12, border: `1px solid ${targetJob.color}33` }}>
            <div style={{ fontSize: 48 }}>{targetJob.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{targetJob.title}</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Badge color={targetJob.color}>{targetJob.demand} demand</Badge>
                <div style={{ color: "#64748b", fontSize: 12 }}>
                  {targetJob.skills.length} skills required
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: targetJob.color, fontWeight: 900, fontFamily: "monospace", fontSize: 32 }}>
                {analysis?.score || 0}%
              </div>
              <div style={{ color: "#64748b", fontSize: 11 }}>readiness</div>
            </div>
          </div>
        </Card>
      )}

      {loading && <Card style={{ textAlign: "center", padding: "3rem" }}><LoadingDots /><p style={{ color: "#64748b", marginTop: "1rem" }}>Analyzing your skill gap…</p></Card>}

      {analysis && !loading && (
        <div>
          <Card style={{ padding: "1rem", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ color: "#fff", fontWeight: 900 }}>Readiness & Comparison</div>
              <button
                onClick={() => setShowAddDialog(true)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 12
                }}
              >
                + Add to compare
              </button>
            </div>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "stretch" }}>
              {targetJob && renderCareerSummaryCard(targetJob, compareAnalyses[targetJob.id] || analysis, true)}
              {compareJobs.filter(j => j.id !== targetJob?.id).map((job) => renderCareerSummaryCard(job, compareAnalyses[job.id], false))}
            </div>

            <button
              onClick={() => onGoRoadmap(targetJob, analysis)}
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 12
              }}
            >
              Go to DAG Roadmap →
            </button>
          </Card>

          {/* Details (tabs) */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
              {[
                { id: "gap", label: "Priority skills" },
                { id: "tree", label: "Skill tree" },
                { id: "market", label: "Market data" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setView(t.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #334155",
                    background: view === t.id ? "#6366f122" : "#1e293b",
                    color: view === t.id ? "#fff" : "#94a3b8",
                    cursor: "pointer",
                    fontWeight: 900,
                    fontSize: 12
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 10, alignItems: "start" }}>
              {[targetJob, ...compareJobs.filter(j => j.id !== targetJob?.id)].filter(Boolean).map((job) => {
                const a = compareAnalyses[job.id] || (job.id === targetJob?.id ? analysis : null);
                return (
                  <Card key={`${view}-${job.id}`} style={{ minHeight: 250 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>{job.title}</div>
                      <Badge color={job.color}>{job.demand}</Badge>
                    </div>

                    {view === "gap" && a?.priorities?.length > 0 && (
                      <div>
                        {a.priorities.slice(0, 8).map((p, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px", background: "#1e293b", borderRadius: 10, marginBottom: 8 }}>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>{p.skill}</div>
                            <Badge color={pColor[p.priority]}>{p.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {view === "tree" && a && (
                      <SkillTree job={job} matched={a.matched} />
                    )}

                    {view === "market" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: "0.9rem" }}>
                          {[
                            { label: "Avg Salary", value: job.avgSalary + "/yr", icon: "💰", color: "#10b981" },
                            { label: "Growth", value: "+" + job.growth, icon: "📈", color: "#6366f1" },
                            { label: "Demand", value: job.demand, icon: "🔥", color: demandColor(job.demand) }
                          ].map(s => (
                            <div key={s.label} style={{ padding: "0.7rem", background: "#1e293b", borderRadius: 10, textAlign: "center" }}>
                              <div style={{ fontSize: 17 }}>{s.icon}</div>
                              <div style={{ color: s.color, fontWeight: 900, fontSize: 12, margin: "3px 0" }}>{s.value}</div>
                              <div style={{ color: "#64748b", fontSize: 10 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                        <MiniSparkline data={job.marketTrend} color={job.color} width={300} height={50} />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showAddDialog && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAddDialog(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(720px, 100%)",
              maxHeight: "80vh",
              overflow: "auto",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 14,
              padding: 16
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>Add a career to compare</div>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 12
                }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {suggestedCareers
                .filter(j => !compareJobs.some(cj => cj.id === j.id))
                .map((job) => (
                  <button
                    key={job.id}
                    onClick={async () => {
                      await addJobToCompare(job);
                      setShowAddDialog(false);
                    }}
                    style={{
                      textAlign: "left",
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${job.color}44`,
                      background: "#1e293b",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>{job.title}</div>
                      <div style={{ color: job.color, fontWeight: 900, fontFamily: "monospace" }}>{job.xai.composite}%</div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Badge color={job.color}>{job.demand} demand</Badge>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function demandColor(d) {
  return { "Critical": "#ef4444", "Very High": "#f97316", "High": "#f59e0b", "Medium": "#10b981" }[d] || "#64748b";
}

// ════════════════════════════════════════════════════════════════
//  SECTION 12 ─ ROADMAP PAGE  (unchanged logic, visual upgrade)
// ════════════════════════════════════════════════════════════════

function RoadmapPage({ profile, targetJob, gapAnalysis }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompleted] = useState({});
  const [view, setView] = useState("weekly");

  function fallbackRoadmap(job, gap) {
    const skills = gap?.priorities?.slice(0, 4).map(p => p.skill) || job?.skills?.slice(0, 4) || [];
    return {
      weeks: skills.flatMap((sk, si) => [
        {
          week: si * 2 + 1, theme: `${sk} Fundamentals`, focus: sk,
          tasks: [{ id: `w${si * 2 + 1}t1`, title: `${sk} crash course`, type: "learn", hours: 8, description: `Core concepts of ${sk}` },
          { id: `w${si * 2 + 1}t2`, title: "Practice exercises", type: "practice", hours: 4, description: "Hands-on problems" }],
          milestone: `Understand ${sk} basics`
        },
        {
          week: si * 2 + 2, theme: `${sk} Deep Dive`, focus: sk,
          tasks: [{ id: `w${si * 2 + 2}t1`, title: `Build ${sk} project`, type: "build", hours: 10, description: "Apply what you learned" },
          { id: `w${si * 2 + 2}t2`, title: "Refine & review", type: "practice", hours: 4, description: "Improve project quality" }],
          milestone: `Complete ${sk} mini-project`
        }
      ]),
      totalHours: 120, expectedOutcome: `Be job-ready as ${job?.title}`
    };
  }

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const missing = gapAnalysis?.priorities?.slice(0, 5).map(p => p.skill) || targetJob?.skills?.slice(0, 4) || [];
      const raw = await callClaude(
        [{
          role: "user", content: `12-week roadmap for ${targetJob?.title}. Skills to develop: ${missing.join(", ")}. Already knows: ${(profile.skills || []).join(", ")}.
Return JSON:
{"weeks":[{"week":1,"theme":"title","focus":"skill","tasks":[{"id":"w1t1","title":"title","type":"learn|build|practice","hours":3,"description":"desc"}],"milestone":"what you can do"}],"totalHours":120,"expectedOutcome":"outcome"}
Exactly 8 weeks. Return ONLY JSON.` }],
        "Curriculum designer. Return only valid JSON.", 1200
      );
      setRoadmap(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setRoadmap(fallbackRoadmap(targetJob, gapAnalysis));
    }
    setLoading(false);
  }, [profile, targetJob, gapAnalysis]);

  useEffect(() => {
    if (targetJob && gapAnalysis) generate();
  }, [targetJob, gapAnalysis, generate]);

  const toggle = (wk, tid) => setCompleted(p => ({ ...p, [`${wk}-${tid}`]: !p[`${wk}-${tid}`] }));
  const done = (wk, tid) => !!completedTasks[`${wk}-${tid}`];
  const total = roadmap?.weeks?.reduce((a, w) => a + w.tasks.length, 0) || 0;
  const doneN = Object.values(completedTasks).filter(Boolean).length;
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  const tIcon = { learn: "📖", build: "🏗️", practice: "⚡" };
  const tColor = { learn: "#6366f1", build: "#10b981", practice: "#f59e0b" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Learning Roadmap</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>{targetJob ? `Path to ${targetJob.title}` : "Select a job from Skill Gap to generate"}</p>
        </div>
        {roadmap && <button onClick={generate} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>↻ Refresh</button>}
      </div>

      {loading && <Card style={{ textAlign: "center", padding: "3rem" }}><div style={{ fontSize: 36 }}>🗺️</div><div style={{ marginTop: "1rem" }}><LoadingDots /></div><p style={{ color: "#64748b", marginTop: "1rem" }}>Crafting your personalized roadmap…</p></Card>}
      {!loading && !roadmap && !targetJob && <Card style={{ textAlign: "center", padding: "3rem" }}><div style={{ fontSize: 48 }}>🧭</div><p style={{ color: "#64748b", marginTop: "1rem" }}>Go to Skill Gap → select a role → Generate Roadmap.</p></Card>}

      {roadmap && !loading && (
        <>
          <Card style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>Overall Progress</span>
              <span style={{ color: "#6366f1", fontWeight: 700 }}>{pct}%</span>
            </div>
            <ProgressBar value={pct} color="#6366f1" height={10} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", fontSize: 12, color: "#64748b" }}>
              <span>{doneN}/{total} tasks completed</span>
              <span>~{roadmap.totalHours}h total</span>
            </div>
            {roadmap.expectedOutcome && (
              <p style={{ color: "#c4b5fd", fontSize: 13, marginTop: "0.75rem", borderTop: "1px solid #1e293b", paddingTop: "0.75rem" }}>
                🎯 {roadmap.expectedOutcome}
              </p>
            )}
          </Card>

          <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
            {["weekly", "monthly"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                background: view === v ? "#6366f1" : "#1e293b",
                color: view === v ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13
              }}>
                {v === "weekly" ? "Weekly View" : "Monthly Summary"}
              </button>
            ))}
          </div>

          {view === "weekly" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {roadmap.weeks?.map(week => {
                const wd = week.tasks.filter(t => done(week.week, t.id)).length;
                const wp = Math.round((wd / week.tasks.length) * 100);
                return (
                  <Card key={week.week}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 11 }}>WEEK {week.week}</span>
                          <Badge color="#6366f1">{week.focus}</Badge>
                        </div>
                        <h3 style={{ color: "#fff", fontWeight: 600, margin: "4px 0 0", fontSize: 14 }}>{week.theme}</h3>
                      </div>
                      <span style={{ color: wp === 100 ? "#10b981" : "#64748b", fontWeight: 700, fontSize: 13 }}>{wd}/{week.tasks.length}</span>
                    </div>
                    <ProgressBar value={wp} color={wp === 100 ? "#10b981" : "#6366f1"} height={4} />
                    <div style={{ display: "grid", gap: 8, marginTop: "0.75rem" }}>
                      {week.tasks.map(t => (
                        <div key={t.id} onClick={() => toggle(week.week, t.id)} style={{
                          display: "flex", gap: 12, padding: "10px", borderRadius: 8, cursor: "pointer",
                          background: done(week.week, t.id) ? "#10b98111" : "#1e293b",
                          border: `1px solid ${done(week.week, t.id) ? "#10b98133" : "#334155"}`,
                          transition: "all .2s"
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                            background: done(week.week, t.id) ? "#10b981" : "transparent",
                            border: `2px solid ${done(week.week, t.id) ? "#10b981" : "#475569"}`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11
                          }}>
                            {done(week.week, t.id) ? "✓" : ""}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 12 }}>{tIcon[t.type]}</span>
                              <span style={{
                                color: done(week.week, t.id) ? "#64748b" : "#fff",
                                fontWeight: 500, fontSize: 13,
                                textDecoration: done(week.week, t.id) ? "line-through" : "none"
                              }}>{t.title}</span>
                              <span style={{ color: tColor[t.type], fontSize: 10, fontWeight: 600 }}>{t.type.toUpperCase()}</span>
                            </div>
                            <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>{t.description} · ~{t.hours}h</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {week.milestone && (
                      <div style={{
                        marginTop: "0.75rem", padding: "8px 12px",
                        background: "#1a1040", borderRadius: 8, borderLeft: "3px solid #6366f1"
                      }}>
                        <span style={{ color: "#c4b5fd", fontSize: 12 }}>🏆 Milestone: {week.milestone}</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {view === "monthly" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
              {[0, 1].map(m => {
                const mw = roadmap.weeks?.slice(m * 4, m * 4 + 4) || [];
                const mt = mw.flatMap(w => w.tasks);
                const md = mt.filter(t => { const w = mw.find(w2 => w2.tasks.some(t2 => t2.id === t.id)); return w && done(w.week, t.id); }).length;
                return (
                  <Card key={m} glow={m === 0}>
                    <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "0.75rem" }}>Month {m + 1}</h3>
                    <ProgressBar value={mt.length ? Math.round((md / mt.length) * 100) : 0} color="#6366f1" />
                    <div style={{ marginTop: "0.5rem", fontSize: 12, color: "#64748b" }}>{md}/{mt.length} tasks</div>
                    <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {mw.map(w => <Badge key={w.week} color="#6366f1">W{w.week}: {w.focus}</Badge>)}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 13 ─ MOCK INTERVIEW PAGE  (unchanged core + scoring)
// ════════════════════════════════════════════════════════════════

function InterviewPage({ onScoreRecorded }) {
  const [job, setJob] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [qi, setQi] = useState(0);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);

  const start = (j) => {
    setJob(j); setQi(0); setScores([]); setDone(false);
    const q = SAMPLE_INTERVIEWS[j.id]?.[0] || "Tell me about yourself.";
    setMsgs([{ role: "assistant", content: `Welcome to your **${j.title}** mock interview!\n\n**Question 1:** ${q}`, type: "question" }]);
  };

  const answer = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setMsgs(p => [...p, { role: "user", content: text }]); setInput(""); setLoading(true);
    const curQ = SAMPLE_INTERVIEWS[job.id]?.[qi] || "Tell me about yourself.";
    const nextQ = SAMPLE_INTERVIEWS[job.id]?.[qi + 1];
    const isLast = qi >= 4;
    try {
      const raw = await callClaude(
        [{
          role: "user", content:
            `Role: ${job.title}. Q: "${curQ}". Answer: "${text}". ${isLast ? "Last question." : ""}
Return JSON: {"score":0-100,"confidence":"high|medium|low","feedback":"2-3 specific sentences","keywords_present":["k"],"keywords_missing":["k"],"improved_answer":"one hint"}` }],
        "Expert technical interviewer. Honest, constructive. Return only valid JSON.", 500
      );
      const p = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const newScores = [...scores, p.score];
      setScores(newScores);
      if (onScoreRecorded) onScoreRecorded(p.score);

      let reply = `**Feedback:** ${p.feedback}\n`;
      if (p.keywords_present?.length) reply += `\n✅ Strong: ${p.keywords_present.join(", ")}`;
      if (p.keywords_missing?.length) reply += `\n⚠️ Missing: ${p.keywords_missing.join(", ")}`;
      reply += `\n\n💡 **Tip:** ${p.improved_answer}\n\n**Score: ${p.score}/100**`;

      if (!isLast && nextQ) { reply += `\n\n---\n\n**Question ${qi + 2}:** ${nextQ}`; setQi(q => q + 1); }
      else {
        const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
        reply += `\n\n---\n\n🎉 **Interview Complete!** Average: **${avg}/100**\n${avg >= 75 ? "Excellent! You're interview-ready." : avg >= 50 ? "Good effort! Keep practicing." : "Keep at it — practice makes perfect."}`;
        setDone(true);
      }
      setMsgs(p => [...p, { role: "assistant", content: reply, score: p.score, type: isLast ? "summary" : "feedback" }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Error processing answer. Try again.", type: "error" }]);
    }
    setLoading(false);
  };

  const renderContent = (c) => c.split('\n').map((l, i) => {
    if (l.startsWith('**') && l.endsWith('**')) return <div key={i} style={{ fontWeight: 700, color: "#fff", marginTop: i > 0 ? 8 : 0 }}>{l.slice(2, -2)}</div>;
    if (l.includes('**')) { const pts = l.split('**'); return <div key={i} style={{ marginTop: i > 0 ? 4 : 0 }}>{pts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#fff" }}>{p}</strong> : p)}</div>; }
    if (l === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #334155", margin: "8px 0" }} />;
    return <div key={i} style={{ marginTop: i > 0 ? 4 : 0 }}>{l}</div>;
  });

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: "0.5rem" }}>AI Mock Interview</h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Role-specific questions with AI scoring and instant feedback</p>

      {!job ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {JOB_ROLES.map(j => (
            <button key={j.id} onClick={() => start(j)} style={{
              padding: "1.25rem", borderRadius: 12, border: "1px solid #334155",
              background: "#1e293b", cursor: "pointer", textAlign: "left"
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{j.icon}</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{j.title}</div>
              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>5 questions</div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{job.icon}</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{job.title} Interview</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {scores.length > 0 && <Badge color="#6366f1">Avg: {avg}/100</Badge>}
              <Badge color="#10b981">Q{qi + 1}/5</Badge>
              <button onClick={() => { setJob(null); setMsgs([]); }} style={{
                padding: "4px 12px", borderRadius: 8, border: "1px solid #334155",
                background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 12
              }}>Change</button>
            </div>
          </div>

          {/* Score track */}
          {scores.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginBottom: "0.75rem" }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < scores.length ? (scores[i] >= 75 ? "#10b981" : scores[i] >= 50 ? "#f59e0b" : "#ef4444") : "#1e293b"
                }} />
              ))}
            </div>
          )}

          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div ref={ref} style={{ height: 420, overflowY: "auto", padding: "1.25rem" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "1rem" }}>
                  {m.role === "assistant" && (
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", background: "#6366f133",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0, marginRight: 8
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
                    background: m.role === "user" ? "#6366f1" : "#1e293b",
                    color: m.role === "user" ? "#fff" : "#c8d6ef",
                    borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    whiteSpace: "pre-wrap"
                  }}>
                    {m.role === "assistant" ? renderContent(m.content) : m.content}
                    {m.score !== undefined && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #334155" }}>
                        <ProgressBar value={m.score} color={m.score >= 75 ? "#10b981" : m.score >= 50 ? "#f59e0b" : "#ef4444"} height={4} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", background: "#6366f133",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>🤖</div>
                  <div style={{ background: "#1e293b", padding: "10px 16px", borderRadius: "12px 12px 12px 4px" }}><LoadingDots /></div>
                </div>
              )}
            </div>
            {!done ? (
              <div style={{ borderTop: "1px solid #1e293b", padding: "1rem", display: "flex", gap: 8 }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); answer(); } }}
                  placeholder="Type your answer… (Enter to send)" rows={2}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #334155",
                    background: "#1e293b", color: "#fff", fontSize: 13, resize: "none", fontFamily: "inherit"
                  }} />
                <button onClick={answer} disabled={loading || !input.trim()} style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: loading || !input.trim() ? "#334155" : "#6366f1", color: "#fff", fontWeight: 700
                }}>→</button>
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #1e293b", padding: "1rem", display: "flex", gap: 8 }}>
                <button onClick={() => start(job)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", background: "#6366f1", color: "#fff", fontWeight: 600 }}>Retry</button>
                <button onClick={() => setJob(null)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #334155", cursor: "pointer", background: "transparent", color: "#94a3b8", fontWeight: 600 }}>Try Another Role</button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 14 ─ PROFILE PAGE  (unchanged from v1)
// ════════════════════════════════════════════════════════════════

function ProfilePage({ profile, setProfile, onComplete }) {
  const [skills, setSkills] = useState(profile.skills || []);
  const [learningSkills, setLearningSkills] = useState(profile.learningSkills || []);
  const [nonTechnicalSkills, setNonTechnicalSkills] = useState(profile.nonTechnicalSkills || []);
  const [age, setAge] = useState(profile.age || "");
  const [qualification, setQualification] = useState(profile.qualification || "");
  const [hasDegree, setHasDegree] = useState(
    typeof profile.hasDegree === "boolean" ? String(profile.hasDegree) : "not-sure"
  );
  const [workTypePreference, setWorkTypePreference] = useState(profile.workTypePreference || "both");
  const [jobTypePreference, setJobTypePreference] = useState(profile.jobTypePreference || "white-collar");
  const [education, setEducation] = useState(() => {
    const raw = profile.education || "";
    const parts = String(raw).split(" - ");
    return parts[0]?.trim() || "";
  });
  const [eduBranch, setEduBranch] = useState(() => {
    const raw = profile.education || "";
    const parts = String(raw).split(" - ");
    return parts.length > 1 ? parts.slice(1).join(" - ").trim() : "";
  });
  const [institution, setInstitution] = useState(profile.institution || "");
  const [interests, setInterests] = useState(profile.interests || "");
  const [projects, setProjects] = useState(profile.projects || "");
  const [resumeText, setResume] = useState(profile.resumeText || "");
  const [resumeOverview, setOverview] = useState(profile.resumeOverview || "");
  const [parsing, setParsing] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [step, setStep] = useState(1);
  const [technicalSkillSearch, setTechnicalSkillSearch] = useState("");
  const [nonTechnicalSkillSearch, setNonTechnicalSkillSearch] = useState("");
  const isBlueCollarFocus = jobTypePreference === "blue-collar";

  useEffect(() => {
    setSkills(profile.skills || []);
    setLearningSkills(profile.learningSkills || []);
    setNonTechnicalSkills(profile.nonTechnicalSkills || []);
    setAge(profile.age || "");
    setQualification(profile.qualification || "");
    setHasDegree(typeof profile.hasDegree === "boolean" ? String(profile.hasDegree) : "not-sure");
    setWorkTypePreference(profile.workTypePreference || "both");
    setJobTypePreference(profile.jobTypePreference || "white-collar");

    const raw = profile.education || "";
    const parts = String(raw).split(" - ");
    setEducation(parts[0]?.trim() || "");
    setEduBranch(parts.length > 1 ? parts.slice(1).join(" - ").trim() : "");
    setInstitution(profile.institution || "");
    setInterests(profile.interests || "");
    setProjects(profile.projects || "");
    setResume(profile.resumeText || "");
    setOverview(profile.resumeOverview || "");
  }, [profile]);

  const toggle = s => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleLearning = s => setLearningSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleNonTechnical = s => setNonTechnicalSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const parseResume = async (file) => {
    if (!file) return;
    setParsing(true);
    setResumeError("");
    setResume(""); 
    setOverview("");
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(" ") + " \n";
      }
      
      const resumeText = fullText.trim();
      if (!resumeText || resumeText.length < 50) {
        throw new Error("Could not extract enough text. Ensure the PDF is not a scanned image.");
      }
      
      setResume(resumeText);

      // 1. Skill Extraction
      try {
        const rawSkills = await callClaude(
          [{ role: "user", content: `Extract technical skills. Return ONLY a JSON array:\n\n${resumeText.slice(0, 4000)}` }],
          "Resume parser. Return only valid JSON arrays.", 400
        );
        const parsed = JSON.parse(rawSkills.replace(/```json|```/g, "").trim());
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(s => ALL_SKILLS.includes(s));
          setSkills(p => [...new Set([...p, ...valid])]);
        }
      } catch (e) {
        console.warn("AI Skill extraction failed - using basic detection", e);
        const fallback = ALL_SKILLS.filter(s => resumeText.toLowerCase().includes(s.toLowerCase()));
        setSkills(p => [...new Set([...p, ...fallback])]);
      }

      // 2. Overview Generation
      const overview = await callClaude(
        [{ role: "user", content: `Summarize this resume into a professional 3-sentence overview:\n\n${resumeText.slice(0, 4000)}` }],
        "Career Expert. Provide a concise, professional summary.", 500
      );
      setOverview(overview);
      
    } catch (err) {
      console.error("PDF Processing Error:", err);
      // Resume is optional: allow user to continue even if parsing fails.
      setResumeError("Resume analysis failed. You can continue without uploading a resume.");
    }
    setParsing(false);
  };

  const save = async () => {
    const stitchedEducation = [education, eduBranch].filter(Boolean).join(" - ");
    const updatedProfile = {
      skills,
      learningSkills,
      nonTechnicalSkills,
      age: age ? Number(age) : "",
      qualification,
      hasDegree: hasDegree === "true" ? true : hasDegree === "false" ? false : null,
      workTypePreference,
      jobTypePreference,
      education: stitchedEducation,
      institution,
      interests,
      projects,
      resumeText,
      resumeOverview
    };
    setProfile(updatedProfile);

    // Save to PostgreSQL
    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email || JSON.parse(localStorage.getItem("cf_user")).email,
          ...updatedProfile
        })
      });
      if (!res.ok) throw new Error("Failed to save profile to database");

      // Also update the user object in localStorage to keep profile in sync
      const currentUser = JSON.parse(localStorage.getItem("cf_user"));
      currentUser.profile = updatedProfile;
      localStorage.setItem("cf_user", JSON.stringify(currentUser));

      onComplete();
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: "0.5rem" }}>Build Your Profile</h2>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>The more you share, the smarter your recommendations become.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: "2rem", alignItems: "center" }}>
        {[{ n: 1, label: "Skills" }, { n: 2, label: "Background" }, { n: 3, label: "Resume" }].map((s, i, arr) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setStep(s.n)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 13, transition: "all .2s",
              background: step === s.n ? "#6366f1" : step > s.n ? "#10b981" : "#1e293b", color: "#fff"
            }}>
              {step > s.n ? "✓" : s.n}
            </button>
            <span style={{ fontSize: 13, color: step === s.n ? "#fff" : "#475569" }}>{s.label}</span>
            {i < arr.length - 1 && <div style={{ width: 40, height: 1, background: "#1e293b" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          {!isBlueCollarFocus && (
            <>
              <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "0.5rem" }}>Technical Skills</h3>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>Select all technical skills you currently have</p>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Search technical skills..."
                  value={technicalSkillSearch}
                  onChange={(e) => setTechnicalSkillSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 14,
                    background: "#1e293b", border: "1px solid #334155", color: "#fff", fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: "200px", overflowY: "auto" }}>
                {ALL_SKILLS.filter(sk => sk.toLowerCase().includes(technicalSkillSearch.toLowerCase())).map(sk => (
                  <button key={sk} onClick={() => toggle(sk)} style={{
                    padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    background: skills.includes(sk) ? "#6366f1" : "#1e293b",
                    color: skills.includes(sk) ? "#fff" : "#94a3b8",
                    border: `1px solid ${skills.includes(sk) ? "#6366f1" : "#334155"}`,
                    transition: "all .15s"
                  }}>{sk}</button>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: "1.25rem" }}>
            <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "0.5rem" }}>Non-Technical Skills</h3>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>Select all non-technical skills you currently have</p>
            
            {/* Search for non-technical skills */}
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Search non-technical skills..."
                value={nonTechnicalSkillSearch}
                onChange={(e) => setNonTechnicalSkillSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                  fontFamily: "inherit"
                }}
              />
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: "200px", overflowY: "auto" }}>
              {NON_TECHNICAL_SKILLS.filter(sk => sk.toLowerCase().includes(nonTechnicalSkillSearch.toLowerCase())).map(sk => (
                <button key={sk} onClick={() => toggleNonTechnical(sk)} style={{
                  padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: nonTechnicalSkills.includes(sk) ? "#10b981" : "#1e293b",
                  color: nonTechnicalSkills.includes(sk) ? "#fff" : "#94a3b8",
                  border: `1px solid ${nonTechnicalSkills.includes(sk) ? "#10b981" : "#334155"}`,
                  transition: "all .15s"
                }}>{sk}</button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "0.5rem" }}>Skills you want to learn</h3>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>
              {isBlueCollarFocus
                ? "Select practical/creative skills you want to learn"
                : "Select technical skills you want to learn (excludes skills you already have)"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: "200px", overflowY: "auto" }}>
              {(isBlueCollarFocus ? GENERAL_LEARNING_SKILLS : ALL_SKILLS)
                .filter(sk => !skills.includes(sk) && sk.toLowerCase().includes((isBlueCollarFocus ? nonTechnicalSkillSearch : technicalSkillSearch).toLowerCase()))
                .map(sk => (
                <button key={sk} onClick={() => toggleLearning(sk)} style={{
                  padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: learningSkills.includes(sk) ? "#8b5cf6" : "#1e293b",
                  color: learningSkills.includes(sk) ? "#fff" : "#94a3b8",
                  border: `1px solid ${learningSkills.includes(sk) ? "#8b5cf6" : "#334155"}`,
                  transition: "all .15s"
                }}>{sk}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              {isBlueCollarFocus
                ? `${nonTechnicalSkills.length} non-technical · ${learningSkills.length} to learn`
                : `${skills.length} technical · ${nonTechnicalSkills.length} non-technical · ${learningSkills.length} to learn`}
            </span>
            <button onClick={() => setStep(2)} style={primaryBtn}>Next →</button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1.5rem" }}>Background & Interests</h3>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>AGE</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                background: "#1e293b", border: "1px solid #334155", color: "#fff", fontFamily: "inherit"
              }}
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>EDUCATIONAL QUALIFICATION</label>
            <input
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="10th / 12th / Diploma / B.A. / B.Tech / M.A."
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
                background: "#1e293b", border: "1px solid #334155", color: "#fff", fontFamily: "inherit"
              }}
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>DO YOU HAVE A DEGREE?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "true", label: "Yes" }, { id: "false", label: "No" }, { id: "not-sure", label: "Prefer not to say" }].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setHasDegree(opt.id)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${hasDegree === opt.id ? "#6366f1" : "#334155"}`,
                    background: hasDegree === opt.id ? "#6366f122" : "transparent",
                    color: hasDegree === opt.id ? "#6366f1" : "#64748b", fontSize: 12, fontWeight: 600
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>JOB TYPE PREFERENCE</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "blue-collar", label: "Blue-collar" }, { id: "white-collar", label: "White-collar" }, { id: "both", label: "Both" }].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setJobTypePreference(opt.id)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${jobTypePreference === opt.id ? "#10b981" : "#334155"}`,
                    background: jobTypePreference === opt.id ? "#10b98122" : "transparent",
                    color: jobTypePreference === opt.id ? "#10b981" : "#64748b", fontSize: 12, fontWeight: 600
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>WORK SETTING PREFERENCE</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "onsite", label: "On-site" }, { id: "remote", label: "Remote" }, { id: "both", label: "Both" }].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setWorkTypePreference(opt.id)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${workTypePreference === opt.id ? "#f59e0b" : "#334155"}`,
                    background: workTypePreference === opt.id ? "#f59e0b22" : "transparent",
                    color: workTypePreference === opt.id ? "#f59e0b" : "#64748b", fontSize: 12, fontWeight: 600
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>EDUCATION</label>
            <select
              value={education}
              onChange={(e) => {
                const v = e.target.value;
                setEducation(v);
                // Clear branch if user switches away from engineering degrees.
                if (v !== "Bachelors" && v !== "Masters") setEduBranch("");
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 14,
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#fff",
                fontFamily: "inherit"
              }}
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {(education === "Bachelors" || education === "Masters") && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>ENGINEERING BRANCH</label>
              <select
                value={eduBranch}
                onChange={(e) => setEduBranch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                  fontFamily: "inherit"
                }}
              >
                <option value="">Select branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
                <option value="AI&DS">AI & DS</option>
                <option value="CSBS">CSBS</option>
                <option value="BIOMED">Biomedical</option>
                <option value="CHEM">Chemical</option>
                <option value="AERO">Aerospace</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}
          
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>INSTITUTION NAME</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Massachusetts Institute of Technology, Stanford University, IIT Madras"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 14,
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#fff",
                fontFamily: "inherit"
              }}
            />
          </div>
          
          {[
            { label: "Interests", val: interests, set: setInterests, ph: "e.g. AI, open source, building SaaS, gaming", rows: 2 },
            { label: "Notable Projects", val: projects, set: setProjects, ph: "e.g. ML model predicting housing prices with 92% accuracy", rows: 3 }
          ].map(({ label, val, set, ph, rows }) => (
            <div key={label} style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>{label.toUpperCase()}</label>
              <textarea
                value={val}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                rows={rows}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  resize: "vertical",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                  fontFamily: "inherit"
                }}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={ghostBtn}>← Back</button>
            <button onClick={() => setStep(3)} style={primaryBtn}>Next →</button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "0.5rem" }}>Resume Import</h3>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>Upload your PDF resume — AI extracts skills automatically</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => parseResume(e.target.files[0])}
            disabled={parsing}
            style={{ marginBottom: "1rem", color: "#fff" }}
          />
          {resumeError && (
            <p style={{ color: "#f59e0b", fontSize: 12, marginTop: -6, marginBottom: 14 }}>
              {resumeError}
            </p>
          )}
          {parsing && (
            <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", color: "#10b981", fontWeight: "bold" }}>
              <LoadingDots /> Analyzing PDF...
            </div>
          )}
          {resumeText && !parsing && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ color: "#10b981", marginBottom: "0.75rem", fontSize: 13, fontWeight: 600 }}>
                ✓ Resume analyzed successfully.
              </div>
              {resumeOverview && (
                <div style={{ padding: "12px", background: "#1e293b", borderRadius: 10, border: "1px solid #6366f133" }}>
                  <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>RESUME OVERVIEW</div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>{resumeOverview}</div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={ghostBtn}>← Back</button>
            <button onClick={save} style={primaryBtn} disabled={parsing}>
              {parsing ? "Analyzing..." : "Save & Continue 🚀"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 15 ─ DASHBOARD  (enhanced with admin view)
// ════════════════════════════════════════════════════════════════

function DashboardPage({ user, profile, onNav }) {
  const xp = Math.min(2000, (profile.skills?.length || 0) * 100);
  const lvl = xp < 200 ? { level: 1, name: "Newcomer", next: 200 } :
    xp < 500 ? { level: 2, name: "Explorer", next: 500 } :
      xp < 900 ? { level: 3, name: "Apprentice", next: 900 } :
        xp < 1400 ? { level: 4, name: "Practitioner", next: 1400 } :
          xp < 2000 ? { level: 5, name: "Specialist", next: 2000 } :
            { level: 6, name: "Expert", next: 2000 };

  const topMatch = profile.skills?.length
    ? JOB_ROLES.map(j => ({ ...j, score: computeXAI(profile.skills, profile.interests, j).composite })).sort((a, b) => b.score - a.score)[0]
    : null;

  const completionPct = Math.round(
    ([!!profile.skills?.length, !!profile.education, !!profile.interests, !!profile.projects]
      .filter(Boolean).length / 4) * 100
  );

  const isAdmin = user.role === "admin";

  return (
    <div>
      {/* Role badge */}
      {isAdmin && (
        <div style={{
          marginBottom: "1rem", padding: "8px 14px", borderRadius: 8,
          background: "#f59e0b22", border: "1px solid #f59e0b44",
          display: "flex", gap: 8, alignItems: "center"
        }}>
          <span>🔑</span>
          <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>Admin Mode — Full analytics and system access enabled</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }}>Welcome back, {user.name} 👋</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
            {profile.skills?.length ? `${profile.skills.length} skills · Level ${lvl.level} ${lvl.name}` : "Complete your profile to get started"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>LEVEL {lvl.level} · {lvl.name.toUpperCase()}</div>
          <div style={{ width: 120 }}><ProgressBar value={xp} max={lvl.next} color="#f59e0b" height={6} /></div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{xp}/{lvl.next} XP</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: "2rem" }}>
        {[
          { label: "Skills", value: profile.skills?.length || 0, icon: "⚡", color: "#6366f1" },
          { label: "Profile Score", value: `${completionPct}%`, icon: "📊", color: "#10b981" },
          { label: "Top Match", value: topMatch ? `${topMatch.score}%` : "—", icon: "🎯", color: "#f59e0b", sub: topMatch?.title },
          { label: "XP Earned", value: xp, icon: "🏆", color: "#ec4899" }
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "monospace", marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{s.sub}</div>}
          </Card>
        ))}
      </div>

      {/* Completion */}
      {completionPct < 100 && (
        <Card style={{ marginBottom: "1.5rem", borderColor: "#f59e0b33" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>Complete Your Profile</span>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>{completionPct}%</span>
          </div>
          <ProgressBar value={completionPct} color="#f59e0b" height={8} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "1rem" }}>
            {[{ label: "Skills", done: !!profile.skills?.length }, { label: "Education", done: !!profile.education },
            { label: "Interests", done: !!profile.interests }, { label: "Projects", done: !!profile.projects }].map(item => (
              <button key={item.label} onClick={() => onNav("profile")} style={{
                display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", borderRadius: 8,
                border: `1px solid ${item.done ? "#10b98133" : "#334155"}`,
                background: item.done ? "#10b98111" : "#1e293b", cursor: "pointer"
              }}>
                <span style={{ fontSize: 14 }}>{item.done ? "✅" : "⭕"}</span>
                <span style={{ color: item.done ? "#10b981" : "#64748b", fontSize: 13 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <h3 style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: "1rem" }}>QUICK ACTIONS</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {[
          { icon: "🎯", title: "Careers", desc: "XAI-powered matches", nav: "recommendations" },
          { icon: "📉", title: "Skill Gap", desc: "Visual analysis", nav: "skillgap" },
          { icon: "🗺️", title: "Roadmap", desc: "8-week learning plan", nav: "roadmap" },
          { icon: "🎤", title: "Interview", desc: "AI mock + scoring", nav: "interview" },
          { icon: "💬", title: "AI Coach", desc: "Context-aware advice", nav: "chatbot" },
          { icon: "🔗", title: "Credentials", desc: "Blockchain certificates", nav: "blockchain" },
          { icon: "📊", title: "Analytics", desc: "Progress insights", nav: "analytics" },
          ...(isAdmin ? [{ icon: "⚙️", title: "Admin", desc: "System management", nav: "admin" }] : [])
        ].map(a => (
          <button key={a.nav} onClick={() => onNav(a.nav)} style={{
            padding: "1.5rem", borderRadius: 14, border: "1px solid #1e293b",
            background: "#0f172a", cursor: "pointer", textAlign: "left", transition: "all .2s"
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{a.title}</div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Top matches preview */}
      {profile.skills?.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: "1rem" }}>TOP CAREER MATCHES (XAI)</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {JOB_ROLES
              .map(j => ({ ...j, xai: computeXAI(profile.skills, profile.interests, j) }))
              .sort((a, b) => b.xai.composite - a.xai.composite)
              .slice(0, 3)
              .map(job => (
                <Card key={job.id} style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 20 }}>{job.icon}</span>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>XAI Score: {job.xai.composite}%</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 80 }}><ProgressBar value={job.xai.composite} color={job.color} height={4} /></div>
                      <span style={{ color: job.color, fontWeight: 700, fontSize: 13, minWidth: 36 }}>{job.xai.composite}%</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ user, profile, currentCareerId, additionalCareers, onSetupProfile, onViewProfile, onContinueCareer, onAddCareer, onNavigateToCareer }) {
  const hasProfile = Boolean(
    ((profile.jobTypePreference === "blue-collar"
      ? (profile.nonTechnicalSkills?.length || 0) > 0
      : (profile.skills?.length || 0) > 0) || (profile.learningSkills?.length || 0) > 0) &&
    profile.interests?.trim()
  );
  const currentCareer = currentCareerId ? JOB_ROLES.find(j => j.id === currentCareerId) : null;

  const progress = (() => {
    if (!currentCareer) return null;
    const userSkills = profile.skills || [];
    const matched = currentCareer.skills.filter((s) =>
      userSkills.map((u) => u.toLowerCase()).includes(s.toLowerCase())
    );
    const score = Math.round((matched.length / currentCareer.skills.length) * 100);
    return { matchedCount: matched.length, total: currentCareer.skills.length, score };
  })();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>Home</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
            {user?.name ? `Welcome, ${user.name}` : "Welcome"}
          </p>
        </div>
        {hasProfile && (
          <button onClick={onViewProfile} style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #334155",
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 12
          }}>
            View profile →
          </button>
        )}
      </div>

      {!hasProfile ? (
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 800, marginTop: 0 }}>Setup your profile</h3>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            Add your skills and interests to get career recommendations and start your roadmap.
          </p>
          <button onClick={onSetupProfile} style={{ ...primaryBtn, marginTop: 10 }}>
            Setup profile →
          </button>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card glow>
              <div style={{ color: "#64748b", fontSize: 12, fontWeight: 900 }}>CURRENT CAREER</div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8, alignItems: "flex-start" }}>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>
                  {currentCareer ? currentCareer.title : "Not selected yet"}
                </div>
                {progress && currentCareer && (
                  <div style={{ color: currentCareer.color, fontWeight: 900, fontFamily: "monospace", fontSize: 22 }}>
                    {progress.score}%
                  </div>
                )}
              </div>
              {progress && currentCareer && (
                <div style={{ marginTop: 10 }}>
                  <ProgressBar value={progress.score} color={currentCareer.color} height={10} />
                  <div style={{ marginTop: 6, color: "#64748b", fontSize: 12 }}>
                    Matched {progress.matchedCount}/{progress.total} skills
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    if (currentCareer) onNavigateToCareer(currentCareer);
                  }}
                  disabled={!currentCareer}
                  style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: currentCareer ? "pointer" : "not-allowed",
                background: currentCareer ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#334155",
                color: "#fff",
                fontWeight: 900,
                fontSize: 12
              }}>
                  Continue career →
                </button>
              </div>
            </Card>

            {/* Additional careers stacked under current career */}
            {additionalCareers.length > 0 && additionalCareers.map((career, index) => {
              const job = JOB_ROLES.find(j => j.id === career.id);
              if (!job) return null;

              const extraProgress = (() => {
                const userSkills = profile.skills || [];
                const matched = job.skills.filter(s => userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
                const score = Math.round((matched.length / job.skills.length) * 100);
                return { matchedCount: matched.length, total: job.skills.length, score };
              })();

              return (
                <Card key={career.id} glow>
                  <div style={{ color: "#64748b", fontSize: 12, fontWeight: 900 }}>ADDITIONAL CAREER {index + 1}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8, alignItems: "flex-start" }}>
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>
                      {job.title}
                    </div>
                    <div style={{ color: job.color, fontWeight: 900, fontFamily: "monospace", fontSize: 22 }}>
                      {extraProgress.score}%
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <ProgressBar value={extraProgress.score} color={job.color} height={10} />
                    <div style={{ marginTop: 6, color: "#64748b", fontSize: 12 }}>
                      Matched {extraProgress.matchedCount}/{extraProgress.total} skills
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                    <button
                      onClick={() => onNavigateToCareer(job)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 12
                      }}
                    >
                      Continue career →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card>
            <h3 style={{ color: "#fff", fontWeight: 900, marginTop: 0 }}>Add new career</h3>
            <p style={{ color: "#94a3b8", marginTop: 8 }}>
              Explore and add additional career paths to your dashboard for comprehensive skill gap analysis.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button onClick={onAddCareer} style={{ ...primaryBtn }}>
                Choose new career →
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 16 ─ ADMIN PAGE  (NEW)
// ════════════════════════════════════════════════════════════════

function AdminPage({ user }) {
  if (user.role !== "admin") return (
    <Card style={{ textAlign: "center", padding: "3rem" }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <p style={{ color: "#ef4444", marginTop: "1rem" }}>Access denied. Admin role required.</p>
    </Card>
  );

  const apiEndpoints = [
    { method: "POST", path: "/api/auth/signup", desc: "Register user, return JWT" },
    { method: "POST", path: "/api/auth/login", desc: "Login, return signed JWT" },
    { method: "GET", path: "/api/profile/:userId", desc: "Fetch user profile" },
    { method: "POST", path: "/api/profile", desc: "Save/update user profile" },
    { method: "GET", path: "/api/recommendations/:id", desc: "XAI career recommendations" },
    { method: "POST", path: "/api/skill-gap", desc: "Analyze skill gap for role" },
    { method: "GET", path: "/api/roadmap/:userId/:role", desc: "Get/generate learning roadmap" },
    { method: "POST", path: "/api/interview/evaluate", desc: "Score interview answer" },
    { method: "POST", path: "/api/blockchain/mint", desc: "Mint credential on Polygon" },
    { method: "GET", path: "/api/blockchain/verify/:h", desc: "Verify credential hash" },
    { method: "GET", path: "/api/analytics/overview", desc: "Platform-wide analytics" },
    { method: "GET", path: "/api/analytics/skills", desc: "Skill frequency data" },
    { method: "POST", path: "/api/chatbot", desc: "AI career chatbot response" }
  ];

  const mColor = { GET: "#10b981", POST: "#6366f1", PUT: "#f59e0b", DELETE: "#ef4444" };

  const metabaseSteps = [
    "docker run -d -p 3001:3000 --name metabase metabase/metabase",
    "Open http://localhost:3001 and complete setup wizard",
    "Add MongoDB connection: Settings → Databases → Add MongoDB",
    "Use connection string: mongodb://localhost:27017/careerforge",
    "Create Question → Native Query to use aggregation pipelines",
    "Embed dashboards via: Settings → Embedding → Enable embedding",
    "Use signed tokens: jwt.sign({resource:{dashboard:1}}, METABASE_SECRET)"
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Admin Panel</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>System management · API docs · Integration guides</p>
        </div>
        <Badge color="#f59e0b">Admin Access</Badge>
      </div>

      {/* API Docs */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>📡 REST API Endpoints</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {apiEndpoints.map(e => (
            <div key={e.path} style={{
              display: "flex", gap: 10, alignItems: "center",
              padding: "8px 12px", background: "#1e293b", borderRadius: 8
            }}>
              <span style={{
                color: mColor[e.method] || "#fff", fontWeight: 700, fontSize: 11,
                minWidth: 40, fontFamily: "monospace"
              }}>{e.method}</span>
              <code style={{ color: "#7dd3fc", fontSize: 12, flex: 1 }}>{e.path}</code>
              <span style={{ color: "#64748b", fontSize: 12 }}>{e.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Metabase Guide */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>📊 Metabase Setup Guide</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {metabaseSteps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 12px",
              background: "#1e293b", borderRadius: 8, alignItems: "flex-start"
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, background: "#3b82f622",
                color: "#3b82f6", fontWeight: 700, fontSize: 12, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>{i + 1}</div>
              <code style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.6 }}>{s}</code>
            </div>
          ))}
        </div>
      </Card>

      {/* MongoDB Schemas */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>🗄️ MongoDB Schemas</h3>
        <pre style={{
          background: "#020617", padding: "1rem", borderRadius: 8,
          fontSize: 11, color: "#a5f3fc", overflowX: "auto", lineHeight: 1.6
        }}>{
            `// users collection
{
  _id: ObjectId, email: String, passwordHash: String,
  role: "user" | "admin", name: String,
  createdAt: Date, lastLogin: Date,
  profile: {
    skills: [String], education: String,
    interests: String, projects: String, resumeText: String
  },
  xp: Number, badges: [String]
}

// roadmaps collection
{
  _id: ObjectId, userId: ObjectId, targetRole: String,
  createdAt: Date, updatedAt: Date,
  weeks: [{ week: Number, theme: String, focus: String,
    tasks: [{ id: String, title: String, type: String,
      hours: Number, description: String, completed: Boolean,
      completedAt: Date }],
    milestone: String }],
  totalHours: Number, expectedOutcome: String
}

// credentials collection (mirrors blockchain ledger)
{
  _id: ObjectId, userId: ObjectId, tokenId: Number,
  hash: String, txHash: String, blockNumber: Number,
  userName: String, jobTitle: String, score: Number,
  skills: [String], network: String, issuedAt: Date
}

// interview_sessions collection
{
  _id: ObjectId, userId: ObjectId, role: String,
  scores: [Number], avgScore: Number,
  completedAt: Date, questions: [String], answers: [String]
}`}</pre>
      </Card>

      {/* Security config */}
      <Card>
        <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>🔐 Security Configuration</h3>
        <pre style={{
          background: "#020617", padding: "1rem", borderRadius: 8,
          fontSize: 11, color: "#a5f3fc", overflowX: "auto", lineHeight: 1.6
        }}>{
            `// JWT Middleware (middleware/auth.js)
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; // min 32 chars

module.exports = (requiredRole) => (req,res,next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error:'No token' });
  try {
    const decoded = jwt.verify(token, SECRET);
    if(requiredRole && decoded.role !== requiredRole)
      return res.status(403).json({ error:'Forbidden' });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error:'Invalid token' }); }
};
cd 
// Rate limiting (app.js)
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 100 }));
app.use('/api/interview', rateLimit({ windowMs: 60*1000, max: 10 }));

// Helmet security headers
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc:["'self'"], scriptSrc:["'self'"] }
}));`}</pre>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 17 ─ GLOBAL STYLES & HELPERS
// ════════════════════════════════════════════════════════════════

const globalCSS = `
  @keyframes cfBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes cfFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cfPulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes cfSlideIn{ from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  * { box-sizing:border-box; margin:0; padding:0; }
  textarea,input { font-family:inherit; outline:none; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#334155; border-radius:2px; }
  button:hover { opacity:.9; }
  details summary { list-style:none; }
  details summary::-webkit-details-marker { display:none; }
`;

const primaryBtn = {
  padding: "8px 24px", borderRadius: 8, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff",
  fontWeight: 700, fontSize: 14
};
const ghostBtn = {
  padding: "8px 20px", borderRadius: 8, cursor: "pointer",
  border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontWeight: 600
};
const labelStyle = {
  color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block",
  marginBottom: 6, letterSpacing: ".5px"
};

function Field({ label, value, set, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={labelStyle}>{label.toUpperCase()}</label>
      <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} type={type}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
          background: "#1e293b", border: "1px solid #334155", color: "#fff"
        }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 17 ─ CAREER SELECTION DIALOG
// ════════════════════════════════════════════════════════════════

function CareerSelectionDialog({ currentCareerId, additionalCareers, onSelectCareer, onClose, profile }) {
  const availableCareers = JOB_ROLES.filter(job => 
    job.id !== currentCareerId && !additionalCareers.some(c => c.id === job.id)
  ).map(job => ({
    ...job,
    xai: computeXAI(profile.skills || [], profile.interests || "", job)
  }));

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#0f172a", borderRadius: 16, padding: "1.5rem",
        maxWidth: "600px", width: "90%", maxHeight: "80vh", overflow: "auto",
        border: "1px solid #334155"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
            Choose New Career
          </h3>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 20, cursor: "pointer", padding: 4
          }}>×</button>
        </div>
        
        <div style={{ color: "#64748b", fontSize: 14, marginBottom: "1rem" }}>
          Select a career to add to your dashboard. This will generate skill gap analysis and personalized recommendations.
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {availableCareers.map(job => (
            <button
              key={job.id}
              onClick={() => onSelectCareer(job)}
              style={{
                background: "#1e293b", border: "1px solid #334155",
                borderRadius: 12, padding: "1rem", cursor: "pointer",
                textAlign: "left", transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.target.style.background = job.color + "22";
                e.target.style.borderColor = job.color;
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#1e293b";
                e.target.style.borderColor = "#334155";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 32 }}>{job.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                    {job.title}
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Badge color={job.color}>{job.demand} demand</Badge>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {job.skills.length} skills required
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: job.color, fontFamily: "monospace" }}>
                    {(job.xai?.composite ? (job.xai.composite / 10).toFixed(2) : "—")}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>rating</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {availableCareers.length === 0 && (
          <div style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
            No additional careers available. All careers have been added to your dashboard.
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 18 ─ VIEW PROFILE PAGE
// ════════════════════════════════════════════════════════════════

function ViewProfilePage({ profile, user, onEditProfile, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile, skills: profile.skills || [] });
  const [resumeFile, setResumeFile] = useState(null);

  const allSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", "HTML", "CSS", "SQL", "MongoDB",
    "AWS", "Docker", "Kubernetes", "Git", "TypeScript", "Vue.js", "Angular", "Express", "PostgreSQL",
    "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Flutter", "Swift", "Kotlin",
    "Blockchain", "Solidity", "Web3", "DevOps", "CI/CD", "Agile", "Scrum", "REST API", "GraphQL"
  ];

  const remainingSkills = allSkills.filter(skill => !tempProfile.skills.includes(skill));

  const handleSkillToggle = (skill) => {
    console.log('Toggling skill:', skill);
    console.log('Current skills:', tempProfile.skills);
    
    setTempProfile(prev => {
      const newSkills = prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      console.log('New skills:', newSkills);
      return { ...prev, skills: newSkills };
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // Read file content as text
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfile(prev => ({
          ...prev,
          resumeText: event.target.result,
          resumeOverview: event.target.result.substring(0, 1000) + "..."
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    onEditProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile, skills: profile.skills || [] });
    setResumeFile(null);
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>Profile</h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
            Your professional information and skills
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {isEditing ? (
            <>
              <button onClick={handleSave} style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#10b981,#059669)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 12
              }}>
                Save
              </button>
              <button onClick={handleCancel} style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 12
              }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 12
            }}>
              Edit →
            </button>
          )}
          <button onClick={onBack} style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #334155",
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 12
          }}>
            ← Back
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Personal Information */}
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 0, marginBottom: "1rem" }}>
            Personal Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.name || user?.name || ""}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: 14
                  }}
                />
              ) : (
                <p style={{ color: "#94a3b8", margin: 0 }}>
                  {profile.name || user?.name || "No name specified"}
                </p>
              )}
            </div>
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Email
              </label>
              <p style={{ color: "#94a3b8", margin: 0 }}>
                {user?.email || "No email specified"}
              </p>
            </div>
          </div>
        </Card>

        {/* Academic Information */}
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 0, marginBottom: "1rem" }}>
            Academic Information
          </h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                College/Institution
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.education || ""}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="Enter your college/institution name..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: 14
                  }}
                />
              ) : (
                <p style={{ color: "#94a3b8", margin: 0 }}>
                  {profile.education || "No education specified"}
                </p>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Degree
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.degree || ""}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g., Bachelor of Technology"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: 14
                    }}
                  />
                ) : (
                  <p style={{ color: "#94a3b8", margin: 0 }}>
                    {profile.degree || "No degree specified"}
                  </p>
                )}
              </div>
              <div>
                <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Graduation Year
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.graduationYear || ""}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, graduationYear: e.target.value }))}
                    placeholder="e.g., 2024"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: 14
                    }}
                  />
                ) : (
                  <p style={{ color: "#94a3b8", margin: 0 }}>
                    {profile.graduationYear || "No year specified"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 0, marginBottom: "1rem" }}>
            Professional Information
          </h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Professional Interests
              </label>
              {isEditing ? (
                <textarea
                  value={tempProfile.interests || ""}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="Describe your professional interests and career goals..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: 14,
                    minHeight: "80px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  {profile.interests || "No interests specified"}
                </p>
              )}
            </div>
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Projects
              </label>
              {isEditing ? (
                <textarea
                  value={tempProfile.projects || ""}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, projects: e.target.value }))}
                  placeholder="Describe your notable projects..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: 14,
                    minHeight: "80px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  {profile.projects || "No projects specified"}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 0, marginBottom: "1rem" }}>
            Technical Skills
          </h3>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: "0.5rem" }}>
              Your Skills ({tempProfile.skills?.length || 0})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(tempProfile.skills || []).map(skill => (
                <Badge 
                  key={skill} 
                  color="#6366f1" 
                  style={{
                    cursor: isEditing ? "pointer" : "default",
                    opacity: isEditing ? 0.8 : 1,
                    transition: "all 0.2s",
                    userSelect: "none"
                  }} 
                  onClick={() => {
                    if (isEditing) {
                      console.log('Removing skill:', skill);
                      handleSkillToggle(skill);
                    }
                  }}
                  onMouseOver={(e) => isEditing && (e.target.style.opacity = "0.6")}
                  onMouseOut={(e) => isEditing && (e.target.style.opacity = "0.8")}
                >
                  {skill} {isEditing && "×"}
                </Badge>
              ))}
            </div>
          </div>

          {isEditing && remainingSkills.length > 0 && (
            <div>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: "0.5rem" }}>
                Add More Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {remainingSkills.map(skill => (
                  <Badge
                    key={skill}
                    color="#334155"
                    style={{ 
                      cursor: "pointer", 
                      opacity: 0.7,
                      transition: "all 0.2s",
                      userSelect: "none"
                    }}
                    onClick={() => {
                      console.log('Adding skill:', skill);
                      handleSkillToggle(skill);
                    }}
                    onMouseOver={(e) => e.target.style.opacity = "1"}
                    onMouseOut={(e) => e.target.style.opacity = "0.7"}
                  >
                    + {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Resume */}
        <Card glow>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 0, marginBottom: "1rem" }}>
            Resume
          </h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            {isEditing && (
              <div>
                <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Upload Resume Document
                </label>
                <div style={{
                  padding: "20px",
                  border: "2px dashed #334155",
                  borderRadius: 10,
                  textAlign: "center",
                  background: "#1e293b",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" style={{ cursor: "pointer", margin: 0 }}>
                    <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>📄</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>
                      {resumeFile ? resumeFile.name : "Click to upload resume (PDF, DOC, DOCX, TXT)"}
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            <div>
              <label style={{ color: "#64748b", fontSize: 12, fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                Resume Overview
              </label>
              {isEditing ? (
                <textarea
                  value={tempProfile.resumeOverview || ""}
                  onChange={(e) => setTempProfile(prev => ({ ...prev, resumeOverview: e.target.value }))}
                  placeholder="Paste your resume content or overview..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: 14,
                    minHeight: "120px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {profile.resumeOverview || "No resume uploaded"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 19 ─ SUBSCRIPTION MODAL
// ════════════════════════════════════════════════════════════════

function SubscriptionModal({ onClose, onSelectPlan }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [fallbackPayment, setFallbackPayment] = useState(null);

  const handlePayment = (planType, price) => {
    setIsProcessing(true);
    setSelectedPlan({ type: planType, price });
    if (typeof onSelectPlan === "function") {
      onSelectPlan({ type: planType, price });
    }

    // Direct UPI payment intent with selected plan amount.
    try {
      const upiId = "9445426847@fam";
      const note = `${planType} Subscription`;
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("CareerForge")}&am=${encodeURIComponent(String(price))}&cu=INR&tn=${encodeURIComponent(note)}`;
      const link = document.createElement("a");
      link.href = upiUrl;
      link.target = "_self";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Desktop browsers may not handle UPI deep-links.
      setTimeout(() => {
        setFallbackPayment({
          upiId,
          amount: price,
          note,
          upiUrl,
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}`
        });
      }, 900);
    } catch (error) {
      console.error("Payment error:", error);
      setFallbackPayment({
        upiId: "9445426847@fam",
        amount: price,
        note: `${planType} Subscription`,
        upiUrl: "",
        qrUrl: ""
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 20,
          padding: "2rem",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            backdropFilter: "blur(10px)"
          }}>
            <span style={{ fontSize: "2rem" }}>💎</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0, marginBottom: "0.5rem" }}>
            Unlock Premium Features
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 16, margin: 0 }}>
            Get unlimited access to all career paths and advanced analytics
          </p>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 16,
            padding: "2rem",
            textAlign: "center",
            marginBottom: "2rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderTop: "3px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem"
            }} />
            <p style={{ color: "#fff", margin: 0 }}>
              Processing payment for {selectedPlan?.type} plan...
            </p>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 14, margin: "0.5rem 0 0" }}>
              Opening payment options...
            </p>
          </div>
        )}

        {/* Manual payment fallback (desktop-safe) */}
        {fallbackPayment && (
          <div style={{
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "1rem",
            marginBottom: "1.2rem",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.25)"
          }}>
            <p style={{ color: "#fff", margin: "0 0 0.5rem", fontWeight: 700 }}>Complete Payment</p>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 0.8rem", fontSize: 13 }}>
              Scan QR in any UPI app or pay to the UPI ID below.
            </p>
            {fallbackPayment.qrUrl && (
              <img
                src={fallbackPayment.qrUrl}
                alt="UPI QR Code"
                style={{ width: 200, height: 200, borderRadius: 12, background: "#fff", padding: 8 }}
              />
            )}
            <p style={{ color: "#fff", margin: "0.8rem 0 0.25rem" }}>
              UPI ID: <strong>{fallbackPayment.upiId}</strong>
            </p>
            <p style={{ color: "#fff", margin: "0.25rem 0 0.8rem" }}>
              Amount: <strong>₹{fallbackPayment.amount}</strong>
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(`UPI ID: ${fallbackPayment.upiId}\nAmount: ₹${fallbackPayment.amount}\nNote: ${fallbackPayment.note}`)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              Copy Payment Details
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          {/* Monthly Plan */}
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 16,
            padding: "1.5rem",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1
          }}
          onClick={() => !isProcessing && handlePayment("Monthly", 200)}
          onMouseOver={(e) => {
            if (!isProcessing) {
              e.target.style.transform = "translateY(-5px)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              e.target.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
            }
          }}
          onMouseOut={(e) => {
            if (!isProcessing) {
              e.target.style.transform = "translateY(0)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.target.style.boxShadow = "none";
            }
          }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>
                  Monthly Plan
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 14, margin: "0.25rem 0 0" }}>
                  Perfect for getting started
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: 0 }}>
                  ₹200
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, margin: 0 }}>
                  per month
                </div>
              </div>
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 14, lineHeight: 1.6 }}>
              ✓ Unlimited career paths<br/>
              ✓ Advanced skill analytics<br/>
              ✓ Priority support<br/>
              ✓ Cancel anytime
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (!isProcessing) handlePayment("Monthly", 200); }}
              disabled={isProcessing}
              style={{
                marginTop: "1rem",
                width: "100%",
                background: "#ffffff",
                color: "#334155",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              Pay Monthly
            </button>
          </div>

          {/* Yearly Plan */}
          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: 16,
            padding: "1.5rem",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            position: "relative",
            overflow: "hidden"
          }}
          onClick={() => !isProcessing && handlePayment("Yearly", 2000)}
          onMouseOver={(e) => {
            if (!isProcessing) {
              e.target.style.transform = "translateY(-5px)";
              e.target.style.boxShadow = "0 15px 40px rgba(245, 87, 108, 0.3)";
            }
          }}
          onMouseOut={(e) => {
            if (!isProcessing) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }
          }}
          >
            {/* Popular Badge */}
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#f5576c",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600
            }}>
              POPULAR
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>
                  Yearly Plan
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14, margin: "0.25rem 0 0" }}>
                  Best value - Save 17%
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: 0 }}>
                  ₹2000
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 12, margin: 0 }}>
                  per year
                </div>
              </div>
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14, lineHeight: 1.6 }}>
              ✓ Everything in Monthly<br/>
              ✓ Exclusive career insights<br/>
              ✓ 1-on-1 mentoring sessions<br/>
              ✓ Certificate of completion
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (!isProcessing) handlePayment("Yearly", 2000); }}
              disabled={isProcessing}
              style={{
                marginTop: "1rem",
                width: "100%",
                background: "#ffffff",
                color: "#be185d",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              Pay Yearly
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 14, margin: 0 }}>
            🚀 Instant access • 🔒 Secure payment • 📱 All devices supported
          </p>
        </div>

        {/* Close Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 25,
              fontSize: 14,
              fontWeight: 600,
              cursor: isProcessing ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              opacity: isProcessing ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isProcessing) {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseOut={(e) => {
              if (!isProcessing) {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
          >
            {isProcessing ? "Processing..." : "Maybe Later"}
          </button>
        </div>

        {/* Add spinner animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SECTION 20 ─ MAIN APP  (enhanced nav, state, routing)
// ════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const [user, setUser] = useState(() => {
    // Check if we are returning from the DAG app
    const isReturning = window.location.search.includes('from_dag=true');
    if (isReturning) {
      try { return JSON.parse(localStorage.getItem("cf_user")); } catch { return null; }
    }
    return null; // Always login on fresh start
  });
  const [page, setPage] = useState("dashboard");
  const [profile, setProfile] = useState({
    skills: [],
    nonTechnicalSkills: [],
    learningSkills: [],
    age: "",
    qualification: "",
    hasDegree: null,
    workTypePreference: "both",
    jobTypePreference: "white-collar",
    education: "",
    interests: "",
    projects: "",
    resumeText: "",
    resumeOverview: ""
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [completedTasks] = useState({});
  const [interviewScores, setScores] = useState([]);
  const [profileMode, setProfileMode] = useState("setup"); // setup | edit
  const [allowFreshSuggestions, setAllowFreshSuggestions] = useState(false);
  const [currentCareerId, setCurrentCareerId] = useState("");
  const [additionalCareers, setAdditionalCareers] = useState([]);
  const [showCareerDialog, setShowCareerDialog] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Profile becomes "complete" once the user provides core inputs.
  // Resume upload is optional; education/projects are also optional per your requirement.
  const profileComplete = Boolean(
    ((profile.jobTypePreference === "blue-collar"
      ? (profile.nonTechnicalSkills?.length || 0) > 0
      : (profile.skills?.length || 0) > 0) || (profile.learningSkills?.length || 0) > 0) &&
    profile.interests?.trim()
  );

  // Load profile from logged in user
  useEffect(() => {
    if (user && user.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  // Reload current career once we know the logged-in email (fixes DAG return + login timing).
  useEffect(() => {
    if (!user?.email) return;
    try {
      setCurrentCareerId(localStorage.getItem(`cf_current_career_${user.email}`) || "");
    } catch { /* ignore */ }
  }, [user?.email]);

  // When returning from DAG, accept `career` param and persist it.
  useEffect(() => {
    if (!user?.email) return;
    const params = new URLSearchParams(window.location.search);
    const fromDag = params.get("from_dag") === "true";
    const career = params.get("career");
    if (!fromDag || !career) return;
    try {
      localStorage.setItem(`cf_current_career_${user.email}`, career);
    } catch { /* ignore */ }
    setCurrentCareerId(career);
  }, [user?.email]);

  // Keep page flow locked until profile is completed.
  useEffect(() => {
    if (!profileComplete) {
      // Allow Home to show "Setup profile", but prevent other pages.
      if (page !== "profile" && page !== "dashboard") setPage("profile");
      return;
    }
    // If profile is complete, do not auto-redirect away from "profile".
    // This allows users to click Profile later to edit details.
  }, [profileComplete, page]);

  // Restore session data (XP/Scores etc)

  // Persist profile
  useEffect(() => { localStorage.setItem("cf_profile", JSON.stringify(profile)); }, [profile]);

  const logout = () => { localStorage.removeItem("cf_user"); setUser(null); };

  if (!user) return <AuthPage onAuth={u => setUser(u)} />;

  const effectiveCurrentCareerId =
    currentCareerId ||
    selectedJob?.id ||
    (additionalCareers?.[0]?.id ?? "");

  const handleNav = async (id) => {
    console.log("Navigating to:", id);
    if (!profileComplete && id !== "profile" && id !== "dashboard" && id !== "roadmap") {
      setPage("profile");
      return;
    }
    // Once a current career is selected, prevent changing it by blocking Careers page.
    // But allow fresh suggestions when coming from "Add new career"
    if (id === "recommendations" && currentCareerId && !allowFreshSuggestions) {
      setPage("dashboard");
      return;
    }
    if (id === 'roadmap') {
      const g = selectedJob?.dagGoalId || selectedJob?.id || 'frontend-dev';
      const rawSkills = Array.isArray(profile.skills) ? profile.skills : [];
      const normalized = rawSkills
        .map(s => String(s).trim())
        .filter(Boolean);
      // Cap to keep the DAG app responsive (SVG rendering can get heavy).
      const unique = [...new Map(normalized.map(s => [s.toLowerCase(), s])).values()].slice(0, 25);
      const s = unique.join(',');
      const targetRoleTitle = encodeURIComponent(selectedJob?.title || "");
      const targetRoleSkills = encodeURIComponent(
        Array.isArray(selectedJob?.skills) ? selectedJob.skills.slice(0, 20).join(",") : ""
      );
      const url = `http://localhost:5184/?goal=${encodeURIComponent(g)}&skills=${encodeURIComponent(s)}&role_title=${targetRoleTitle}&role_skills=${targetRoleSkills}`;
      console.log("Redirecting to DAG Portal:", url);
      window.location.assign(url);
    } else {
      setPage(id);
    }
  };

  // Handle career selection from dialog
  const handleAddCareer = (job) => {
    // Add to additional careers if not already present
    if (!additionalCareers.some(c => c.id === job.id)) {
      setAdditionalCareers(prev => [...prev, { id: job.id, addedAt: Date.now() }]);
    }
    setShowCareerDialog(false);
    
    // Navigate to skill gap analyzer for this career
    setSelectedJob(job);
    setPage("skillgap");
  };

  // Handle navigation to career analysis
  const handleNavigateToCareer = (job) => {
    setSelectedJob(job);
    setPage("skillgap");
  };

  const effectivePage2 = profileComplete ? page : (page === "dashboard" ? "dashboard" : "profile");

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: "100vh", background: "#020617",
        fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif",
        color: "#94a3b8", display: "flex", flexDirection: "column"
      }}>
        <style>{globalCSS}</style>

      {/* Navigation */}
      <nav style={{
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52, flexShrink: 0, position: "sticky", top: 0, zIndex: 50, gap: 8
      }}>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>🚀</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>CareerForge</span>
          <Badge color="#6366f1">v2</Badge>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setPage("dashboard")}
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: effectivePage2 === "dashboard" ? "#6366f122" : "transparent",
              color: effectivePage2 === "dashboard" ? "#fff" : "#94a3b8",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 12
            }}
          >
            Home
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", background: "#6366f133",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#6366f1"
          }}>
            {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
          </div>
          {user.role === "admin" && <span style={{ fontSize: 10, color: "#f59e0b" }}>Admin</span>}
          <button onClick={logout} style={{
            padding: "3px 8px", borderRadius: 6,
            border: "1px solid #334155", background: "transparent",
            color: "#64748b", cursor: "pointer", fontSize: 10
          }}>Logout</button>
        </div>
      </nav>

      {/* Page content */}
      <main style={{
        flex: 1, padding: "2rem 1.5rem", width: "100%", maxWidth: "100%",
        margin: "0 auto", animation: "cfFadeUp .3s ease"
      }}>
        {effectivePage2 === "dashboard" && (
          <HomePage
            user={user}
            profile={profile}
            currentCareerId={effectiveCurrentCareerId}
            additionalCareers={additionalCareers}
            onSetupProfile={() => { setProfileMode("setup"); setPage("profile"); }}
            onViewProfile={() => setShowViewProfile(true)}
            onContinueCareer={() => {
              const job = JOB_ROLES.find(j => j.id === currentCareerId);
              if (job) setSelectedJob(job);
              setPage("skillgap");
            }}
            onAddCareer={() => setShowCareerDialog(true)}
            onNavigateToCareer={handleNavigateToCareer}
          />
        )}
        {effectivePage2 === "profile" && (
          <ProfilePage
            profile={profile}
            setProfile={setProfile}
            onComplete={() => {
              if (profileMode === "edit") {
                setProfileMode("setup");
                setPage("dashboard");
                return;
              }
              setPage("recommendations");
            }}
          />
        )}
        {effectivePage2 === "recommendations" && (
          <RecommendationsPage
            profile={profile}
            currentCareerId={currentCareerId}
            allowFreshSuggestions={allowFreshSuggestions}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setCurrentCareerId(job.dagGoalId || job.id);
              setAllowFreshSuggestions(false); // Reset after selection
              try {
                const email = user?.email || "default";
                localStorage.setItem(`cf_current_career_${email}`, job.dagGoalId || job.id);
              } catch { /* ignore */ }
              handleNav("skillgap");
            }}
          />
        )}
        {effectivePage2 === "skillgap" && (
          <SkillGapPage
            profile={profile}
            selectedJob={selectedJob || (currentCareerId ? JOB_ROLES.find(j => j.id === currentCareerId) : null)}
            onGoRoadmap={(job, gap) => { setSelectedJob(job); setGapAnalysis(gap); handleNav("roadmap"); }}
          />
        )}
        {effectivePage2 === "roadmap" && <RoadmapPage profile={profile} targetJob={selectedJob} gapAnalysis={gapAnalysis} />}
        {effectivePage2 === "interview" && <InterviewPage onScoreRecorded={handleScore} />}
        {effectivePage2 === "chatbot" && <ChatbotPage profile={profile} />}
        {effectivePage2 === "blockchain" && <BlockchainPage user={user} profile={profile} />}
        {effectivePage2 === "analytics" && <AnalyticsPage profile={profile} completedTasks={completedTasks} interviewScores={interviewScores} />}
        {effectivePage2 === "admin" && <AdminPage user={user} />}
        </main>
      </div>

      {/* Floating Subscription Button */}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999
      }}>
        <button
          onClick={() => setShowSubscriptionModal(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>💎</span>
          <span style={{
            fontSize: "0.6rem",
            fontWeight: "600",
            color: "#fff",
            marginTop: "2px",
            lineHeight: 1
          }}>
            Subscribe
          </span>
          <span style={{
            fontSize: "0.6rem",
            fontWeight: "600",
            color: "#fff",
            lineHeight: 1
          }}>
            Now
          </span>
          
          {/* Pulse Animation */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "50%",
            border: "2px solid rgba(102, 126, 234, 0.6)",
            animation: "pulse 2s infinite"
          }} />
        </button>
        
        {/* Tooltip */}
        <div style={{
          position: "absolute",
          bottom: "90px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.opacity = "1"}
          onMouseLeave={(e) => e.target.style.opacity = "0"}
        >
          Unlock Premium Features
        </div>
      </div>

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* View Profile Dialog */}
      {showViewProfile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#0f172a", borderRadius: 16, padding: "1.5rem",
            maxWidth: "800px", width: "90%", maxHeight: "90vh", overflow: "auto",
            border: "1px solid #334155"
          }}>
            <ViewProfilePage
              profile={profile}
              user={user}
              onEditProfile={setProfile}
              onBack={() => setShowViewProfile(false)}
            />
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSelectPlan={(plan) => console.log('Selected plan:', plan)}
        />
      )}

      {/* Career Selection Dialog */}
      {showCareerDialog && (
        <CareerSelectionDialog
          currentCareerId={currentCareerId}
          additionalCareers={additionalCareers}
          profile={profile}
          onSelectCareer={handleAddCareer}
          onClose={() => setShowCareerDialog(false)}
        />
      )}
    </ErrorBoundary>
  );
}