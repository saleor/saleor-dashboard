export type OnboardingStepsIDs =
  | "get-started"
  | "create-product"
  | "explore-orders"
  | "graphql-playground"
  | "view-extensions"
  | "invite-staff";

export interface OnboardingMetadataState {
  stepsCompleted: OnboardingStepsIDs[];
}

export interface OnboardingContextType {
  markOnboardingStepAsCompleted: (id: OnboardingStepsIDs) => void;
}
