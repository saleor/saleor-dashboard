import { act, renderHook } from "@testing-library/react";

import { useTokenRefresh } from "./useTokenRefresh";

// Minimal unsigned JWT: only the payload segment matters to jwt-decode.
const makeToken = ({ iat, exp }: { iat: number; exp: number }) => {
  const payload = Buffer.from(JSON.stringify({ iat, exp })).toString("base64url");

  return `header.${payload}.signature`;
};

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
};

describe("useTokenRefresh", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setVisibility("visible");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("refreshes shortly before the token expires", () => {
    // Arrange
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds, exp: nowSeconds + 300 });

    // Act
    renderHook(() => useTokenRefresh(token, refetch));
    act(() => {
      jest.advanceTimersByTime(269 * 1000);
    });

    // Assert
    expect(refetch).not.toHaveBeenCalled();

    // Act
    act(() => {
      jest.advanceTimersByTime(2 * 1000);
    });

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("schedules from remaining lifetime, not total lifetime", () => {
    // Arrange: a token issued an hour ago that expires in a minute.
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds - 3600, exp: nowSeconds + 60 });

    // Act
    renderHook(() => useTokenRefresh(token, refetch));
    act(() => {
      jest.advanceTimersByTime(31 * 1000);
    });

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not spin when the token is already expired", () => {
    // Arrange: mirrors waking a tab whose token died during sleep.
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds - 3600, exp: nowSeconds - 600 });

    // Act
    renderHook(() => useTokenRefresh(token, refetch));
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    // Assert: floored retries, not one refetch per tick.
    expect(refetch).toHaveBeenCalledTimes(10);
  });

  it("catches up immediately when the tab becomes visible with a due token", () => {
    // Arrange
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds - 3600, exp: nowSeconds - 600 });

    renderHook(() => useTokenRefresh(token, refetch));

    // Act
    act(() => {
      setVisibility("visible");
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("arms the timer when refetch only becomes available later", () => {
    // Arrange
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds, exp: nowSeconds + 300 });

    const initialProps: { onRefetch?: () => void } = { onRefetch: undefined };

    const { rerender } = renderHook(
      ({ onRefetch }: { onRefetch?: () => void }) => useTokenRefresh(token, onRefetch),
      { initialProps },
    );

    // Act
    rerender({ onRefetch: refetch });
    act(() => {
      jest.advanceTimersByTime(271 * 1000);
    });

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("ignores tokens it cannot decode", () => {
    // Arrange
    const refetch = jest.fn();

    // Act
    renderHook(() => useTokenRefresh("not-a-jwt", refetch));
    act(() => {
      jest.advanceTimersByTime(10 * 60 * 1000);
    });

    // Assert
    expect(refetch).not.toHaveBeenCalled();
  });

  it("clears the timer on unmount", () => {
    // Arrange
    const nowSeconds = Math.floor(Date.now() / 1000);
    const refetch = jest.fn();
    const token = makeToken({ iat: nowSeconds, exp: nowSeconds + 300 });

    const { unmount } = renderHook(() => useTokenRefresh(token, refetch));

    // Act
    unmount();
    act(() => {
      jest.advanceTimersByTime(10 * 60 * 1000);
    });

    // Assert
    expect(refetch).not.toHaveBeenCalled();
  });
});
