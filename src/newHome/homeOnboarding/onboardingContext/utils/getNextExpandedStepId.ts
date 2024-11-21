import {
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext";

export const getNextExpandedStepId = ({
  currentStepId,
  initialOnboardingSteps,
}: {
  currentStepId: OnboardingStepsIDs;
  initialOnboardingSteps: OnboardingStep[];
}) => {
  const currentStepIndex = initialOnboardingSteps.findIndex(step => step.id === currentStepId);

  const nextStepToExpand = initialOnboardingSteps.find((step, index) => {
    return index > currentStepIndex && !step.completed;
  });

  if (nextStepToExpand) {
    return nextStepToExpand.id;
  }

  return "";
};
