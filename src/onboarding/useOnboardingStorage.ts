import { useUser } from "@dashboard/auth/useUser";
import { useSaveOnBoardingStateMutation } from "@dashboard/graphql";
import { useCallback } from "react";

import { type OnboardingStepsIDs } from "./types";
import { appendCompletedStepToMetadata } from "./utils";

export const useOnboardingStorage = () => {
  const { user } = useUser();
  const [saveOnboarding] = useSaveOnBoardingStateMutation();

  const markStepCompleted = useCallback(
    async (stepId: OnboardingStepsIDs) => {
      if (!user) {
        return;
      }

      const { input, changed } = appendCompletedStepToMetadata(user.metadata, stepId);

      if (!changed) {
        return;
      }

      try {
        await saveOnboarding({
          variables: {
            id: user.id,
            input,
          },
        });
      } catch (error) {
        console.warn("Could not save onboarding state to metadata", { error });
      }
    },
    [saveOnboarding, user],
  );

  return { markStepCompleted };
};
