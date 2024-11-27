import { MetadataInput } from "@dashboard/graphql";

import { initialOnboardingSteps } from "./initialOnboardingState";
import { OnboardingState, OnboardingStepsIDs } from "./types";

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

  return (stepsExpandedEntries.find(([_, value]) => value)?.[0] ?? "") as OnboardingStepsIDs;
};

export const mapInitialStepsWithState = (onboardingState: OnboardingState) =>
  [...initialOnboardingSteps].map(step => ({
    ...step,
    completed: onboardingState.stepsCompleted.includes(step.id),
    expanded: onboardingState.stepsExpanded[step.id],
  }));

export const getFirstNotCompletedAndNotExpandedStep = (onboardingState: OnboardingState) => {
  return (
    mapInitialStepsWithState(onboardingState).filter(
      step => !step.completed && step.expanded !== false,
    )[0]?.id ?? ""
  );
};

export const getNextStepToExpand = (onboardingState: OnboardingState) => {
  const lastCompletedStepId =
    onboardingState.stepsCompleted[onboardingState.stepsCompleted.length - 1];
  const steps = mapInitialStepsWithState(onboardingState);
  const stepIndex = steps.findIndex(step => step.id === lastCompletedStepId);

  return (
    steps.slice(stepIndex + 1).find(step => !step.completed && step.expanded !== false)?.id ?? ""
  );
};

export const METADATA_KEY = "onboarding";

export const prepareUserMetadata = (
  metadata: MetadataInput[] | undefined,
  onboardingState: OnboardingState,
) => {
  const userMetadata: MetadataInput[] =
    metadata?.map(data => ({
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

  return userMetadata;
};
