import {
  OnboardingState,
  OnboardingStep,
} from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/types";

// We store state in metadata for all steps even these that are not shown to the user
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
    id: "view-extensions",
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

export const TOTAL_STEPS_COUNT = initialOnboardingSteps.length - 1; // we either show view-extensions or view-webhooks but not both

export const getInitialOnboardingState = (isNewUser: boolean): OnboardingState => {
  if (isNewUser) {
    return {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {} as OnboardingState["stepsExpanded"],
    };
  }

  return {
    onboardingExpanded: false,
    stepsCompleted: initialOnboardingSteps.map(step => step.id),
    stepsExpanded: {} as OnboardingState["stepsExpanded"],
  };
};
