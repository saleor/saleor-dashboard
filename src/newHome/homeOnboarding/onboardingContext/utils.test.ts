import { OnboardingState } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";

import {
  getFirstExpanderStepId,
  getFirstNotCompletedAndNotExpandedStep,
  getNextStepToExpand,
  handleStateChangeAfterStepCompleted,
  handleStateChangeAfterToggle,
  mapInitialStepsWithState,
} from "./utils";

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

describe("getFirstExpanderStepId", () => {
  it("should return the first expanded step id", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started"],
      stepsExpanded: {
        "create-product": true,
      },
    } as OnboardingState;

    // Act
    const firstExpandedStepId = getFirstExpanderStepId(onboardingState);

    // Assert
    expect(firstExpandedStepId).toBe("create-product");
  });

  it("should return empty string when no step is expanded", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started", "create-product"],
      stepsExpanded: { "get-started": false },
    } as OnboardingState;

    // Act
    const firstExpandedStepId = getFirstExpanderStepId(onboardingState);

    // Assert
    expect(firstExpandedStepId).toBe("");
  });
});

describe("mapInitialStepsWithState", () => {
  it("should map initial steps with state", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started"],
      stepsExpanded: {
        "create-product": true,
      },
    } as OnboardingState;

    // Act
    const mappedSteps = mapInitialStepsWithState(onboardingState);

    // Assert
    expect(mappedSteps).toEqual([
      {
        id: "get-started",
        completed: true,
        expanded: undefined,
      },
      {
        id: "create-product",
        completed: false,
        expanded: true,
      },
      {
        id: "explore-orders",
        completed: false,
        expanded: undefined,
      },
      {
        id: "graphql-playground",
        completed: false,
        expanded: undefined,
      },
      {
        id: "view-webhooks",
        completed: false,
        expanded: undefined,
      },
      {
        id: "invite-staff",
        completed: false,
        expanded: undefined,
      },
    ]);
  });
});

describe("getFirstNotCompletedAndNotExpandedStep", () => {
  it("should return the first not completed and not expanded step", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started"],
      stepsExpanded: {
        "create-product": false,
      },
    } as OnboardingState;

    // Act
    const firstNotCompletedStep = getFirstNotCompletedAndNotExpandedStep(onboardingState);

    // Assert
    expect(firstNotCompletedStep).toEqual("explore-orders");
  });

  it("should return empty string when all steps are completed", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: [
        "get-started",
        "create-product",
        "explore-orders",
        "graphql-playground",
        "view-webhooks",
        "invite-staff",
      ],
      stepsExpanded: {},
    } as OnboardingState;

    // Act
    const firstNotCompletedStep = getFirstNotCompletedAndNotExpandedStep(onboardingState);

    // Assert
    expect(firstNotCompletedStep).toEqual("");
  });
});

describe("getNextStepToExpand", () => {
  it("should return the first step after last completed", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["create-product"],
      stepsExpanded: {},
    } as OnboardingState;

    // Act
    const nextStep = getNextStepToExpand(onboardingState);

    // Assert
    expect(nextStep).toEqual("explore-orders");
  });

  it("should return empty string when no next step after last completed", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["invite-staff"],
      stepsExpanded: {},
    } as OnboardingState;

    // Act
    const nextStep = getNextStepToExpand(onboardingState);

    // Assert
    expect(nextStep).toEqual("");
  });
});
