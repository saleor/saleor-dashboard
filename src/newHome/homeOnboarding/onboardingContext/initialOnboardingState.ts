import { OnboardingStep } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

export const initialOnboardingSteps: OnboardingStep[] = [
  {
    id: "get-started",
    completed: false,
    expanded: false,
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
];

export const TOTAL_STEPS_COUNT = initialOnboardingSteps.length;

export const getInitialOnboardingState = (isNewUser: boolean) => {
  if (isNewUser) {
    return {
      onboardingExpanded: true,
      steps: [],
    };
  }

  return {
    onboardingExpanded: false,
    steps: initialOnboardingSteps.map(step => ({
      ...step,
      completed: true,
    })),
  };
};
