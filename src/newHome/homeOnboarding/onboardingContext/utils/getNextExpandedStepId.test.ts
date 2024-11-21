import {
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext";

import { initialOnboardingSteps } from "../initialOnboardingState";
import { getNextExpandedStepId } from "./getNextExpandedStepId";

describe("getNextExpandedStepId", () => {
  it("should return the next step id to expand", () => {
    // Arrange
    const currentStepId = "get-started" as OnboardingStepsIDs;

    // Act
    const result = getNextExpandedStepId({
      currentStepId,
      initialOnboardingSteps,
    });

    // Assert
    expect(result).toBe("create-product");
  });

  it("should return an empty string if there is no next step to expand", () => {
    // Arrange
    const currentStepId = "step1" as OnboardingStepsIDs;
    const initialOnboardingSteps = [
      {
        id: "step1",
      },
      {
        id: "step2",
      },
      {
        id: "step3",
      },
    ] as unknown as OnboardingStep[];

    // Act
    const result = getNextExpandedStepId({
      currentStepId,
      initialOnboardingSteps,
    });

    // Assert
    expect(result).toBe("");
  });
});
