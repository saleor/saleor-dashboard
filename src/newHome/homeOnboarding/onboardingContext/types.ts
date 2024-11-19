import React from "react";

export type OnboardingStepsIDs =
  | "get-started"
  | "create-product"
  | "explore-orders"
  | "graphql-playground"
  | "view-webhooks"
  | "invite-staff";

export type OnboardingState = Array<{
  id: OnboardingStepsIDs;
  completed: boolean;
  expanded: boolean | undefined;
}>;

export interface StorageService {
  getOnboardingState(): OnboardingState | undefined;
  saveOnboardingState(onboardingState: OnboardingState): void;
}

export interface OnboardingContextType {
  isOnboardingCompleted: boolean;
  loading: boolean;
  extendedStepId: OnboardingStepsIDs | "";
  onboardingState: OnboardingState;
  markOnboardingStepAsCompleted: (id: OnboardingStepsIDs) => void;
  markAllAsCompleted: () => void;
  toggleExpandedOnboardingStep: (id: string, currentExpandedId: OnboardingStepsIDs | "") => void;
}

export interface OnboardingProviderProps {
  children: React.ReactNode;
  storageService: StorageService;
}
