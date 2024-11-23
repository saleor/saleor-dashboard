import { OnboardingState } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

import { handleStateChangeAfterStepCompleted, handleStateChangeAfterToggle } from "./utils";

describe("handleStateChangeAfterStepCompleted", () => {
  it("should add the step to the completed steps", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {},
    } as unknown as OnboardingState;
    const id = "get-started";

    // Act
    const newState = handleStateChangeAfterStepCompleted(state, id);

    // Assert
    expect(newState.stepsCompleted).toEqual(["get-started"]);
  });

  it("should add the step to the completed steps and add get-started if not already there", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {},
    } as unknown as OnboardingState;
    const id = "create-product";

    // Act
    const newState = handleStateChangeAfterStepCompleted(state, id);

    // Assert
    expect(newState.stepsCompleted).toEqual(["get-started", "create-product"]);
  });
});

describe("handleStateChangeAfterToggle", () => {
  it("should set the expanded step id", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {},
    } as unknown as OnboardingState;
    const expandedId = "get-started";
    const id = "get-started";

    // Act
    const newState = handleStateChangeAfterToggle(state, expandedId, id);

    // Assert
    expect(newState.stepsExpanded).toEqual({ "get-started": true });
  });

  it("should toggle expanded step", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: { "get-started": true },
    } as unknown as OnboardingState;
    const expandedId = "get-started";
    const id = "";

    // Act
    const newState = handleStateChangeAfterToggle(state, expandedId, id);

    // Assert
    expect(newState.stepsExpanded).toEqual({ "get-started": false });
  });

  it("should set the expanded step id and remove the previous one", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: { "get-started": true, "invite-staff": false },
    } as unknown as OnboardingState;
    const expandedId = "create-product";
    const id = "create-product";

    // Act
    const newState = handleStateChangeAfterToggle(state, expandedId, id);

    // Assert
    expect(newState.stepsExpanded).toEqual({ "create-product": true, "invite-staff": false });
  });
});
