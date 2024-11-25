import { useOnboardingStorage } from "@dashboard/newHome/homeOnboarding/onboardingContext/useOnboardingStorage";
import React from "react";

import {
  OnboardingContextType,
  OnboardingProviderProps,
  OnboardingState,
  OnboardingStepsIDs,
} from "./types";
import { useExpandedOnboardingId } from "./useExpandedOnboardingId";

const OnboardingContext = React.createContext<OnboardingContextType | null>(null);

const initialOnboardingState: OnboardingState = {
  steps: [
    {
      id: "get-started",
      completed: false,
      expanded: true,
    },
    {
      id: "create-product",
      completed: false,
      expanded: false,
    },
    {
      id: "explore-orders",
      completed: false,
      expanded: false,
    },
    {
      id: "graphql-playground",
      completed: false,
      expanded: false,
    },
    {
      id: "view-webhooks",
      completed: false,
      expanded: false,
    },
    {
      id: "invite-staff",
      completed: false,
      expanded: false,
    },
  ],
  onboardingExpanded: true,
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [onboardingState, setOnboardingState] =
    React.useState<OnboardingState>(initialOnboardingState);
  const [loaded, setLoaded] = React.useState(false);

  const storageService = useOnboardingStorage();

  React.useEffect(() => {
    if (loaded) return;

    const onboardingStateLS = storageService.getOnboardingState();

    // When first time load there is not data in local storage, so use initial state
    if (!onboardingStateLS) {
      setOnboardingState(initialOnboardingState);
      setLoaded(true);

      return;
    }

    if (!onboardingStateLS) {
      return;
    }

    setOnboardingState(onboardingStateLS);
    setLoaded(true);
  }, [loaded, storageService]);

  React.useEffect(() => {
    storageService.saveOnboardingState(onboardingState);
  }, [onboardingState]);

  const isOnboardingCompleted = onboardingState.steps.every(step => step.completed);

  const extendedStepId = useExpandedOnboardingId(onboardingState, loaded);

  const markOnboardingStepAsCompleted = (id: OnboardingStepsIDs) => {
    setOnboardingState(({ steps, ...rest }) => {
      const findIndex = steps.findIndex(step => step.id === id);
      const findNextToExpand = steps.find((step, index) => index > findIndex && !step.completed);

      const newSteps = steps.map(step => {
        const isNextToExpand = findNextToExpand?.id === step.id;

        if (isNextToExpand) {
          return {
            ...step,
            expanded: true,
          };
        }

        // Always mark get-started as completed when complete other steps
        if (step.id === "get-started") {
          return {
            ...step,
            completed: true,
            expanded: false,
          };
        }

        return {
          ...step,
          completed: step.id === id ? true : step.completed,
          expanded: step.id === id ? false : step.expanded,
        };
      });

      return {
        ...rest,
        steps: newSteps,
      };
    });
  };

  const markAllAsCompleted = () => {
    setOnboardingState(prev => ({
      ...prev,
      steps: prev.steps.map(step => ({ ...step, completed: true, expanded: false })),
    }));
  };

  // In case accordion collapse, we get empty string as id and I need current expanded id to toggle it
  const toggleExpandedOnboardingStep = (id: string, currentExpandedId: OnboardingStepsIDs | "") => {
    // In case that step was collapse we get empty string as id
    const expandedId = id || currentExpandedId;

    setOnboardingState(prev => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === expandedId) {
          return {
            ...step,
            expanded: !step.expanded,
          };
        }

        return {
          ...step,
          expanded: false,
        };
      }),
    }));
  };

  const toggleOnboarding = (value: boolean) => {
    setOnboardingState(prev => ({
      ...prev,
      onboardingExpanded: value,
    }));
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
