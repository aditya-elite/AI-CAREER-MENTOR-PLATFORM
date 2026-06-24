export const predictionEngine = {
    calculateFutureReadiness: (completedStepsCount, totalStepsCount, graduationYear, testAverage) => {
        const currentYear = new Date().getFullYear();
        const yearsRemaining = graduationYear - currentYear;
        const progressRate = completedStepsCount / totalStepsCount;

        // Prediction metrics
        let readinessLevel = "Developing";
        let riskLevel = "Low";
        let message = "You're building a solid foundation. Keep pace!";

        if (progressRate > 0.8) readinessLevel = "Industry-Ready";
        else if (progressRate > 0.5) readinessLevel = "Intermediate";

        const predictedCompletionYear = currentYear + (progressRate > 0 ? (1 - progressRate) / (progressRate / 1) : 4);
        const onTrack = predictedCompletionYear <= graduationYear;

        if (!onTrack) {
            riskLevel = "High";
            message = `⚠️ At your current pace, you might finish by ${Math.ceil(predictedCompletionYear)}. Speed up to graduate readiness!`;
        } else if (progressRate < 0.2 && yearsRemaining < 2) {
            riskLevel = "Medium";
            message = "⚠️ You have limited time before graduation. Accelerate your milestone completion!";
        }

        const confidence = (testAverage || 100) / 100;
        const maturityIdx = (progressRate * 0.7) + (confidence * 0.3);

        return {
            predictedCompletionDate: `Mid ${Math.min(graduationYear, Math.ceil(predictedCompletionYear))}`,
            readinessLevel,
            riskLevel,
            maturityIdx: Math.round(maturityIdx * 100),
            message
        };
    },

    mapRoleBySkills: (branchId, skillsCount) => {
        const roles = {
            software: ["Full Stack Developer", "Backend Engineer", "Frontend Specialist"],
            data: ["Data Scientist", "ML Engineer", "AI Researcher"],
            mbbs: ["Resident Doctor", "Junior Surgeon", "General Physician"],
            law: ["Corporate Associate", "Legal Practitioner", "Judge"],
            ux: ["Product Designer", "UX Architect", "Visual Designer"]
        };

        const list = roles[branchId] || ["General Professional", "Researcher"];
        let idx = 0;
        if (skillsCount > 5) idx = 1;
        if (skillsCount > 10) idx = 2;

        return {
            recommendedRole: list[idx % list.length],
            suggestedPosition: `Junior ${list[idx % list.length]}`
        };
    }
};
