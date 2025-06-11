
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('mockit_visited');
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      setShowTutorial(true);
      localStorage.setItem('mockit_visited', 'true');
    }
  }, []);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setCurrentStep(0);
    localStorage.setItem('mockit_tutorial_completed', 'true');
  };

  return {
    isFirstVisit,
    currentStep,
    showTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial
  };
};
