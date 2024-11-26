import { useUser } from "@dashboard/auth";
import { MetadataInput, useUpdateUserMetadataMutation } from "@dashboard/graphql";
import {
  OnboardingState,
  StorageService,
} from "@dashboard/newHome/homeOnboarding/onboardingContext/types";
import debounce from "lodash/debounce";
import { useCallback, useMemo } from "react";

const METADATA_KEY = "onboarding";

export const useOnboardingStorage = (): StorageService => {
  const { user } = useUser();
  const [updateMetadata] = useUpdateUserMetadataMutation({});

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
        const userMetadata: MetadataInput[] =
          user?.metadata?.map(data => ({
            key: data.key,
            value: data.value,
          })) ?? [];
        const metadataValue = JSON.stringify(onboardingState);
        const metadataIndex = userMetadata.findIndex(m => m.key === METADATA_KEY);

        if (metadataIndex !== -1) {
          userMetadata[metadataIndex] = {
            key: METADATA_KEY,
            value: metadataValue,
          };
        } else {
          userMetadata.push({
            key: METADATA_KEY,
            value: metadataValue,
          });
        }

        await updateMetadata({
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
    [updateMetadata, user],
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
