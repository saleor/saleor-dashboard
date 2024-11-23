import {
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext";

import { initialOnboardingSteps } from "../initialOnboardingState";
import { getNextExpandedStepId } from "./getNextExpandedStepId";

export const addGetStartedStepIfNotPresent = (
  id: OnboardingStepsIDs,
  steps: OnboardingStep[],
): OnboardingStep[] => {
  const hasWelcomeStep = steps.find(step => step.id === "get-started");

  if (!hasWelcomeStep && id !== "get-started") {
    return [...steps, { id: "get-started", completed: true, expanded: undefined }];
  }

  return steps;
};

export const addCompletedStep = (
  id: OnboardingStepsIDs,
  steps: OnboardingStep[],
): OnboardingStep[] => {
  const hasStepInState = steps.find(step => step.id === id);

  if (hasStepInState) {
    return steps.map(step => {
      if (step.id === id) {
        step.completed = true;
        step.expanded = false;
      }

      return step;
    });
  } else {
    return [...steps, { id, completed: true, expanded: false }];
  }
};

export const addNextStep = (id: OnboardingStepsIDs, steps: OnboardingStep[]): OnboardingStep[] => {
  const nextExpandedStepId = getNextExpandedStepId({
    currentStepId: id,
    initialOnboardingSteps,
    onboardingSteps: steps,
  });

  if (nextExpandedStepId) {
    const hasStepInState = steps.find(step => step.id === nextExpandedStepId);

    if (hasStepInState) {
      return steps.map(step => {
        if (step.id === nextExpandedStepId) {
          step.expanded = true;
        }

        return step;
      });
    } else {
      return [...steps, { id: nextExpandedStepId, completed: false, expanded: true }];
    }
  }

  return steps;
};

export const toggleStepExpand = ({
  id,
  steps,
  hasBeenOpened,
}: {
  id: OnboardingStepsIDs;
  steps: OnboardingStep[];
  hasBeenOpened: boolean;
}) => {
  const stepIndex = steps.findIndex(step => step.id === id);
  const unexpandedSteps = steps.map(step => ({ ...step, expanded: false }));

  if (stepIndex === -1) {
    // Step not found, toggle expanded base on if was opened or not
    return [...unexpandedSteps, { id, completed: false, expanded: hasBeenOpened }];
  } else {
    // Step found, toggle its expanded state
    return steps.map(step => {
      if (step.id === id) {
        return { ...step, expanded: !step.expanded };
      }

      return { ...step, expanded: false };
    });
  }
};
