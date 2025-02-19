import { act, renderHook } from "@testing-library/react-hooks";

import { useSidebarDotState } from "./useSidebarDotState";

// Mock the webhook metadata hook
jest.mock("./useSidebarWebhookAlertMetadata", () => ({
  useSidebarWebhookAlertMetadata: () => ({
    persist: jest.fn().mockResolvedValue(undefined),
    refetch: jest.fn(),
    webhookAlertState: { value: null },
  }),
}));

describe("useSidebarDotState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with dot not visible", () => {
    const { result } = renderHook(() => useSidebarDotState());

    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should show dot when failed attempt is newer than last click", async () => {
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      const olderDate = new Date("2024-01-01").toISOString();

      await result.current.handleAppsListItemClick(olderDate);

      const newerDate = new Date("2024-01-02").toISOString();

      await result.current.handleFailedAttempt(newerDate);
    });

    expect(result.current.isSidebarDotVisible).toBe(true);
  });

  it("should hide dot after clicking when no failed attempts", async () => {
    const { result } = renderHook(() => useSidebarDotState());
    const date = new Date("2024-01-01").toISOString();

    await act(async () => {
      await result.current.handleAppsListItemClick(date);
    });

    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should hide dot on auth change", () => {
    const { result } = renderHook(() => useSidebarDotState());

    act(() => {
      result.current.handleAuthChange();
    });

    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should not show dot when last click is newer than failed attempt", async () => {
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      const olderDate = new Date("2024-01-01").toISOString();

      await result.current.handleFailedAttempt(olderDate);

      const newerDate = new Date("2024-01-02").toISOString();

      await result.current.handleAppsListItemClick(newerDate);
    });

    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should handle empty metadata state", async () => {
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      await result.current.handleFailedAttempt(new Date().toISOString());
    });

    expect(result.current.isSidebarDotVisible).toBe(true);
  });
});
