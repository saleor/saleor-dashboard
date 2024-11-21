import { OnboardingState } from "@dashboard/newHome/homeOnboarding/onboardingContext/types";
import { renderHook } from "@testing-library/react-hooks";

import { useExpandedOnboardingId } from "./useExpandedOnboardingId";

describe("useExpandedOnboardingId", () => {
  it("should return first expanded step on init if exists", () => {
    const onboardingState = {
      steps: [
        { id: "get-started", completed: true, expanded: undefined },
        { id: "create-product", completed: false, expanded: true },
        { id: "explore-orders", completed: false, expanded: undefined },
      ],
    } as OnboardingState;
    const loaded = true;
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    expect(expandedStepId).toBe("create-product");
  });

  it("should return first not completed step when no one with expanded state", () => {
    const onboardingState = {
      steps: [
        { id: "get-started", completed: true, expanded: undefined },
        { id: "create-product", completed: true, expanded: undefined },
        { id: "explore-orders", completed: false, expanded: undefined },
      ],
    } as OnboardingState;
    const loaded = true;
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    expect(expandedStepId).toBe("explore-orders");
  });

  it("should return empty string when all steps are collapsed", () => {
    const onboardingState = {
      steps: [
        { id: "get-started", completed: false, expanded: false },
        { id: "create-product", completed: false, expanded: false },
        { id: "explore-orders", completed: false, expanded: false },
        { id: "graphql-playground", completed: false, expanded: false },
        { id: "invite-staff", completed: false, expanded: false },
        { id: "view-webhooks", completed: false, expanded: false },
      ],
    } as OnboardingState;
    const loaded = true;
    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingState, loaded)).result
      .current;

    expect(expandedStepId).toBe("");
  });

  it("should return first expanded step after collapse steps change", () => {
    const onboardingState = {
      steps: [{ id: "get-started", completed: false, expanded: false }],
    } as OnboardingState;
    const onboardingStateChanged = {
      steps: [
        { id: "get-started", completed: false, expanded: false },
        { id: "view-webhooks", completed: false, expanded: true },
      ],
    } as OnboardingState;
    const loaded = true;

    renderHook(() => useExpandedOnboardingId(onboardingState, loaded));

    const expandedStepId = renderHook(() => useExpandedOnboardingId(onboardingStateChanged, loaded))
      .result.current;

    expect(expandedStepId).toBe("view-webhooks");
  });
});
