import {
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/newHome/homeOnboarding/onboardingContext";

import { getNextExpandedStepId } from "./getNextExpandedStepId";
import {
  addCompletedStep,
  addGetStartedStepIfNotPresent,
  addNextStep,
  toggleStepExpand,
} from "./stepsModification";

jest.mock("./getNextExpandedStepId");

describe("stepsModification", () => {
  describe("toggleStepExpand", () => {
    it("should change toggled step to expanded  and rest as not expanded", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: true, expanded: undefined },
        { id: "step2", completed: false, expanded: undefined },
        { id: "step3", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = toggleStepExpand(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: true, expanded: false },
        { id: "step2", completed: false, expanded: true },
        { id: "step3", completed: false, expanded: false },
      ]);
    });

    it("should change toggled step to unexpanded when as expanded  and rest as not expanded", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: true, expanded: undefined },
        { id: "step2", completed: false, expanded: true },
        { id: "step3", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = toggleStepExpand(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: true, expanded: false },
        { id: "step2", completed: false, expanded: false },
        { id: "step3", completed: false, expanded: false },
      ]);
    });

    it("should add toggled step and change rest as not expanded", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: true, expanded: undefined },
        { id: "step2", completed: false, expanded: true },
      ] as unknown as OnboardingStep[];
      const id = "step3" as OnboardingStepsIDs;

      // Act
      const result = toggleStepExpand(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: true, expanded: false },
        { id: "step2", completed: false, expanded: false },
        { id: "step3", completed: false, expanded: true },
      ]);
    });
  });

  describe("addCompletedStep", () => {
    it("should change completed step to completed", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: false, expanded: undefined },
        { id: "step2", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = addCompletedStep(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: false, expanded: undefined },
        { id: "step2", completed: true, expanded: false },
      ]);
    });

    it("should add new completed step if not exists", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = addCompletedStep(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: false, expanded: undefined },
        { id: "step2", completed: true, expanded: false },
      ]);
    });
  });

  describe("addNextStep", () => {
    it("should change next step to expanded and rest as not expanded", () => {
      // Arrange
      (getNextExpandedStepId as jest.Mock).mockImplementation(() => "create-product");

      const steps = [
        { id: "get-started", completed: true, expanded: undefined },
        { id: "create-product", completed: false, expanded: undefined },
        { id: "explore-orders", completed: false, expanded: undefined },
      ] as OnboardingStep[];
      const id = "get-started" as OnboardingStepsIDs;

      // Act
      const result = addNextStep(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "get-started", completed: true, expanded: undefined },
        { id: "create-product", completed: false, expanded: true },
        { id: "explore-orders", completed: false, expanded: undefined },
      ]);
    });

    it("should add next step and change rest as not expanded", () => {
      // Arrange
      (getNextExpandedStepId as jest.Mock).mockImplementation(() => "explore-orders");

      const steps = [
        { id: "get-started", completed: true, expanded: false },
        { id: "create-product", completed: true, expanded: false },
      ] as unknown as OnboardingStep[];
      const id = "create-product" as OnboardingStepsIDs;

      // Act
      const result = addNextStep(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "get-started", completed: true, expanded: false },
        { id: "create-product", completed: true, expanded: false },
        { id: "explore-orders", completed: false, expanded: true },
      ]);
    });
  });

  describe("addGetStartedStepIfNotPresent", () => {
    it("should add get started step if not present", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: false, expanded: undefined },
        { id: "step2", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = addGetStartedStepIfNotPresent(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: false, expanded: undefined },
        { id: "step2", completed: false, expanded: undefined },
        { id: "get-started", completed: true, expanded: undefined },
      ]);
    });

    it("should not add get started step if already present", () => {
      // Arrange
      const steps = [
        { id: "step1", completed: false, expanded: undefined },
        { id: "get-started", completed: false, expanded: undefined },
      ] as unknown as OnboardingStep[];
      const id = "step2" as OnboardingStepsIDs;

      // Act
      const result = addGetStartedStepIfNotPresent(id, steps);

      // Assert
      expect(result).toEqual([
        { id: "step1", completed: false, expanded: undefined },
        { id: "get-started", completed: false, expanded: undefined },
      ]);
    });
  });
});
