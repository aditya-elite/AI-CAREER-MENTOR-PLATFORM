export const MOCK_TEST_POOL = {
    // Keys match milestone IDs (e.g., s1, s2, m1, etc.)
    s1: [
        {
            question: "In standard algorithmic logic, which structure allows a program to repeat a sequence of steps?",
            options: ["Recursion", "Loops", "Conditional Branching", "Static Assignment"],
            correctAnswer: 1,
            skillTag: "Flow Control"
        },
        {
            question: "When breaking down a complex problem into smaller parts, we call it...",
            options: ["Decomposition", "Encapsulation", "Polymorphism", "Recursion"],
            correctAnswer: 0,
            skillTag: "Problem Solving"
        },
        {
            question: "Scenario: You need to sort a list of 10 items. What is the most important factor in choosing an algorithm?",
            options: ["Time Complexity", "Scalability", "Simplicity", "Data Type"],
            correctAnswer: 2,
            skillTag: "Algorithmic Thinking"
        }
    ],
    s2: [
        {
            question: "In Python/JavaScript, which of the following is used to store multiple values in a single ordered variable?",
            options: ["Boolean", "Array/List", "Function", "Module"],
            correctAnswer: 1,
            skillTag: "Data Structures"
        },
        {
            question: "What is the primary difference between a Compiler and an Interpreter?",
            options: ["One is faster than the other", "One executes code line-by-line", "One is for Mac only", "They are identical"],
            correctAnswer: 1,
            skillTag: "Compilers"
        }
    ],
    m1: [
        {
            question: "Which organ system is responsible for filtering blood and removing metabolic waste?",
            options: ["Skeletal", "Digestive", "Urinary", "Nervous"],
            correctAnswer: 2,
            skillTag: "Urinary System"
        },
        {
            question: "The human heart has how many chambers?",
            options: ["2", "4", "3", "1"],
            correctAnswer: 1,
            skillTag: "Circulatory System"
        }
    ]
};

export const getQuestionsForStep = (step) => {
    // If a pool exists for this step ID, return it. Otherwise, return generic logical questions.
    return MOCK_TEST_POOL[step.id] || [
        {
            question: `Which skill is most critical for ${step.title}?`,
            options: ["Patience", "Technical Knowledge", "Collaboration", "All of the above"],
            correctAnswer: 3,
            skillTag: "Success Factor"
        },
        {
            question: `In the context of ${step.phase}, what is the main goal?`,
            options: ["Earning money", "Learning foundational knowledge", "Passing exams", "Exploration"],
            correctAnswer: 1,
            skillTag: "Phased Goal"
        }
    ];
};
