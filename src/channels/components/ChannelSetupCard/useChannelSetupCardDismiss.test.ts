import { act, renderHook } from "@testing-library/react";

import { useChannelSetupCardDismiss } from "./useChannelSetupCardDismiss";

describe("useChannelSetupCardDismiss", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts visible and hides after dismiss for that channel", () => {
    // Arrange
    const { result } = renderHook(() => useChannelSetupCardDismiss("channel-1"));

    // Assert
    expect(result.current.isDismissed).toBe(false);

    // Act
    act(() => {
      result.current.dismiss();
    });

    // Assert
    expect(result.current.isDismissed).toBe(true);
  });

  it("does not dismiss other channels", () => {
    // Arrange
    const { result: first } = renderHook(() => useChannelSetupCardDismiss("channel-1"));

    // Act
    act(() => {
      first.current.dismiss();
    });

    const { result: second } = renderHook(() => useChannelSetupCardDismiss("channel-2"));

    // Assert
    expect(second.current.isDismissed).toBe(false);
  });
});
