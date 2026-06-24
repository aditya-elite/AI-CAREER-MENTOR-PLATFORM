export const INITIAL_TASKS = [
    { id: "t1", title: "Review College Cutoffs 2024", type: "research", priority: "high", completed: false, xp: 50, date: new Date().toISOString() },
    { id: "t2", title: "Complete Aptitude Mock Test", type: "practice", priority: "high", completed: false, xp: 100, date: new Date().toISOString() },
    { id: "t3", title: "Read: Future of AI & Law", type: "reading", priority: "medium", completed: true, xp: 30, date: new Date(Date.now() - 86400000).toISOString() },
    { id: "t4", title: "Build Personal Portfolio Base", type: "project", priority: "medium", completed: false, xp: 120, date: new Date(Date.now() - 172800000).toISOString() },
    { id: "t5", title: "Check entrance exam syllabus", type: "research", priority: "low", completed: true, xp: 20, date: new Date(Date.now() - 345600000).toISOString() },
];

export const MOCK_ACTIVITY_DATA = [
    { name: "Mon", tasks: 2, focus: 45 },
    { name: "Tue", tasks: 1, focus: 30 },
    { name: "Wed", tasks: 3, focus: 60 },
    { name: "Thu", tasks: 0, focus: 0 },
    { name: "Fri", tasks: 4, focus: 90 },
    { name: "Sat", tasks: 5, focus: 120 },
    { name: "Sun", tasks: 0, focus: 10 }
];
