import { act, renderHook } from "@testing-library/react-hooks";

import { useSidebarDotState } from "./useSidebarDotState";
import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

jest.mock("./useSidebarWebhookAlertMetadata");

const defaultMock = {
  persist: jest.fn().mockResolvedValue(undefined),
  refetch: jest.fn(),
  webhookAlertState: { value: null },
};

describe("useSidebarDotState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with dot not visible", () => {
    // Arrange & Act
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should show dot when failed attempt is newer than last click", async () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());

    // Act
    await act(async () => {
      const olderDate = new Date("2024-01-01").toISOString();

      await result.current.handleAppsListItemClick(olderDate);

      const newerDate = new Date("2024-01-02").toISOString();

      await result.current.handleFailedAttempt(newerDate);
    });

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(true);
  });

  it("should hide dot after clicking when no failed attempts", async () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());
    const date = new Date("2024-01-01").toISOString();

    // Act
    await act(async () => {
      await result.current.handleAppsListItemClick(date);
    });

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should hide dot on auth change", () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());

    // Act
    act(() => {
      result.current.handleAuthChange();
    });

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should handle empty metadata state", async () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());

    // Act
    await act(async () => {
      await result.current.handleFailedAttempt(new Date().toISOString());
    });

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(true);
  });

  it("should handle initial metadata state and show the dot", () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist: jest.fn().mockResolvedValue(undefined),
      refetch: jest.fn(),
      sidebarDotRemoteState: {
        lastClickDate: new Date("2024-01-01").toISOString(),
        lastFailedAttemptDate: new Date("2024-01-02").toISOString(),
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarDotState());

    // Assert
    expect(result.current.isSidebarDotVisible).toBe(true);
  });

  it("should persist app list item click", async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    const date = new Date().toISOString();

    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist,
      refetch,
      sidebarDotRemoteState: {
        lastClickDate: null,
        lastFailedAttemptDate: null,
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      await result.current.handleAppsListItemClick(date);
    });

    // Assert
    expect(persist).toHaveBeenCalledWith({
      lastClickDate: date,
      lastFailedAttemptDate: "",
    });
    expect(result.current.isSidebarDotVisible).toBe(false);
  });

  it("should persist failed attempt", async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const refetch = jest.fn();
    const date = new Date().toISOString();

    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist,
      refetch,
      sidebarDotRemoteState: {
        lastClickDate: null,
        lastFailedAttemptDate: null,
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      await result.current.handleFailedAttempt(date);
    });

    // Assert
    expect(persist).toHaveBeenCalledWith({
      lastClickDate: "",
      lastFailedAttemptDate: date,
    });
    expect(result.current.isSidebarDotVisible).toBe(true);
  });
});
