import { act, renderHook } from "@testing-library/react";

import { useManifestAcknowledgement } from "./useManifestAcknowledgement";

const manifest: { name: string } = { name: "SMTP" };

describe("useManifestAcknowledgement", () => {
  it("is acknowledged when no acknowledgement is required", () => {
    // Arrange & Act
    const { result } = renderHook(() => useManifestAcknowledgement(manifest, false));

    // Assert
    expect(result.current.acknowledged).toBe(true);
  });

  it("requires acknowledgement until it is given", () => {
    // Arrange
    const { result } = renderHook(() => useManifestAcknowledgement(manifest, true));

    expect(result.current.acknowledged).toBe(false);

    // Act
    act(() => result.current.setAcknowledged(true));

    // Assert
    expect(result.current.acknowledged).toBe(true);
  });

  it("resets the acknowledgement when another manifest is fetched", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ current }: { current: { name: string } }) => useManifestAcknowledgement(current, true),
      { initialProps: { current: manifest } },
    );

    act(() => result.current.setAcknowledged(true));

    // Act
    rerender({ current: { ...manifest } });

    // Assert
    expect(result.current.acknowledged).toBe(false);
  });
});
