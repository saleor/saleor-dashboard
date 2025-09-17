import { MetadataInput } from "@dashboard/graphql";
import {
  OnboardingState,
  OnboardingStep,
  OnboardingStepsIDs,
} from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/types";

import {
  getFirstExpanderStepId,
  getFirstNotCompletedAndNotExpandedStep,
  getNextStepToExpand,
  handleStateChangeAfterStepCompleted,
  handleStateChangeAfterToggle,
  METADATA_KEY,
  prepareUserMetadata,
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

  it("should remove the step from stepsExpanded if it was expanded", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: { "create-product": true },
    } as unknown as OnboardingState;
    const id = "create-product";

    // Act
    const newState = handleStateChangeAfterStepCompleted(state, id);

    // Assert
    expect(newState.stepsCompleted).toEqual(["get-started", "create-product"]);
    expect(newState.stepsExpanded["create-product"]).toBeUndefined();
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

  it("should clear other expanded steps when a new step is expanded", () => {
    // Arrange
    const state = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {
        "get-started": true,
        "explore-orders": true,
      },
    } as unknown as OnboardingState;
    const expandedId = "create-product";
    const id = "create-product";

    // Act
    const newState = handleStateChangeAfterToggle(state, expandedId, id);

    // Assert
    expect(newState.stepsExpanded).toEqual({ "create-product": true });
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

describe("getFirstNotCompletedAndNotExpandedStep", () => {
  it("should return the first not completed and not expanded step", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started"],
      stepsExpanded: {
        "create-product": false,
      },
    } as OnboardingState;
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: false, expanded: false },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const firstNotCompletedStep = getFirstNotCompletedAndNotExpandedStep(
      onboardingState,
      visibleSteps,
    );

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
        "view-extensions",
        "invite-staff",
      ],
      stepsExpanded: {},
    } as OnboardingState;
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: true, expanded: undefined },
      { id: "explore-orders", completed: true, expanded: undefined },
      { id: "graphql-playground", completed: true, expanded: undefined },
      { id: "view-extensions", completed: true, expanded: undefined },
      { id: "invite-staff", completed: true, expanded: undefined },
    ];

    // Act
    const firstNotCompletedStep = getFirstNotCompletedAndNotExpandedStep(
      onboardingState,
      visibleSteps,
    );

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
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: true, expanded: undefined },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const nextStep = getNextStepToExpand(onboardingState, visibleSteps);

    // Assert
    expect(nextStep).toEqual("explore-orders");
  });

  it("should return empty string when no next step after last completed", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["invite-staff"],
      stepsExpanded: {},
    } as OnboardingState;
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: true, expanded: undefined },
      { id: "explore-orders", completed: true, expanded: undefined },
      { id: "graphql-playground", completed: true, expanded: undefined },
      { id: "view-extensions", completed: true, expanded: undefined },
      { id: "invite-staff", completed: true, expanded: undefined },
    ];

    // Act
    const nextStep = getNextStepToExpand(onboardingState, visibleSteps);

    // Assert
    expect(nextStep).toEqual("");
  });

  it("should return empty string if lastCompletedStepId is not in visibleSteps", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["non-existent-step" as OnboardingStepsIDs],
      stepsExpanded: {},
    } as OnboardingState;
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: true, expanded: undefined },
    ];

    // Act
    const nextStep = getNextStepToExpand(onboardingState, visibleSteps);

    // Assert
    expect(nextStep).toEqual("");
  });
});

describe("prepareUserMetadata", () => {
  const onboardingState: OnboardingState = {
    onboardingExpanded: true,
    stepsCompleted: ["get-started"],
    stepsExpanded: { "create-product": true } as unknown as Record<OnboardingStepsIDs, boolean>,
  };
  const onboardingStateString = JSON.stringify(onboardingState);

  it("should add onboarding metadata if metadata is undefined", () => {
    // Arrange
    const metadata = undefined;

    // Act
    const result = prepareUserMetadata(metadata, onboardingState);

    // Assert
    expect(result).toEqual([
      {
        key: METADATA_KEY,
        value: onboardingStateString,
      },
    ]);
  });

  it("should add onboarding metadata if key is not present", () => {
    // Arrange
    const metadata: MetadataInput[] = [{ key: "otherKey", value: "otherValue" }];

    // Act
    const result = prepareUserMetadata(metadata, onboardingState);

    // Assert
    expect(result).toEqual([
      { key: "otherKey", value: "otherValue" },
      {
        key: METADATA_KEY,
        value: onboardingStateString,
      },
    ]);
  });

  it("should update onboarding metadata if key is present", () => {
    // Arrange
    const metadata: MetadataInput[] = [
      { key: "otherKey", value: "otherValue" },
      { key: METADATA_KEY, value: "oldValue" },
    ];

    // Act
    const result = prepareUserMetadata(metadata, onboardingState);

    // Assert
    expect(result).toEqual([
      { key: "otherKey", value: "otherValue" },
      {
        key: METADATA_KEY,
        value: onboardingStateString,
      },
    ]);
    // Ensure the original position is updated, not appended
    expect(result.findIndex(m => m.key === METADATA_KEY)).toBe(1);
  });

  it("should handle empty initial metadata array", () => {
    // Arrange
    const metadata: MetadataInput[] = [];

    // Act
    const result = prepareUserMetadata(metadata, onboardingState);

    // Assert
    expect(result).toEqual([
      {
        key: METADATA_KEY,
        value: onboardingStateString,
      },
    ]);
  });
});
