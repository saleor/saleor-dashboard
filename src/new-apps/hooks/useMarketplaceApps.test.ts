// @ts-strict-ignore
import { renderHook } from "@testing-library/react-hooks";

import { comingSoonApp, releasedApp } from "../fixtures";
import useMarketplaceApps from "./useMarketplaceApps";

const mockApps = [releasedApp, comingSoonApp];

global.fetch = jest.fn(url => {
  if (url === "https://marketplace.com/apps") {
    return Promise.resolve({
      ok: true,
      json: jest.fn(() => Promise.resolve(mockApps)),
    } as unknown as Response);
  }
  if (url === "https://marketplace.com/failing-apps-endpoint") {
    return Promise.resolve({
      ok: false,
      statusText: "API error",
    } as unknown as Response);
  }
  return Promise.reject(new Error("API is down"));
});

describe("apps hooks useMarketplaceApps", () => {
  it("should return apps when request to proper marketplace url returns apps", async () => {
    // Arrange
    const marketplaceUrl = "https://marketplace.com/apps";

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useMarketplaceApps(marketplaceUrl),
    );
    await waitForNextUpdate();

    // Assert
    expect(result.current).toEqual({ data: mockApps });
  });

  it("should return error when request to proper marketplace url returns error", async () => {
    // Arrange
    const marketplaceUrl = "https://marketplace.com/failing-apps-endpoint";

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useMarketplaceApps(marketplaceUrl),
    );
    await waitForNextUpdate();

    // Assert
    expect(result.current).toEqual({ error: Error("API error") });
  });

  it("should return error when request to wrong marketplace url fails", async () => {
    // Arrange
    const marketplaceUrl = "https://wrong-marketplace.com";

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useMarketplaceApps(marketplaceUrl),
    );
    await waitForNextUpdate();

    // Assert
    expect(result.current).toEqual({ error: Error("API is down") });
  });
});
