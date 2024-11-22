import { OnboardingStep } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

export const initialOnboardingSteps: OnboardingStep[] = [
  {
    id: "get-started",
    completed: false,
    expanded: undefined,
  },
  {
    id: "create-product",
    completed: false,
    expanded: undefined,
  },
  {
    id: "explore-orders",
    completed: false,
    expanded: undefined,
  },
  {
    id: "graphql-playground",
    completed: false,
    expanded: undefined,
  },
  {
    id: "view-webhooks",
    completed: false,
    expanded: undefined,
  },
  {
    id: "invite-staff",
    completed: false,
    expanded: undefined,
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
