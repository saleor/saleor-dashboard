import { act, renderHook } from "@testing-library/react";

import {
  resolveAttributeIdToUnassign,
  usePendingAttributeUnassign,
} from "./usePendingAttributeUnassign";

describe("resolveAttributeIdToUnassign", () => {
  it("uses the URL id when present, otherwise the click-time id", () => {
    // Arrange & Act & Assert
    expect(resolveAttributeIdToUnassign("attr-1", undefined)).toBe("attr-1");
    expect(resolveAttributeIdToUnassign(null, "attr-2")).toBe("attr-2");
    expect(resolveAttributeIdToUnassign("attr-stale", "attr-from-url")).toBe("attr-from-url");
    expect(resolveAttributeIdToUnassign(undefined, undefined)).toBeNull();
  });
});

describe("usePendingAttributeUnassign", () => {
  it("returns the click-time id after the URL id is cleared", () => {
    // Arrange
    const { result, rerender } = renderHook(({ urlId }) => usePendingAttributeUnassign(urlId), {
      initialProps: { urlId: "attr-from-url" as string | undefined },
    });

    // Act
    act(() => {
      result.current.beginUnassign("attr-from-click");
    });
    rerender({ urlId: undefined });

    // Assert — closeModal clears ?id= before confirm; the ref must still win
    expect(result.current.takeAttributeId()).toBe("attr-from-click");
    expect(result.current.attributeId).toBe("attr-from-click");
  });

  it("does not keep a cancelled id when the URL opens a different attribute", () => {
    // Arrange
    const { result, rerender } = renderHook(({ urlId }) => usePendingAttributeUnassign(urlId), {
      initialProps: { urlId: undefined as string | undefined },
    });

    act(() => {
      result.current.beginUnassign("attr-cancelled");
    });

    // Act — dialog reopened from ?id= without beginUnassign (back / deep link)
    rerender({ urlId: "attr-from-url" });

    // Assert
    expect(result.current.takeAttributeId()).toBe("attr-from-url");
    expect(result.current.attributeId).toBe("attr-from-url");
  });

  it("does not open when the row id is missing", () => {
    // Arrange
    const { result } = renderHook(() => usePendingAttributeUnassign(undefined));

    // Act
    let opened = true;

    act(() => {
      opened = result.current.beginUnassign(undefined);
    });

    // Assert
    expect(opened).toBe(false);
    expect(result.current.takeAttributeId()).toBeNull();
  });
});
