import React, { useEffect } from "react";

import { OnboardingState, OnboardingStep, OnboardingStepsIDs } from "./types";
import {
  getFirstExpanderStepId,
  getFirstNotCompletedAndNotExpandedStep,
  getNextStepToExpand,
} from "./utils";

export const useExpandedOnboardingId = (
  onboardingState: OnboardingState,
  loaded: boolean,
  visibleSteps: OnboardingStep[],
) => {
  const hasBeenCalled = React.useRef(false);
  const [expandedStepId, setExpandedStepId] = React.useState<OnboardingStepsIDs | "">("");

  useEffect(() => {
    if (hasBeenCalled.current) {
      const firstExpandedStepId = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStepId) {
        setExpandedStepId(firstExpandedStepId);
      } else {
        setExpandedStepId(getFirstNotCompletedAndNotExpandedStep(onboardingState, visibleSteps));
      }
    }
  }, [onboardingState.stepsExpanded, visibleSteps]);

  useEffect(() => {
    // On every state change
    if (hasBeenCalled.current) {
      setExpandedStepId(getNextStepToExpand(onboardingState, visibleSteps));
    }
  }, [onboardingState.stepsCompleted, visibleSteps]);

  useEffect(() => {
    // On context first load
    if (loaded && !hasBeenCalled.current) {
      hasBeenCalled.current = true;

      const firstExpandedStep = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStep) {
        setExpandedStepId(firstExpandedStep);
      } else {
        setExpandedStepId(getFirstNotCompletedAndNotExpandedStep(onboardingState, visibleSteps));
      }
    }
  }, [loaded, onboardingState, visibleSteps]);

  return expandedStepId;
};
