import { act, renderHook } from "@testing-library/react";

import { useMediaQuery } from "./useMediaQuery";

type ChangeListener = () => void;

/** A viewport that can be resized: every query matches while the viewport is "narrow". */
const installViewport = (): { setNarrow: (narrow: boolean) => void } => {
  let narrow = false;
  const listeners = new Set<ChangeListener>();

  window.matchMedia = (query: string): MediaQueryList =>
    ({
      get matches() {
        return narrow;
      },
      media: query,
      addEventListener: (_type: string, listener: ChangeListener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: ChangeListener) => listeners.delete(listener),
    }) as unknown as MediaQueryList;

  return {
    setNarrow: (next: boolean): void => {
      narrow = next;
      listeners.forEach(listener => listener());
    },
  };
};

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe("useMediaQuery", () => {
  it("follows the viewport as it starts and stops matching", () => {
    // Arrange
    const viewport = installViewport();
    const { result } = renderHook(() => useMediaQuery("(max-width: 1279px)"));

    // Assert
    expect(result.current).toBe(false);

    // Act
    act(() => viewport.setNarrow(true));

    // Assert
    expect(result.current).toBe(true);

    // Act
    act(() => viewport.setNarrow(false));

    // Assert
    expect(result.current).toBe(false);
  });

  it("matches from the first render when the viewport already does", () => {
    // Arrange
    const viewport = installViewport();

    viewport.setNarrow(true);

    // Act
    const { result } = renderHook(() => useMediaQuery("(max-width: 1279px)"));

    // Assert
    expect(result.current).toBe(true);
  });

  it("reports no match where media queries are unavailable", () => {
    // Arrange: like jsdom, which has no matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    // Act
    const { result } = renderHook(() => useMediaQuery("(max-width: 1279px)"));

    // Assert
    expect(result.current).toBe(false);
  });
});
