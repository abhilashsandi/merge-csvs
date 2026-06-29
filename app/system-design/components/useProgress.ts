import { useState, useEffect } from 'react';

export interface ProgressState {
  completedModules: string[];
  quizScores: Record<string, number>;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({
    completedModules: [],
    quizScores: {},
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('system-design-progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const markModuleCompleted = (moduleId: string) => {
    setProgress(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      const next = { ...prev, completedModules: [...prev.completedModules, moduleId] };
      localStorage.setItem('system-design-progress', JSON.stringify(next));
      return next;
    });
  };

  const saveQuizScore = (moduleId: string, score: number) => {
    setProgress(prev => {
      const next = { ...prev, quizScores: { ...prev.quizScores, [moduleId]: score } };
      localStorage.setItem('system-design-progress', JSON.stringify(next));
      return next;
    });
  };

  const resetProgress = () => {
    const fresh = { completedModules: [], quizScores: {} };
    setProgress(fresh);
    localStorage.setItem('system-design-progress', JSON.stringify(fresh));
  };

  return { progress, markModuleCompleted, saveQuizScore, resetProgress, isLoaded };
}
