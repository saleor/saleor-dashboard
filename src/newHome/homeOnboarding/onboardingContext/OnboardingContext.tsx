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
import { getNextExpandedStepId } from "./utils/getNextExpandedStepId";

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

  const isOnboardingCompleted = isNewUser
    ? calculateOnboardingCompletion(onboardingState.steps)
    : true;

  const extendedStepId = useExpandedOnboardingId(onboardingState, loaded);

  const isStepInState = (id: OnboardingStepsIDs) => {
    return !!onboardingState.steps.find(step => step.id === id);
  };

  const markOnboardingStepAsCompleted = (id: OnboardingStepsIDs) => {
    setOnboardingState(prevOnboardingState => {
      const newSteps = [...prevOnboardingState.steps];
      const hasWelcomeStep = prevOnboardingState.steps.some(step => step.id === "get-started");

      if (!hasWelcomeStep && id !== "get-started") {
        newSteps.push({ id: "get-started", completed: true, expanded: undefined });
      }

      if (isStepInState(id)) {
        newSteps.map(step => {
          if (step.id === id) {
            step.completed = true;
            step.expanded = undefined;
          }

          return step;
        });
      } else {
        newSteps.push({ id, completed: true, expanded: undefined });
      }

      const nextExpandedStepId = getNextExpandedStepId({
        currentStepId: id,
        initialOnboardingSteps,
      });

      if (nextExpandedStepId) {
        if (isStepInState(nextExpandedStepId)) {
          newSteps.map(step => {
            if (step.id === nextExpandedStepId) {
              step.expanded = true;
            }

            return step;
          });
        } else {
          newSteps.push({ id: nextExpandedStepId, completed: false, expanded: true });
        }
      }

      return {
        ...prevOnboardingState,
        steps: newSteps,
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
      const stepIndex = steps.findIndex(step => step.id === expandedId);

      if (stepIndex === -1) {
        // Step not found, add it with expanded true
        steps.push({ id: expandedId as OnboardingStepsIDs, completed: false, expanded: true });
      } else {
        // Step found, toggle its expanded state
        steps[stepIndex].expanded = !steps[stepIndex].expanded;
      }

      // Mark rest of steps as not expanded
      return {
        ...prev,
        steps: steps.map(step => {
          if (step.id !== expandedId) {
            return {
              ...step,
              expanded: false,
            };
          }

          return step;
        }),
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
