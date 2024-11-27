import { useUser } from "@dashboard/auth";
import { useSaveOnBoardingStateMutation } from "@dashboard/graphql";
import debounce from "lodash/debounce";
import { useCallback, useMemo } from "react";

import { OnboardingState, StorageService } from "../onboardingContext/types";
import { METADATA_KEY, prepareUserMetadata } from "./utils";

export const useOnboardingStorage = (): StorageService => {
  const { user } = useUser();
  const [saveOnboarding] = useSaveOnBoardingStateMutation({});

  const getOnboardingState: StorageService["getOnboardingState"] = () => {
    try {
      const metadata = user?.metadata.find(m => m.key === METADATA_KEY);

      if (!metadata) {
        return undefined;
      }

      return JSON.parse(metadata.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Could not get onboarding state from metadata", { error });

      return undefined;
    }
  };

  const saveOnboardingState: StorageService["saveOnboardingState"] = useCallback(
    async (onboardingState: OnboardingState) => {
      if (!user) {
        return;
      }

      try {
        const userMetadata = prepareUserMetadata(user?.metadata, onboardingState);

        await saveOnboarding({
          variables: {
            id: user.id,
            input: userMetadata,
          },
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Could not save onboarding state to metadata");
      }
    },
    [saveOnboarding, user],
  );

  const debouncedSaveOnboardingState = useMemo(
    () => debounce(saveOnboardingState, 1000),
    [saveOnboardingState],
  ) as StorageService["saveOnboardingState"];

  return {
    getOnboardingState,
    saveOnboardingState: debouncedSaveOnboardingState,
  };
};
