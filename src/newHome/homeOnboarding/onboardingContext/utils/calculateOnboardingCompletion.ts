import { TOTAL_STEPS_COUNT } from "@dashboard/newHome/homeOnboarding/onboardingContext/initialOnboardingState";
import { OnboardingState } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

export const calculateOnboardingCompletion = (steps: OnboardingState["steps"]) => {
  if (steps.length === TOTAL_STEPS_COUNT) {
    return steps.every(step => step.completed);
  }

  return false;
};
