import { getQuestionsForStep } from '../data/mockTests';

export const testEngine = {
    generateQuestions: (step, prevPerformance = 80) => {
        const baseQuestions = getQuestionsForStep(step);
        // Step.skills and step.resources.contentSummary would influence content in a more advanced AI app.
        // For now, we simulate difficulty by slicing based on prevPerformance.

        let difficulty = "Medium";
        if (prevPerformance < 50) difficulty = "Low";
        else if (prevPerformance > 85) difficulty = "High";

        // Logic-bases: If High difficulty, maybe shuffle or add harder questions.
        // For simulation, we return the base set.
        return {
            questions: baseQuestions,
            difficulty,
            timeLimitMins: baseQuestions.length * 1.5 // 1.5 mins per question
        };
    },

    evaluateTest: (questions, answers) => {
        let correctCount = 0;
        const results = [];
        const weakSkills = [];

        questions.forEach((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            if (isCorrect) {
                correctCount++;
            } else {
                weakSkills.push(q.skillTag);
            }
            results.push({
                question: q.question,
                isCorrect,
                correctAnswer: q.options[q.correctAnswer],
                userAnswer: q.options[answers[idx]]
            });
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;

        return {
            score,
            passed,
            weakSkills: [...new Set(weakSkills)], // Unique weak skills
            results
        };
    },

    adjustDifficulty: (previousScore) => {
        if (previousScore < 50) return "Easier";
        if (previousScore > 80) return "Harder";
        return "Medium";
    }
};
