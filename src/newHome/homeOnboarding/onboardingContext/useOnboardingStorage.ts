import { useUser } from "@dashboard/auth";
import { useUpdateMetadataMutation } from "@dashboard/graphql";
import {
  OnboardingState,
  StorageService,
} from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

const METADATA_KEY = "onboarding";

export const useOnboardingStorage = (): StorageService => {
  const { user } = useUser();
  const [updateMetadata] = useUpdateMetadataMutation({});

  const getOnboardingState: StorageService["getOnboardingState"] = () => {
    try {
      const metadata = user?.metadata.find(m => m.key === METADATA_KEY);

      if (!metadata) {
        return undefined;
      }

      const parsed = JSON.parse(metadata.value);

      return parsed;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Could not get onboarding state from metadata", { error });

      return undefined;
    }
  };

  const saveOnboardingState: StorageService["saveOnboardingState"] = async (
    onboardingState: OnboardingState,
  ) => {
    if (!user) {
      return;
    }

    try {
      const userMetadata = [...(user?.metadata ?? [])];
      const metadataValue = JSON.stringify(onboardingState);
      const metadata = userMetadata.find(m => m.key === METADATA_KEY);

      if (metadata) {
        metadata.value = metadataValue;
      } else {
        userMetadata.push({ key: METADATA_KEY, value: metadataValue } as any);
      }

      await updateMetadata({
        variables: {
          id: user?.id ?? "",
          input: userMetadata,
          keysToDelete: [],
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Could not save onboarding state to metadata");
    }
  };

  return {
    getOnboardingState,
    saveOnboardingState,
  };
};
