import { OnboardingState } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";
import { renderHook } from "@testing-library/react-hooks";

import { useExpandedOnboardingId } from "./useExpandedOnboardingId";

describe("useExpandedOnboardingId", () => {
  it("should return first expanded step on init if exists", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started"],
      stepsExpanded: {
        "create-product": true,
      },
    } as OnboardingState;
    const loaded = true;

    // Act
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    // assert
    expect(expandedStepId).toBe("create-product");
  });

  it("should return first not completed step when no one with expanded state", () => {
    // Arrange
    const onboardingState = {
      stepsCompleted: ["get-started", "create-product"],
      stepsExpanded: { "get-started": false },
    } as OnboardingState;
    const loaded = true;

    // Act
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    // Assert
    expect(expandedStepId).toBe("explore-orders");
  });

  it("should return empty string when all steps are collapsed", () => {
    // Arrange
    const onboardingState = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {
        "get-started": false,
        "create-product": false,
        "explore-orders": false,
        "graphql-playground": false,
        "invite-staff": false,
        "view-webhooks": false,
      },
    } as OnboardingState;
    const loaded = true;

    // Act
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    // Assert
    expect(expandedStepId).toBe("");
  });

  it("should return first expanded step after collapse steps change", () => {
    // Arrange
    const onboardingState = {
      onboardingExpanded: true,
      stepsCompleted: [],
      stepsExpanded: {
        "get-started": false,
      },
    } as unknown as OnboardingState;
    const onboardingStateChanged = {
      onboardingExpanded: true,
      stepsCompleted: ["view-webhooks"],
      stepsExpanded: {
        "get-started": false,
      },
    } as OnboardingState;
    const loaded = true;

    // Act
    renderHook(() => useExpandedOnboardingId(onboardingState, loaded));

    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingStateChanged, loaded))
      .result.current;

    // Assert
    expect(expandedStepId).toBe("create-product");
  });
});
