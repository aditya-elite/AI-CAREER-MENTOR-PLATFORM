export const reportEngine = {
    generateLiveReport: (completedStepsCount, totalStepsCount, completedStepsData) => {
        const rate = completedStepsCount / (totalStepsCount || 1);
        const completionPct = Math.round(rate * 100);

        // Calculate average score
        const totalScore = Object.values(completedStepsData).reduce((sum, d) => sum + (d.score || 0), 0);
        const averageScore = completedStepsCount > 0 ? Math.round(totalScore / completedStepsCount) : 0;

        // Calculate consistency
        const timestamps = Object.values(completedStepsData).map(d => new Date(d.timestamp));
        let consistency = "Low";
        if (timestamps.length >= 2) {
            const sorted = timestamps.sort((a, b) => a - b);
            const diffs = [];
            for (let i = 1; i < sorted.length; i++) {
                diffs.push((sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24)); // Days
            }
            const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
            if (avgDiff <= 2) consistency = "High";
            else if (avgDiff <= 5) consistency = "Medium";
        }

        // Qualitative insights
        let strength = "Starting to build your knowledge core.";
        let weakness = "Need initial data to identify friction points.";
        let recommendation = "Complete your first roadmap milestone to gain momentum.";

        if (completionPct > 70) {
            strength = "Exceptional mastery of milestones. You're effectively closing knowledge gaps.";
            weakness = "Burnout risk. Maintain pacing to ensure long-term focus.";
            recommendation = "Begin applying skills in personal projects beyond the roadmap.";
        } else if (completionPct > 30) {
            strength = "Steady progress across the roadmap foundation.";
            weakness = "Execution gap. You're starting milestones but completing fewer tests.";
            recommendation = "Focus on the next unlocked test to validate your current knowledge.";
        }

        if (averageScore < 75 && completedStepsCount > 0) {
            weakness = "Conceptual understanding. Your test scores indicate some topics aren't fully learned.";
            recommendation = "Re-read resource materials for your most recent milestone.";
        }

        return {
            completionPct,
            averageScore,
            consistency,
            strength,
            weakness,
            recommendation
        };
    }
};
