import { initialOnboardingSteps } from "@dashboard/newHome/homeOnboarding/onboardingContext/initialOnboardingState";
import React, { useEffect } from "react";

import { OnboardingState, OnboardingStep, OnboardingStepsIDs } from "./types";

const getFirstExpandedStep = (onboardingState: OnboardingState) => {
  return onboardingState.steps.find(step => step.expanded);
};

const createFilterByNotCompletedAndNotExpandedSteps =
  (onboardingState: OnboardingState) => (step: OnboardingStep) => {
    const onboardingStep = onboardingState.steps.find(s => s.id === step.id);

    if (onboardingStep) {
      return !onboardingStep.completed && onboardingStep.expanded !== false;
    }

    return true;
  };

export const useExpandedOnboardingId = (onboardingState: OnboardingState, loaded: boolean) => {
  const hasBeenCalled = React.useRef(false);
  const [expandedStepId, setExpandedStepId] = React.useState<OnboardingStepsIDs | "">("");

  useEffect(() => {
    if (hasBeenCalled.current) {
      const firstExpandedStep = getFirstExpandedStep(onboardingState);

      if (firstExpandedStep) {
        setExpandedStepId(firstExpandedStep.id);
      } else {
        setExpandedStepId("");
      }
    }
  }, [loaded, onboardingState, onboardingState.steps]);

  useEffect(() => {
    if (loaded && !hasBeenCalled.current) {
      hasBeenCalled.current = true;

      const firstExpandedStep = getFirstExpandedStep(onboardingState);

      if (firstExpandedStep) {
        setExpandedStepId(firstExpandedStep.id);

        return;
      }

      const steps = initialOnboardingSteps.filter(
        createFilterByNotCompletedAndNotExpandedSteps(onboardingState),
      );

      setExpandedStepId(steps[0]?.id ?? "");
    }
  }, [loaded, onboardingState, onboardingState.steps]);

  return expandedStepId;
};
