import * as React from "react";

export type OnboardingStepsIDs =
  | "get-started"
  | "create-product"
  | "explore-orders"
  | "graphql-playground"
  | "view-webhooks"
  | "invite-staff";

export type OnboardingStep = {
  id: OnboardingStepsIDs;
  completed: boolean;
  expanded: boolean | undefined;
};

export type OnboardingState = {
  stepsCompleted: OnboardingStepsIDs[];
  stepsExpanded: Record<OnboardingStepsIDs, boolean>;
  onboardingExpanded: boolean;
};

export interface StorageService {
  getOnboardingState(): OnboardingState | undefined;
  saveOnboardingState(onboardingState: OnboardingState): Promise<void>;
}

export interface OnboardingContextType {
  isOnboardingCompleted: boolean;
  loading: boolean;
  extendedStepId: OnboardingStepsIDs | "";
  onboardingState: OnboardingState;
  markOnboardingStepAsCompleted: (id: OnboardingStepsIDs) => void;
  markAllAsCompleted: () => void;
  toggleExpandedOnboardingStep: (id: string, currentExpandedId: OnboardingStepsIDs | "") => void;
  toggleOnboarding: (value: boolean) => void;
}

export interface OnboardingProviderProps {
  children: React.ReactNode;
}
