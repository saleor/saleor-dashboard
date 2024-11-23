import { initialOnboardingSteps } from "@dashboard/newHome/homeOnboarding/onboardingContext/initialOnboardingState";
import React, { useEffect } from "react";

import { OnboardingState, OnboardingStepsIDs } from "./types";

const getFirstExpanderStepId = (onboardingState: OnboardingState) => {
  const stepsExpandedEntries = Object.entries(onboardingState.stepsExpanded);

  return (stepsExpandedEntries.find(([_, value]) => value)?.[0] ?? "") as OnboardingStepsIDs;
};

export const getNextOnboardingStepId = (onboardingState: OnboardingState) => {
  return (
    initialOnboardingSteps
      .map(step => ({
        ...step,
        completed: onboardingState.stepsCompleted.includes(step.id),
        expanded: onboardingState.stepsExpanded[step.id],
      }))
      .filter(step => !step.completed && step.expanded !== false)[0]?.id ?? ""
  );
};

export const useExpandedOnboardingId = (onboardingState: OnboardingState, loaded: boolean) => {
  const hasBeenCalled = React.useRef(false);
  const [expandedStepId, setExpandedStepId] = React.useState<OnboardingStepsIDs | "">("");

  useEffect(() => {
    if (hasBeenCalled.current) {
      // After completing a step, set next expanded step
      setExpandedStepId(getNextOnboardingStepId(onboardingState));
    }
  }, [onboardingState.stepsCompleted]);

  useEffect(() => {
    if (hasBeenCalled.current) {
      // After toggle onboarding steps, set first expanded step from state
      setExpandedStepId(getFirstExpanderStepId(onboardingState));
    }
  }, [onboardingState.stepsExpanded]);

  useEffect(() => {
    // On context first load
    if (loaded && !hasBeenCalled.current) {
      hasBeenCalled.current = true;

      const firstExpandedStep = getFirstExpanderStepId(onboardingState);

      if (firstExpandedStep) {
        setExpandedStepId(firstExpandedStep);

        return;
      }

      setExpandedStepId(getNextOnboardingStepId(onboardingState));
    }
  }, [loaded, onboardingState]);

  return expandedStepId;
};
