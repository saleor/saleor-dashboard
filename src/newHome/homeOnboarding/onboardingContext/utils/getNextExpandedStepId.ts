import {
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext";

export const getNextExpandedStepId = ({
  currentStepId,
  initialOnboardingSteps,
  onboardingSteps,
}: {
  currentStepId: OnboardingStepsIDs;
  initialOnboardingSteps: OnboardingStep[];
  onboardingSteps: OnboardingStep[];
}) => {
  const currentStepIndex = initialOnboardingSteps.findIndex(step => step.id === currentStepId);

  const nextStepsToExpand = initialOnboardingSteps.filter((_, index) => index > currentStepIndex);
  const combinedSteps = nextStepsToExpand.map(initStep => {
    const step = onboardingSteps.find(step => step.id === initStep.id);

    return {
      ...initStep,
      ...step,
    };
  });
  const nextStepToExpand = combinedSteps.find(step => !step.completed);

  if (nextStepToExpand) {
    return nextStepToExpand.id;
  }

  return "";
};
