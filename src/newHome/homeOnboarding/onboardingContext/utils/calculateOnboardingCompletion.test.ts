import { OnboardingStep } from "@dashboard/newHome/homeOnboarding/onboardingContext";

import { calculateOnboardingCompletion } from "./calculateOnboardingCompletion";

describe("calculateOnboardingCompletion", () => {
  it("should return true if all steps are completed", () => {
    // Arrange
    const steps = [
      {
        id: "step1",
        completed: true,
      },
      {
        id: "step2",
        completed: true,
      },
      {
        id: "step3",
        completed: true,
      },
      {
        id: "step4",
        completed: true,
      },
      {
        id: "step5",
        completed: true,
      },
      {
        id: "step6",
        completed: true,
      },
    ] as unknown as OnboardingStep[];

    // Act
    const result = calculateOnboardingCompletion(steps);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if not all steps are completed", () => {
    // Arrange
    const steps = [
      {
        id: "step1",
        completed: true,
      },
      {
        id: "step2",
        completed: false,
      },
      {
        id: "step3",
        completed: true,
      },
    ] as unknown as OnboardingStep[];

    // Act
    const result = calculateOnboardingCompletion(steps);

    // Assert
    expect(result).toBe(false);
  });
});
