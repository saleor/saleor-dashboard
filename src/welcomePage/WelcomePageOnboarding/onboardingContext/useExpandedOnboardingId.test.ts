import { OnboardingState } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/types";
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

  it("should return first not completed step after step competed", async () => {
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
      stepsCompleted: ["create-product"],
      stepsExpanded: {
        "get-started": false,
      },
    } as OnboardingState;
    const loaded = true;

    // Act
    const { rerender, result } = renderHook(
      ({ onboardingState, loaded }) => useExpandedOnboardingId(onboardingState, loaded),
      {
        initialProps: {
          onboardingState,
          loaded,
        },
      },
    );

    rerender({ onboardingState: onboardingStateChanged, loaded });

    // Assert
    expect(result.current).toBe("explore-orders");
  });

  it("should return first expanded step after expand step toggle", async () => {
    // Arrange
    const onboardingState = {
      onboardingExpanded: true,
      stepsCompleted: ["get-started", "create-product"],
      stepsExpanded: {
        "get-started": false,
      },
    } as unknown as OnboardingState;

    const onboardingStateChanged = {
      onboardingExpanded: true,
      stepsCompleted: ["get-started", "create-product"],
      stepsExpanded: {
        "get-started": false,
        "explore-orders": true,
      },
    } as OnboardingState;
    const loaded = true;

    // Act
    const { rerender, result } = renderHook(
      ({ onboardingState, loaded }) => useExpandedOnboardingId(onboardingState, loaded),
      {
        initialProps: {
          onboardingState,
          loaded,
        },
      },
    );

    rerender({ onboardingState: onboardingStateChanged, loaded });

    // Assert
    expect(result.current).toBe("explore-orders");
  });
});
