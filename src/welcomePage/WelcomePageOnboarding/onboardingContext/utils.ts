import { MetadataInput } from "@dashboard/graphql";

import { OnboardingState, OnboardingStep, OnboardingStepsIDs } from "./types";

// Helper functions
const cloneMetadata = (data: MetadataInput): MetadataInput => ({
  key: data.key,
  value: data.value,
});

const byKey = (keyToFind: string) => (metadataItem: { key: string }) =>
  metadataItem.key === keyToFind;

const isEntryValueTrue = ([_id, value]: [string, boolean]): boolean => value;

const toStepWithClientState =
  (state: OnboardingState) =>
  (
    step: OnboardingStep,
  ): OnboardingStep & { completed: boolean; expanded: boolean | undefined } => ({
    ...step,
    completed: state.stepsCompleted.includes(step.id),
    expanded: state.stepsExpanded[step.id],
  });

const isStepNotCompletedAndNotCollapsed = (step: {
  completed: boolean;
  expanded: boolean | undefined;
}): boolean => !step.completed && step.expanded !== false;

const byStepId =
  (idToFind: OnboardingStepsIDs) =>
  (step: { id: OnboardingStepsIDs }): boolean =>
    step.id === idToFind;

export const handleStateChangeAfterStepCompleted = (
  state: OnboardingState,
  id: OnboardingStepsIDs,
): OnboardingState => {
  const newCompletedSteps = [...state.stepsCompleted];
  const stepsExpanded = { ...state.stepsExpanded };

  if (!newCompletedSteps.includes("get-started") && id !== "get-started") {
    newCompletedSteps.push("get-started");
  }

  newCompletedSteps.push(id);

  if (stepsExpanded[id]) {
    delete stepsExpanded[id];
  }

  return {
    ...state,
    stepsExpanded,
    stepsCompleted: newCompletedSteps,
  };
};

export const handleStateChangeAfterToggle = (
  state: OnboardingState,
  expandedId: OnboardingStepsIDs,
  id: string,
): OnboardingState => {
  const stepsExpanded = { ...state.stepsExpanded };

  for (const key in stepsExpanded) {
    if (stepsExpanded[key as OnboardingStepsIDs]) {
      delete stepsExpanded[key as OnboardingStepsIDs];
    }
  }

  stepsExpanded[expandedId as OnboardingStepsIDs] = id !== "";

  return {
    ...state,
    stepsExpanded,
  };
};

export const getFirstExpanderStepId = (onboardingState: OnboardingState) => {
  const stepsExpandedEntries = Object.entries(onboardingState.stepsExpanded);

  return (stepsExpandedEntries.find(isEntryValueTrue)?.[0] ?? "") as OnboardingStepsIDs;
};

export const getFirstNotCompletedAndNotExpandedStep = (
  onboardingState: OnboardingState,
  visibleSteps: OnboardingStep[],
): OnboardingStepsIDs | "" => {
  const stepsWithState = visibleSteps.map(toStepWithClientState(onboardingState));

  return stepsWithState.find(isStepNotCompletedAndNotCollapsed)?.id ?? "";
};

export const getNextStepToExpand = (
  onboardingState: OnboardingState,
  visibleSteps: OnboardingStep[],
): OnboardingStepsIDs | "" => {
  const lastCompletedStepId =
    onboardingState.stepsCompleted[onboardingState.stepsCompleted.length - 1];

  const stepsWithState = visibleSteps.map(toStepWithClientState(onboardingState));

  const stepIndex = stepsWithState.findIndex(byStepId(lastCompletedStepId));

  if (stepIndex === -1 || stepIndex === stepsWithState.length - 1) {
    return "";
  }

  return stepsWithState.slice(stepIndex + 1).find(isStepNotCompletedAndNotCollapsed)?.id ?? "";
};

export const METADATA_KEY = "onboarding";

export const prepareUserMetadata = (
  metadata: MetadataInput[] | undefined,
  onboardingState: OnboardingState,
) => {
  const userMetadata: MetadataInput[] = metadata?.map(cloneMetadata) ?? [];
  const metadataValue = JSON.stringify(onboardingState);
  const metadataIndex = userMetadata.findIndex(byKey(METADATA_KEY));

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

  return userMetadata;
};
