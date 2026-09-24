import { act, renderHook } from "@testing-library/react";

import {
  getConfigurationSearchQueryLength,
  useConfigurationSearchAnalytics,
} from "./useConfigurationSearchAnalytics";

const mockTrackEvent = jest.fn();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));

describe("useConfigurationSearchAnalytics", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockTrackEvent.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("tracks a debounced no-results event without the query", () => {
    // Arrange
    renderHook(() => useConfigurationSearchAnalytics("payment gateway", 0));

    // Act
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledWith("configuration_search_no_results", {
      query_length: "11+",
    });
  });

  it("does not track searches that return results", () => {
    // Arrange
    renderHook(() => useConfigurationSearchAnalytics("payment", 2));

    // Act
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Assert
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});

describe("getConfigurationSearchQueryLength", () => {
  it.each([
    ["tax", "1-3"],
    ["payments", "4-10"],
    ["payment gateway", "11+"],
  ] as const)("buckets %s as %s", (query, expected) => {
    // Act
    const result = getConfigurationSearchQueryLength(query);

    // Assert
    expect(result).toBe(expected);
  });
});
