export const chartUtils = {
    groupByWeek: (completedSteps) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0, Sun=6

        // Initial empty baseline for the week
        const weekMap = Array(7).fill(0).map((_, i) => ({
            name: days[i],
            steps: 0
        }));

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);

        Object.values(completedSteps).forEach(step => {
            if (!step.timestamp) return;
            const date = new Date(step.timestamp);
            if (date >= oneWeekAgo) {
                const dayIdx = (date.getDay() + 6) % 7;
                weekMap[dayIdx].steps += 1;
            }
        });

        // Rotate so today is the last element
        const rotated = [];
        for (let i = 1; i <= 7; i++) {
            rotated.push(weekMap[(todayIdx + i) % 7]);
        }
        return rotated;
    },

    groupByHour: (completedSteps) => {
        const hourMap = Array(24).fill(0).map((_, i) => ({
            name: `${i}:00`,
            steps: 0
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        Object.values(completedSteps).forEach(step => {
            if (!step.timestamp) return;
            const date = new Date(step.timestamp);
            // Current 24 hours
            if (date >= today) {
                const hour = date.getHours();
                hourMap[hour].steps += 1;
            }
        });

        return hourMap;
    }
};
