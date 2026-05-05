import { type MetadataInput } from "@dashboard/graphql";

import { type OnboardingMetadataState, type OnboardingStepsIDs } from "./types";

export const METADATA_KEY = "onboarding";

const cloneMetadata = (data: MetadataInput): MetadataInput => ({
  key: data.key,
  value: data.value,
});

const parseExistingState = (metadata: MetadataInput[] | undefined): OnboardingMetadataState => {
  const entry = metadata?.find(m => m.key === METADATA_KEY);

  if (!entry) {
    return { stepsCompleted: [] };
  }

  try {
    const parsed = JSON.parse(entry.value);

    return {
      stepsCompleted: Array.isArray(parsed?.stepsCompleted) ? parsed.stepsCompleted : [],
    };
  } catch {
    return { stepsCompleted: [] };
  }
};

export const appendCompletedStepToMetadata = (
  metadata: MetadataInput[] | undefined,
  stepId: OnboardingStepsIDs,
): { input: MetadataInput[]; changed: boolean } => {
  const existing = parseExistingState(metadata);

  if (existing.stepsCompleted.includes(stepId)) {
    return { input: metadata?.map(cloneMetadata) ?? [], changed: false };
  }

  const newState: OnboardingMetadataState = {
    ...existing,
    stepsCompleted: [...existing.stepsCompleted, stepId],
  };
  const newValue = JSON.stringify(newState);
  const userMetadata: MetadataInput[] = metadata?.map(cloneMetadata) ?? [];
  const index = userMetadata.findIndex(m => m.key === METADATA_KEY);

  if (index !== -1) {
    userMetadata[index] = { key: METADATA_KEY, value: newValue };
  } else {
    userMetadata.push({ key: METADATA_KEY, value: newValue });
  }

  return { input: userMetadata, changed: true };
};
