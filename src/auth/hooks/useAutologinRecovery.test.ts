import { type ConnectionEvent } from "@dashboard/connection/connectionMonitor";
import { act, renderHook } from "@testing-library/react";

import { useAutologinRecovery } from "./useAutologinRecovery";

const mockMonitorListeners = new Set<(event: ConnectionEvent) => void>();

jest.mock("@dashboard/connection/appConnectionMonitor", () => ({
  connectionMonitor: {
    subscribe: (listener: (event: ConnectionEvent) => void): (() => void) => {
      mockMonitorListeners.add(listener);

      return () => mockMonitorListeners.delete(listener);
    },
  },
}));

const mockRetryAutologin = jest.fn();

jest.mock("../initAuth", () => ({
  retryAutologin: (): Promise<void> => mockRetryAutologin(),
}));

describe("useAutologinRecovery", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("tries again when the browser comes back online and every 30 seconds", async () => {
    // Arrange
    mockRetryAutologin.mockResolvedValue(undefined);
    renderHook(() => useAutologinRecovery());

    // Act
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });
    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    // Assert
    expect(mockRetryAutologin).toHaveBeenCalledTimes(2);
  });

  it("tries again as soon as Saleor answers the connection monitor's check", async () => {
    // Arrange
    mockRetryAutologin.mockResolvedValue(undefined);
    renderHook(() => useAutologinRecovery());

    // Act
    await act(async () => {
      mockMonitorListeners.forEach(listener => listener({ type: "recovered", afterOutage: true }));
    });

    // Assert
    expect(mockRetryAutologin).toHaveBeenCalledTimes(1);
  });

  it("does not start a second try while one is running", async () => {
    // Arrange
    mockRetryAutologin.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => useAutologinRecovery());

    // Act
    act(() => {
      result.current.retry();
    });
    act(() => {
      result.current.retry();
    });

    // Assert
    expect(mockRetryAutologin).toHaveBeenCalledTimes(1);
    expect(result.current.retrying).toBe(true);
  });

  it("stops trying once the screen is gone", () => {
    // Arrange
    mockRetryAutologin.mockResolvedValue(undefined);

    const { unmount } = renderHook(() => useAutologinRecovery());

    // Act
    unmount();
    window.dispatchEvent(new Event("online"));
    jest.advanceTimersByTime(60_000);

    // Assert
    expect(mockRetryAutologin).not.toHaveBeenCalled();
  });
});
