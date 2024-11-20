import React from "react";

import { OnboardingState } from "./types";

export const useExpandedOnboardingId = (onboardingState: OnboardingState, loaded: boolean) => {
  const hasBeenCall = React.useRef(false);

  const allExpandedSteps = onboardingState.steps.filter(step => step.expanded);
  const extendedStepId = allExpandedSteps.length ? allExpandedSteps[0].id : "";

  if (extendedStepId) {
    return extendedStepId;
  }

  if (loaded && !hasBeenCall.current) {
    hasBeenCall.current = true;

    return (
      onboardingState.steps.find(step => !step.completed && step.expanded === undefined)?.id ?? ""
    );
  }

  return "";
};
