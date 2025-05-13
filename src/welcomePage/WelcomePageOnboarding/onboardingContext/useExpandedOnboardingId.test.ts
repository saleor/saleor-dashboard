import {
  OnboardingState,
  OnboardingStep,
} from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext/types";
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
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: undefined },
      { id: "create-product", completed: false, expanded: true },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "view-webhooks", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const expandedStepId = renderHook(() =>
      useExpandedOnboardingId(onboardingState, loaded, visibleSteps),
    ).result.current;

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
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: false },
      { id: "create-product", completed: true, expanded: undefined },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "view-webhooks", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const expandedStepId = renderHook(() =>
      useExpandedOnboardingId(onboardingState, loaded, visibleSteps),
    ).result.current;

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
        "view-extensions": false,
        "view-webhooks": false,
        "invite-staff": false,
      },
    } as OnboardingState;
    const loaded = true;
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: false, expanded: false },
      { id: "create-product", completed: false, expanded: false },
      { id: "explore-orders", completed: false, expanded: false },
      { id: "graphql-playground", completed: false, expanded: false },
      { id: "view-extensions", completed: false, expanded: false },
      { id: "view-webhooks", completed: false, expanded: false },
      { id: "invite-staff", completed: false, expanded: false },
    ];

    // Act
    const expandedStepId = renderHook(() =>
      useExpandedOnboardingId(onboardingState, loaded, visibleSteps),
    ).result.current;

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
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: false, expanded: false },
      { id: "create-product", completed: false, expanded: undefined },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "view-webhooks", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const { rerender, result } = renderHook(
      ({ onboardingState, loaded, visibleSteps }) =>
        useExpandedOnboardingId(onboardingState, loaded, visibleSteps),
      {
        initialProps: {
          onboardingState,
          loaded,
          visibleSteps,
        },
      },
    );

    rerender({ onboardingState: onboardingStateChanged, loaded, visibleSteps });

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
    const visibleSteps: OnboardingStep[] = [
      { id: "get-started", completed: true, expanded: false },
      { id: "create-product", completed: true, expanded: undefined },
      { id: "explore-orders", completed: false, expanded: undefined },
      { id: "graphql-playground", completed: false, expanded: undefined },
      { id: "view-extensions", completed: false, expanded: undefined },
      { id: "view-webhooks", completed: false, expanded: undefined },
      { id: "invite-staff", completed: false, expanded: undefined },
    ];

    // Act
    const { rerender, result } = renderHook(
      ({ onboardingState, loaded, visibleSteps }) =>
        useExpandedOnboardingId(onboardingState, loaded, visibleSteps),
      {
        initialProps: {
          onboardingState,
          loaded,
          visibleSteps,
        },
      },
    );

    rerender({ onboardingState: onboardingStateChanged, loaded, visibleSteps });

    // Assert
    expect(result.current).toBe("explore-orders");
  });
});
