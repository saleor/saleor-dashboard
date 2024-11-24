import React, { useEffect } from "react";

import { OnboardingState, OnboardingStepsIDs } from "./types";
import {
  getFirstExpanderStepId,
  getFirstNotCompletedAndNotExpandedStep,
  getNextStepToExpand,
} from "./utils";

export const useExpandedOnboardingId = (onboardingState: OnboardingState, loaded: boolean) => {
  const hasBeenCalled = React.useRef(false);
  const [expandedStepId, setExpandedStepId] = React.useState<OnboardingStepsIDs | "">("");

  useEffect(() => {
    // On every state change
    if (hasBeenCalled.current) {
      const firstExpandedStepId = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStepId) {
        setExpandedStepId(getFirstExpanderStepId(onboardingState));
      } else {
        setExpandedStepId(getNextStepToExpand(onboardingState));
      }
    }
  }, [onboardingState]);

  useEffect(() => {
    // On context first load
    if (loaded && !hasBeenCalled.current) {
      hasBeenCalled.current = true;

      const firstExpandedStep = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStep) {
        setExpandedStepId(firstExpandedStep);
      } else {
        setExpandedStepId(getFirstNotCompletedAndNotExpandedStep(onboardingState));
      }
    }
  }, [loaded, onboardingState]);

  return expandedStepId;
};
