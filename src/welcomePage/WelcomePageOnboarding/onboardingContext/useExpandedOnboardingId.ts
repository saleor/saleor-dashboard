import { useRef, useState, useEffect } from "react";

import { OnboardingState, OnboardingStepsIDs } from "./types";
import {
  getFirstExpanderStepId,
  getFirstNotCompletedAndNotExpandedStep,
  getNextStepToExpand,
} from "./utils";

export const useExpandedOnboardingId = (onboardingState: OnboardingState, loaded: boolean) => {
  const hasBeenCalled = useRef(false);
  const [expandedStepId, setExpandedStepId] = useState<OnboardingStepsIDs | "">("");

  useEffect(() => {
    if (hasBeenCalled.current) {
      const firstExpandedStepId = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStepId) {
        setExpandedStepId(getFirstExpanderStepId(onboardingState));
      } else {
        setExpandedStepId("");
      }
    }
  }, [onboardingState.stepsExpanded]);

  useEffect(() => {
    // On every state change
    if (hasBeenCalled.current) {
      setExpandedStepId(getNextStepToExpand(onboardingState));
    }
  }, [onboardingState.stepsCompleted]);

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
