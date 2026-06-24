import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const storageKey = user ? `cforge_user_${user.username}` : null;

    // Core application state
    const [tasks, setTasks] = useState([]);
    const [completedSteps, setCompletedSteps] = useState({}); // { stepId: { timestamp: string, score: number, xp: number } }
    const [userProfile, setUserProfile] = useState({
        graduationYear: new Date().getFullYear() + 4,
        preferredCareer: null,
        skills: []
    });

    // Load user data on mount/user change
    useEffect(() => {
        if (!storageKey) return;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            setTasks(data.tasks || []);
            setCompletedSteps(data.completedSteps || {});
            setUserProfile(data.userProfile || { graduationYear: new Date().getFullYear() + 4 });
        } else {
            // Initial data structure if fresh
            setTasks([]);
            setCompletedSteps({});
            setUserProfile({ graduationYear: new Date().getFullYear() + 4 });
        }
    }, [storageKey]);

    // Save user data on every change
    useEffect(() => {
        if (!storageKey) return;
        const data = { tasks, completedSteps, userProfile };
        localStorage.setItem(storageKey, JSON.stringify(data));
    }, [tasks, completedSteps, userProfile, storageKey]);

    const addTask = (task) => setTasks(prev => [...prev, { ...task, id: Date.now().toString(), completed: false, date: new Date().toISOString() }]);

    const completeTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: new Date().toISOString() } : t));

    const completeStep = (stepId, score, xp) => {
        setCompletedSteps(prev => ({
            ...prev,
            [stepId]: { timestamp: new Date().toISOString(), score, xp }
        }));
    };

    const updateProfile = (updates) => setUserProfile(prev => ({ ...prev, ...updates }));

    const logoutReset = () => {
        setTasks([]);
        setCompletedSteps({});
        setUserProfile({ graduationYear: new Date().getFullYear() + 4 });
    };

    return (
        <AppContext.Provider value={{
            tasks, completedSteps, userProfile,
            addTask, completeTask, completeStep, updateProfile, reset: logoutReset
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
