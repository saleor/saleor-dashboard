import { act, renderHook } from "@testing-library/react-hooks";

import { useClipboard } from "./useClipboard";

describe("useClipboard", () => {
  let mockWriteText: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockWriteText = jest.fn().mockResolvedValue(undefined);
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    consoleWarnSpy.mockRestore();
  });

  it("should return initial state with copied as false", () => {
    // Arrange & Act
    const { result } = renderHook(() => useClipboard());

    // Assert
    const [copied, copy] = result.current;

    expect(copied).toBe(false);
    expect(typeof copy).toBe("function");
  });

  it("should copy text to clipboard and set copied to true", async () => {
    // Arrange
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());
    const textToCopy = "Hello, World!";

    // Act
    const [, copy] = result.current;

    await act(async () => {
      copy(textToCopy);
      await Promise.resolve();
    });

    // Assert
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
    expect(result.current[0]).toBe(true);
  });

  it("should reset copied to false after 2 seconds", async () => {
    // Arrange
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    // Act
    const [, copy] = result.current;

    await act(async () => {
      copy("test text");
      await Promise.resolve();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Assert
    expect(result.current[0]).toBe(false);
  });

  it("should clear timeout on unmount", async () => {
    // Arrange
    mockWriteText.mockResolvedValue(undefined);

    const { result, unmount } = renderHook(() => useClipboard());

    // Act
    const [, copy] = result.current;

    await act(async () => {
      copy("test text");
      await Promise.resolve();
    });

    expect(result.current[0]).toBe(true);

    unmount();

    // Assert
    expect(jest.getTimerCount()).toBe(0);
  });

  it("should handle multiple copy calls", async () => {
    // Arrange
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    // Act
    const [, copy] = result.current;

    await act(async () => {
      copy("first text");
      await Promise.resolve();
    });

    expect(result.current[0]).toBe(true);

    await act(async () => {
      copy("second text");
      await Promise.resolve();
    });

    // Assert - should still be true after second copy
    expect(mockWriteText).toHaveBeenCalledTimes(2);
    expect(mockWriteText).toHaveBeenCalledWith("first text");
    expect(mockWriteText).toHaveBeenCalledWith("second text");
    expect(result.current[0]).toBe(true);
  });

  it("should handle clipboard write rejection and log warning", async () => {
    // Arrange
    const mockError = new Error("Clipboard permission denied");

    mockWriteText.mockRejectedValue(mockError);

    const { result } = renderHook(() => useClipboard());
    const textToCopy = "Hello, World!";

    // Act
    const [, copy] = result.current;

    await act(async () => {
      copy(textToCopy);
      await Promise.resolve();
    });

    // Assert
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
    expect(result.current[0]).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Failed to use clipboard, ensure browser permission is enabled.",
    );
  });
});
