import { predictionEngine } from '../utils/predictionEngine';
import { reportEngine } from '../utils/reportEngine';

export const assistantEngine = {
    getNextBestAction: (milestones, completedStepsData) => {
        // Step.id and completedStepsData.id
        const nextUnlockedIdx = milestones.findIndex(m => !completedStepsData[m.id] || completedStepsData[m.id].score < 70);
        if (nextUnlockedIdx === -1) {
            return "You have cleared all roadmap milestones! Start building a personal project to solidify your knowledge.";
        }

        const next = milestones[nextUnlockedIdx];
        const isUnlocked = nextUnlockedIdx === 0 || (completedStepsData[milestones[nextUnlockedIdx - 1].id] && completedStepsData[milestones[nextUnlockedIdx - 1].id].score >= 70);

        if (!isUnlocked) {
            const prev = milestones[nextUnlockedIdx - 1];
            return `Task: **Unlock ${next.title}** by completing the test for **${prev.title}**. You need a 70% score!`;
        }
        return `Action: **Prepare for ${next.title}**. Study the resources and take the knowledge test to advance.`;
    },

    analyzeProgress: (milestones, completedStepsData, userProfile) => {
        const completedCount = Object.values(completedStepsData).filter(d => d.score >= 70).length;
        const total = milestones.length;
        const report = reportEngine.generateLiveReport(completedCount, total, completedStepsData);
        const prediction = predictionEngine.calculateFutureReadiness(completedCount, total, userProfile.graduationYear, report.averageScore);

        return `📊 **Your Intelligence Report:**
- **Completion:** ${report.completionPct}% (${completedCount}/${total} Milestones)
- **Conceptual Score:** ${report.averageScore}%
- **Future Pace:** ${prediction.predictedCompletionDate}
- **Readiness:** ${prediction.readinessLevel}

💡 **Insight:** ${report.strength}
⚠️ **Friction:** ${report.weakness}
🚀 **Next Step:** ${report.recommendation}`;
    },

    explainLock: (stepId, milestones, completedStepsData) => {
        if (!stepId) return "I can't find that milestone.";
        const idx = milestones.findIndex(m => m.id === stepId);
        if (idx === 0) return `Step **${milestones[idx].title}** is currently available. Start now!`;

        const prev = milestones[idx - 1];
        const prevStatus = completedStepsData[prev.id];

        if (!prevStatus) return `Milestone🔒 Locked: You must first complete **${prev.title}**.`;
        if (prevStatus.score < 70) return `Milestone🔒 Locked: You took the test for **${prev.title}**, but only scored **${prevStatus.score}%**. You need **70%** to unlock the next path.`;

        return `Step is unlocked! You're ready to proceed to ${milestones[idx].title}.`;
    },

    predictCareer: (branchId, completedCount, totalCount) => {
        const skillsCount = completedCount * 2; // Simulated: 2 skills per milestone
        const mapping = predictionEngine.mapRoleBySkills(branchId, skillsCount);
        const progress = Math.round((completedCount / totalCount) * 100);

        return `🔮 **Career Outlook:**
With your **${progress}%** progress in ${branchId}, you're trajectory is pointing toward a **${mapping.recommendedRole}** role. You are focusing on junior-level maturity. Keep finishing milestones to elevate to associate or lead status!`;
    },

    generateResponse: (query, userData) => {
        const { milestones, completedStepsData, userProfile, branchId } = userData;
        const lower = query.toLowerCase();

        if (lower.includes("what should i do") || lower.includes("next")) {
            return assistantEngine.getNextBestAction(milestones, completedStepsData);
        }
        if (lower.includes("analyze") || lower.includes("progress")) {
            return assistantEngine.analyzeProgress(milestones, completedStepsData, userProfile);
        }
        if (lower.includes("why is this locked") || lower.includes("lock")) {
            // Find first locked step
            const lockedStep = milestones.find(m => !completedStepsData[m.id] || completedStepsData[m.id].score < 70);
            return assistantEngine.explainLock(lockedStep?.id, milestones, completedStepsData);
        }
        if (lower.includes("career") || lower.includes("role") || lower.includes("job")) {
            const completedCount = Object.keys(completedStepsData).length;
            return assistantEngine.predictCareer(branchId, completedCount, milestones.length);
        }

        return "I'm your intelligence bot! Ask me about your 'next action', 'progress analysis', 'career outlook', or 'why something is locked'.";
    }
};
