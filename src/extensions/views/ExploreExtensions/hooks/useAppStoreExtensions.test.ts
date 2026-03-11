import { renderHook } from "@testing-library/react-hooks";

import { useAppStoreExtensions } from "./useAppStoreExtensions";

const mockExtensionsResponse = {
  extensionCategories: [
    {
      id: "payments",
      name: { en: "Payments" },
      extensions: [
        {
          id: "1",
          name: { en: "Stripe" },
          description: { en: "Payment gateway" },
          logo: { light: { source: "stripe.svg" }, dark: { source: "stripe.svg" } },
          type: "APP" as const,
          kind: "OFFICIAL" as const,
          manifestUrl: null,
          repositoryUrl: null,
        },
      ],
    },
    {
      id: "cms",
      name: { en: "CMS" },
      extensions: [
        {
          id: "2",
          name: { en: "WordPress" },
          description: { en: "CMS integration" },
          logo: { light: { source: "wp.svg" }, dark: { source: "wp.svg" } },
          type: "APP" as const,
          kind: "OFFICIAL" as const,
          manifestUrl: null,
          repositoryUrl: null,
        },
      ],
    },
    {
      id: "taxes",
      name: { en: "Taxes" },
      extensions: [],
    },
    {
      id: "automation",
      name: { en: "Automation" },
      extensions: [],
    },
  ],
};

global.fetch = jest.fn();

// Mock the dynamic import for fallback
jest.mock("@dashboard/extensions/data/extensions.json", () => ({
  extensionCategories: [],
}));

describe("Extensions / hooks / useAppStoreExtensions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load fallback data when appStoreUrl is not provided", async () => {
    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAppStoreExtensions());

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.isFallback).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isFallback).toBe(true);
  });

  it("should fetch and set data when appStoreUrl is provided", async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockExtensionsResponse),
    });

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppStoreExtensions("https://mockapi.com"),
    );

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.isFallback).toBe(false);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual({
      payments: {
        title: "Payments",
        items: [expect.objectContaining({ id: "1" })],
      },
      cms: {
        title: "CMS",
        items: [expect.objectContaining({ id: "2" })],
      },
      taxes: { title: "Taxes", items: [] },
      automation: { title: "Automation", items: [] },
    });
  });

  it("should handle API errors", async () => {
    // Arrange
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppStoreExtensions("https://mockapi.com"),
    );

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network Error");
    expect(result.current.data).toEqual({});
  });
});
