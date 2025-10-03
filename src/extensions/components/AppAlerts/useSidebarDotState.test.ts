import { act, renderHook } from "@testing-library/react-hooks";

import { useSidebarDotState } from "./useSidebarDotState";
import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

jest.mock("./useSidebarWebhookAlertMetadata");

const defaultMock = {
  persist: jest.fn().mockResolvedValue(undefined),
  webhookAlertState: { value: null },
};

describe("useSidebarDotState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with dot not visible when no value", () => {
    // Arrange & Act
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue(defaultMock);

    const { result } = renderHook(() => useSidebarDotState());

    // Assert
    expect(result.current.hasNewFailedAttempts).toBe(false);
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
    expect(result.current.hasNewFailedAttempts).toBe(true);
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
    expect(result.current.hasNewFailedAttempts).toBe(false);
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
    expect(result.current.hasNewFailedAttempts).toBe(true);
  });

  it("should handle initial metadata state and show the dot", () => {
    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist: jest.fn().mockResolvedValue(undefined),
      sidebarDotRemoteState: {
        lastClickDate: new Date("2024-01-01").toISOString(),
        lastFailedAttemptDate: new Date("2024-01-02").toISOString(),
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarDotState());

    // Assert
    expect(result.current.hasNewFailedAttempts).toBe(true);
  });

  it("should persist app list item click", async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const date = new Date().toISOString();

    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist,
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
    expect(result.current.hasNewFailedAttempts).toBe(false);
  });

  it("should persist failed attempt", async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const date = new Date().toISOString();

    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist,
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
    expect(result.current.hasNewFailedAttempts).toBe(true);
  });

  it("should persist click date after multiple attempts", async () => {
    const persist = jest.fn().mockResolvedValue(undefined);
    const eventDate = new Date("2025-01-01").toISOString();
    const clickDate = new Date("2025-01-02").toISOString();

    // Arrange
    (useSidebarWebhookAlertMetadata as jest.Mock).mockReturnValue({
      persist,
      sidebarDotRemoteState: {
        lastClickDate: null,
        lastFailedAttemptDate: null,
      },
    });

    // Act
    const { result } = renderHook(() => useSidebarDotState());

    await act(async () => {
      result.current.handleFailedAttempt(eventDate);
    });

    await act(async () => {
      result.current.handleAppsListItemClick(clickDate);
    });

    await act(async () => {
      result.current.handleFailedAttempt(eventDate);
    });

    // Assert
    expect(persist).toHaveBeenLastCalledWith({
      lastClickDate: clickDate,
      lastFailedAttemptDate: eventDate,
    });
  });
});
