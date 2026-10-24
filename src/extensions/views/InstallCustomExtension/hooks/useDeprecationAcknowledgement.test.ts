import { act, renderHook } from "@testing-library/react";

import { type InstallDetailsManifestData } from "../types";
import { useDeprecationAcknowledgement } from "./useDeprecationAcknowledgement";

const manifest: InstallDetailsManifestData = {
  name: "SMTP",
  brand: null,
  permissions: [],
  dataPrivacyUrl: null,
  deprecationReason: null,
};

const deprecatedManifest: InstallDetailsManifestData = {
  ...manifest,
  deprecationReason: "Use Customer Emails instead.",
};

describe("useDeprecationAcknowledgement", () => {
  it("does not require acknowledgement for an app that is not deprecated", () => {
    // Arrange & Act
    const { result } = renderHook(() => useDeprecationAcknowledgement(manifest));

    // Assert
    expect(result.current.acknowledged).toBe(true);
  });

  it("requires acknowledgement for a deprecated app until it is given", () => {
    // Arrange
    const { result } = renderHook(() => useDeprecationAcknowledgement(deprecatedManifest));

    expect(result.current.acknowledged).toBe(false);

    // Act
    act(() => result.current.setAcknowledged(true));

    // Assert
    expect(result.current.acknowledged).toBe(true);
  });

  it("resets the acknowledgement when another manifest is fetched", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ current }: { current: InstallDetailsManifestData }) =>
        useDeprecationAcknowledgement(current),
      { initialProps: { current: deprecatedManifest } },
    );

    act(() => result.current.setAcknowledged(true));

    // Act
    rerender({ current: { ...deprecatedManifest } });

    // Assert
    expect(result.current.acknowledged).toBe(false);
  });
});
