import { renderHook } from "@testing-library/react-hooks";

import { comingSoonApp, releasedApp } from "../fixtures";
import useAppstoreApps from "./useAppstoreApps";

const mockApps = [releasedApp, comingSoonApp];

type Fetch = typeof global.fetch;

global.fetch = jest.fn(url => {
  if (url === "https://apps.saleor.io/apps") {
    return Promise.resolve({
      ok: true,
      json: jest.fn(() => Promise.resolve(mockApps)),
    } as unknown as Response);
  }

  if (url === "https://apps.saleor.io/failing-apps-endpoint") {
    return Promise.resolve({
      ok: false,
      statusText: "API error",
    } as unknown as Response);
  }

  return Promise.reject(new Error("API is down"));
}) as Fetch;
describe("apps hooks useAppstoreApps", () => {
  it("should return apps when request to proper appstore url returns apps", async () => {
    // Arrange
    const appstoreUrl = "https://apps.saleor.io/apps";
    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAppstoreApps(appstoreUrl));

    await waitForNextUpdate();
    // Assert
    expect(result.current).toEqual({ data: mockApps });
  });
  it("should return error when request to proper appstore url returns error", async () => {
    // Arrange
    const appstoreUrl = "https://apps.saleor.io/failing-apps-endpoint";
    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAppstoreApps(appstoreUrl));

    await waitForNextUpdate();
    // Assert
    expect(result.current).toEqual({ error: Error("API error") });
  });
  it("should return error when request to wrong appstore url fails", async () => {
    // Arrange
    const appstoreUrl = "https://wrong-appstore.com";
    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAppstoreApps(appstoreUrl));

    await waitForNextUpdate();
    // Assert
    expect(result.current).toEqual({ error: Error("API is down") });
  });
});
