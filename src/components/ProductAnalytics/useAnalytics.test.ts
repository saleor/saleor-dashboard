import { renderHook } from "@testing-library/react";

import { useAnalytics } from "./useAnalytics";

const mockCapture = jest.fn();

jest.mock("posthog-js/react", () => ({
  usePostHog: () => ({
    capture: mockCapture,
  }),
}));

jest.mock("../Router/useRouteChange", () => ({
  useRouteChange: () => ({
    register: jest.fn(),
  }),
}));

describe("useAnalytics", () => {
  it("keeps the event tracker stable between renders", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useAnalytics());
    const initialTrackEvent = result.current.trackEvent;

    // Act
    rerender();

    // Assert
    expect(result.current.trackEvent).toBe(initialTrackEvent);
  });
});
