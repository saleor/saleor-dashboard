import { renderHook } from "@testing-library/react-hooks";

import { useEnvLink } from "./useEnvLink";

describe("useEnvLink", () => {
  it("should return link to the cloud environment on production.", () => {
    // Arrange
    const cloudHref =
      "https://cloud.saleor.io/env/test.com?utm_source=dashboard&utm_content=sidebar_button";
    delete (window as { location?: unknown }).location;
    // @ts-expect-error error
    window.location = { hostname: "test.com" };

    // Act
    const { result } = renderHook(() => useEnvLink());

    // Assert
    expect(result.current).toBe(cloudHref);
  });
  it("should return link to the cloud environment on staging", () => {
    // Arrange
    const stagingHref =
      "https://staging-cloud.saleor.io/env/test.staging.com?utm_source=dashboard&utm_content=sidebar_button";
    delete (window as { location?: unknown }).location;
    // @ts-expect-error error
    window.location = { hostname: "test.staging.com" };

    // Act
    const { result } = renderHook(() => useEnvLink());

    // Assert
    expect(result.current).toBe(stagingHref);
  });
});
