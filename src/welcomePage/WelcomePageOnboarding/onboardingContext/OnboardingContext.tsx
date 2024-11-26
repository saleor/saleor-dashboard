import {
  handleStateChangeAfterStepCompleted,
  handleStateChangeAfterToggle,
} from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/utils";
import React from "react";

import { useNewUserCheck } from "../hooks/useNewUserCheck";
import {
  getInitialOnboardingState,
  initialOnboardingSteps,
  TOTAL_STEPS_COUNT,
} from "./initialOnboardingState";
import {
  OnboardingContextType,
  OnboardingProviderProps,
  OnboardingState,
  OnboardingStepsIDs,
} from "./types";
import { useExpandedOnboardingId } from "./useExpandedOnboardingId";

const OnboardingContext = React.createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children, storageService }: OnboardingProviderProps) => {
  const [onboardingState, setOnboardingState] = React.useState<OnboardingState>({
    onboardingExpanded: true,
    stepsCompleted: [],
    stepsExpanded: {} as OnboardingState["stepsExpanded"],
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
    if (loaded) {
      storageService.saveOnboardingState(onboardingState);
    }
  }, [loaded, onboardingState, storageService]);

  // For old users, onboarding is always completed, for new one we need to calculate it
  const isOnboardingCompleted = isNewUser
    ? onboardingState.stepsCompleted.length === TOTAL_STEPS_COUNT
    : true;

  const extendedStepId = useExpandedOnboardingId(onboardingState, loaded);

  const markOnboardingStepAsCompleted = (id: OnboardingStepsIDs) => {
    setOnboardingState(prevOnboardingState =>
      handleStateChangeAfterStepCompleted(prevOnboardingState, id),
    );
  };

  const markAllAsCompleted = () => {
    setOnboardingState(prevOnboardingState => ({
      ...prevOnboardingState,
      stepsCompleted: initialOnboardingSteps.map(step => step.id),
      stepsExpanded: {} as OnboardingState["stepsExpanded"],
    }));
  };

  // In case accordion collapse, we get empty string as id and I need current expanded id to toggle it
  const toggleExpandedOnboardingStep = (id: string, currentExpandedId: OnboardingStepsIDs | "") => {
    // In case that step was collapse we get empty string as id
    const expandedId = id || currentExpandedId;

    setOnboardingState(prev =>
      handleStateChangeAfterToggle(prev, expandedId as OnboardingStepsIDs, id),
    );
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
