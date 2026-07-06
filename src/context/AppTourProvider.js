import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTourGuideController } from 'rn-tourguide';
import { useFeed } from './FeedContext';
import defaultSteps from '../constants/steps.json';

export const AppTourContext = createContext(null);

export const AppTourProvider = ({ children }) => {
  const { start, canStart, stop, eventEmitter } = useTourGuideController();
  const { activeTab, setActiveTab } = useFeed();

  const [steps] = useState(defaultSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [pendingTourStart, setPendingTourStart] = useState(false);
  const [tourHighlightTarget, setTourHighlightTarget] = useState(null);

  useEffect(() => {
    if (!eventEmitter) return;

    const handleStart = () => {
      setTimeout(() => {
        setIsRunning(true);
      }, 0);
    };

    const handleStop = () => {
      setTimeout(() => {
        setIsRunning(false);
        setCurrentStep(null);
        setTourHighlightTarget(null);
      }, 0);
    };

    const handleStepChange = (step) => {
      setTimeout(() => {
        setCurrentStep(step);
        if (step && steps.length > 0) {
          const configStep = steps.find(s => s.order === step.order);
          if (configStep) {
            setTourHighlightTarget(configStep.target);
            console.log(`[TourLog] selectedTab=${activeTab}, tourHighlightTarget=${configStep.target}, currentStep=${step.order}`);
          }
        } else {
          setTourHighlightTarget(null);
        }
      }, 0);
    };

    eventEmitter.on('start', handleStart);
    eventEmitter.on('stop', handleStop);
    eventEmitter.on('stepChange', handleStepChange);

    return () => {
      eventEmitter.off('start', handleStart);
      eventEmitter.off('stop', handleStop);
      eventEmitter.off('stepChange', handleStepChange);
    };
  }, [eventEmitter, steps, activeTab]);

  const startTour = useCallback(() => {
    if (canStart) {
      // Ensure the tour visually runs on the 'wlb' tab
      setActiveTab('wlb');

      requestAnimationFrame(() => {
        setTimeout(() => {
          start();
        }, 600);
      });
    }
  }, [canStart, start, setActiveTab]);

  const stopTour = useCallback(() => {
    if (typeof stop === 'function') {
      stop();
    }
  }, [stop]);

  return (
    <AppTourContext.Provider
      value={{
        isRunning,
        currentStep,
        steps,
        startTour,
        stopTour,
        canStart,
        pendingTourStart,
        setPendingTourStart,
        tourHighlightTarget,
      }}
    >
      {children}
    </AppTourContext.Provider>
  );
};

export const useAppTourContext = () => {
  const context = useContext(AppTourContext);
  if (!context) {
    throw new Error('useAppTour must be used within AppTourProvider');
  }
  return context;
};

export default AppTourContext;
