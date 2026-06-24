import { CAREERS } from '../data/constants';

export function computeCareerMatch(profile) {
    const scores = {};
    const init = (id) => { if (!scores[id]) scores[id] = 0; };

    const { vibe, strength, leisure, aversion, impact } = profile;

    // Vibe scoring
    if (vibe === "tech") { init("tech"); scores["tech"] += 30; }
    if (vibe === "creative") { init("design"); scores["design"] += 30; }
    if (vibe === "helping") { init("medicine"); scores["medicine"] += 30; }
    if (vibe === "curious") { init("science"); scores["science"] += 30; }
    if (vibe === "leader") { init("business"); scores["business"] += 30; }
    if (vibe === "justice") { init("law"); scores["law"] += 30; }

    // Strength boosts
    if (strength === "logical") { init("tech"); scores["tech"] += 15; init("science"); scores["science"] += 10; }
    if (strength === "social") { init("law"); scores["law"] += 15; init("business"); scores["business"] += 15; }
    if (strength === "artistic") { init("design"); scores["design"] += 20; }
    if (strength === "academic") { init("medicine"); scores["medicine"] += 15; init("science"); scores["science"] += 15; }
    if (strength === "hands_on") { init("tech"); scores["tech"] += 10; init("medicine"); scores["medicine"] += 10; }
    if (strength === "empathy") { init("medicine"); scores["medicine"] += 20; init("law"); scores["law"] += 10; }

    // Leisure boosts
    if (leisure === "tech") { init("tech"); scores["tech"] += 10; }
    if (leisure === "creative") { init("design"); scores["design"] += 15; }
    if (leisure === "curious") { init("science"); scores["science"] += 15; }
    if (leisure === "entrepreneurial") { init("business"); scores["business"] += 15; }
    if (leisure === "helping") { init("medicine"); scores["medicine"] += 10; }

    // Impact alignment
    if (impact === "tech_impact") { init("tech"); scores["tech"] += 15; }
    if (impact === "health_impact") { init("medicine"); scores["medicine"] += 20; }
    if (impact === "justice_impact") { init("law"); scores["law"] += 20; }
    if (impact === "creative_impact") { init("design"); scores["design"] += 20; }
    if (impact === "research_impact") { init("science"); scores["science"] += 20; }
    if (impact === "business_impact") { init("business"); scores["business"] += 20; }

    // Aversion penalties
    if (aversion === "no_tech") { if (scores["tech"]) scores["tech"] -= 20; }
    if (aversion === "no_medical") { if (scores["medicine"]) scores["medicine"] -= 25; }
    if (aversion === "no_math") { if (scores["tech"]) scores["tech"] -= 10; if (scores["science"]) scores["science"] -= 10; }

    // Sort
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted.map(([id, score]) => ({ career: CAREERS[id], score, pct: Math.min(100, score) })).filter(x => x.career);
}

export function getPersonalizedMessage(matches, profile) {
    const top = matches[0]?.career;
    if (!top) return "You have a fascinating mind — let's explore your paths!";
    const msgs = {
        tech: `Your logical mind and love for building things point strongly toward **Technology**. You're the kind of person who sees a problem and immediately thinks about how to engineer the solution.`,
        medicine: `Your empathy, curiosity about life, and desire to help people make you a natural for **Medicine & Healthcare**. You're drawn to direct, life-changing impact.`,
        law: `Your strong sense of justice, communication skills and social awareness are the DNA of a great **Lawyer or Policy Maker**. You want to change systems, not just symptoms.`,
        design: `Your creative eye, aesthetic sense and love for visual expression make **Design & Creative Arts** your natural home. You see the world differently — that's your superpower.`,
        business: `Your entrepreneurial energy, leadership instinct and vision to create value make you a future **Business Leader or Founder**. You think in opportunities, not problems.`,
        science: `Your deep curiosity, love for understanding how things work and patience to dig deep make you a natural **Scientist or Researcher**. You're comfortable in the unknown.`,
    };
    return msgs[top.id] || "Your profile shows a fascinating mix — let's map your journey!";
}
