import { useAppTourContext } from '../context/AppTourProvider';

export const useAppTour = () => {
  const context = useAppTourContext();
  
  return {
    isRunning: context.isRunning,
    currentStep: context.currentStep,
    steps: context.steps,
    startTour: context.startTour,
    stopTour: context.stopTour,
    pendingTourStart: context.pendingTourStart,
    setPendingTourStart: context.setPendingTourStart,
    tourHighlightTarget: context.tourHighlightTarget,
  };
};

export default useAppTour;
