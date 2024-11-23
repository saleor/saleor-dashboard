import {
  OnboardingState,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

export const handleStateChangeAfterStepCompleted = (
  state: OnboardingState,
  id: OnboardingStepsIDs,
) => {
  const newCompletedSteps = [...state.stepsCompleted];

  if (!newCompletedSteps.includes("get-started") && id !== "get-started") {
    newCompletedSteps.push("get-started");
  }

  newCompletedSteps.push(id);

  return {
    ...state,
    stepsCompleted: newCompletedSteps,
  };
};

export const handleStateChangeAfterToggle = (
  state: OnboardingState,
  expandedId: OnboardingStepsIDs,
  id: string,
) => {
  const stepsExpanded = { ...state.stepsExpanded };

  for (const key in stepsExpanded) {
    if (stepsExpanded[key as OnboardingStepsIDs]) {
      delete stepsExpanded[key as OnboardingStepsIDs];
    }
  }

  stepsExpanded[expandedId as OnboardingStepsIDs] = id !== "";

  return {
    ...state,
    stepsExpanded,
  };
};
