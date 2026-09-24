import { renderHook } from "@testing-library/react";

import { useAnalytics } from "./useAnalytics";

const mockCapture = jest.fn();
const mockRegister = jest.fn();
const mockIdentify = jest.fn();
const mockRegisterRoute = jest.fn();
let mockRouteChangeCallback: ((location: { pathname: string }) => void) | undefined;
const mockPostHog = {
  capture: mockCapture,
  get_distinct_id: () => "anonymous-id",
  identify: mockIdentify,
  register: mockRegister,
};

jest.mock("posthog-js/react", () => ({
  usePostHog: () => mockPostHog,
}));

jest.mock("../Router/useRouteChange", () => ({
  useRouteChange: (onChange: (location: { pathname: string }) => void) => {
    mockRouteChangeCallback = onChange;

    return {
      register: mockRegisterRoute,
    };
  },
}));

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteChangeCallback = undefined;
  });

  it("keeps the event tracker stable between renders", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useAnalytics());
    const initialTrackEvent = result.current.trackEvent;

    // Act
    rerender();

    // Assert
    expect(result.current.trackEvent).toBe(initialTrackEvent);
  });

  it("registers version context without changing the anonymous identity policy", () => {
    // Arrange
    const { result } = renderHook(() => useAnalytics());
    const context = {
      dashboard_version: "v3.23.33",
      saleor_version: "3.23.0",
    };
    const userProperties = {
      domain: "example.saleor.cloud",
      email_domain: "example.com",
    };

    // Act
    result.current.initialize(userProperties, context);

    // Assert
    expect(mockRegisterRoute).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith(context);
    expect(mockIdentify).toHaveBeenCalledWith("anonymous-id", userProperties);
  });

  it.each([
    ["/orders/T3JkZXI6MTIz", "orders", "/orders/:id"],
    ["/configuration/taxes", "configuration", "/configuration/taxes"],
    ["/", "home", "/"],
  ])("registers dashboard area for route %s", (pathname, expectedArea, expectedNormalizedPath) => {
    // Arrange
    renderHook(() => useAnalytics());

    // Act
    mockRouteChangeCallback?.({ pathname });

    // Assert
    expect(mockRegister).toHaveBeenCalledWith({ dashboard_area: expectedArea });
    expect(mockCapture).toHaveBeenCalledWith("$pageview", {
      normalized_path: expectedNormalizedPath,
    });
  });
});
