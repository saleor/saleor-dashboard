import React from "react";

import { useNewUserCheck } from "../hooks/useNewUserCheck";
import { getInitialOnboardingState, initialOnboardingSteps } from "./initialOnboardingState";
import {
  OnboardingContextType,
  OnboardingProviderProps,
  OnboardingState,
  OnboardingStepsIDs,
} from "./types";
import { useExpandedOnboardingId } from "./useExpandedOnboardingId";
import { calculateOnboardingCompletion } from "./utils/calculateOnboardingCompletion";
import {
  addCompletedStep,
  addGetStartedStepIfNotPresent,
  addNextStep,
  toggleStepExpand,
} from "./utils/stepsModification";

const OnboardingContext = React.createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children, storageService }: OnboardingProviderProps) => {
  const [onboardingState, setOnboardingState] = React.useState<OnboardingState>({
    onboardingExpanded: true,
    steps: [],
  });
  const [loaded, setLoaded] = React.useState(false);
  const { isNewUser, isUserLoading } = useNewUserCheck();

  React.useEffect(() => {
    if (loaded || isUserLoading) return;

    const onboardingStateLS = storageService.getOnboardingState();

    // When first time load there is not data in local storage, so use initial state
    if (!onboardingStateLS) {
      setOnboardingState(getInitialOnboardingState(isNewUser));
    } else {
      setOnboardingState(onboardingStateLS);
    }

    setLoaded(true);
  }, [isNewUser, isUserLoading, loaded, storageService]);

  React.useEffect(() => {
    if (onboardingState.steps.length > 0) {
      storageService.saveOnboardingState(onboardingState);
    }
  }, [onboardingState, storageService]);

  // For old users, onboarding is always completed, for new one we need to calculate it
  const isOnboardingCompleted = isNewUser
    ? calculateOnboardingCompletion(onboardingState.steps)
    : true;

  const extendedStepId = useExpandedOnboardingId(onboardingState, loaded);

  const markOnboardingStepAsCompleted = (id: OnboardingStepsIDs) => {
    setOnboardingState(prevOnboardingState => {
      const newSteps = [...prevOnboardingState.steps];

      const stepsWithGetStarted = addGetStartedStepIfNotPresent(id, newSteps);
      const stepsWithCompleted = addCompletedStep(id, stepsWithGetStarted);
      const stepsWithNextStep = addNextStep(id, stepsWithCompleted);

      return {
        ...prevOnboardingState,
        steps: stepsWithNextStep,
      };
    });
  };

  const markAllAsCompleted = () => {
    setOnboardingState(prevOnboardingState => ({
      ...prevOnboardingState,
      steps: initialOnboardingSteps.map(step => ({ ...step, completed: true, expanded: false })),
    }));
  };

  // In case accordion collapse, we get empty string as id and I need current expanded id to toggle it
  const toggleExpandedOnboardingStep = (id: string, currentExpandedId: OnboardingStepsIDs | "") => {
    // In case that step was collapse we get empty string as id
    const expandedId = id || currentExpandedId;

    setOnboardingState(prev => {
      const steps = [...prev.steps];

      const stepsWithToggledStep = toggleStepExpand({
        id: expandedId as OnboardingStepsIDs,
        steps,
        // We used to detect that when a step has been expanded or collapsed
        hasBeenOpened: id !== "",
      });

      return {
        ...prev,
        steps: stepsWithToggledStep,
      };
    });
  };

  const toggleOnboarding = (value: boolean) => {
    setOnboardingState(prev => {
      const newState = {
        ...prev,
        onboardingExpanded: value,
      };

      storageService.saveOnboardingState(newState);

      return newState;
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingCompleted,
        onboardingState,
        extendedStepId,
        loading: !loaded,
        markOnboardingStepAsCompleted,
        markAllAsCompleted,
        toggleExpandedOnboardingStep,
        toggleOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = React.useContext(OnboardingContext);

  if (context === null) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }

  return context;
};
