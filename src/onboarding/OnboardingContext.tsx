import { createContext, type ReactNode, useContext, useMemo } from "react";

import { type OnboardingContextType, type OnboardingStepsIDs } from "./types";
import { useOnboardingStorage } from "./useOnboardingStorage";

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const { markStepCompleted } = useOnboardingStorage();

  const value = useMemo<OnboardingContextType>(
    () => ({
      markOnboardingStepAsCompleted: (id: OnboardingStepsIDs) => {
        void markStepCompleted(id);
      },
    }),
    [markStepCompleted],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (context === null) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }

  return context;
};
