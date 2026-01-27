import { act, renderHook } from "@testing-library/react-hooks";

import { usePublicApiVerification } from "./usePublicApiVerification";

// Mock the config module
jest.mock("@dashboard/config", () => ({
  getAbsoluteApiUrl: jest.fn(() => "https://api.example.com/graphql/"),
}));

// Mock global fetch
const mockFetch = jest.fn();

global.fetch = mockFetch;

describe("usePublicApiVerification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial state", () => {
    // Arrange & Act
    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Assert
    expect(result.current.isVerifying).toBe(false);
    expect(result.current.results.size).toBe(0);
    expect(result.current.lastVerified).toBeNull();
    expect(result.current.summary).toEqual({
      totalChannels: 0,
      completedChannels: 0,
      purchasableChannels: 0,
      hasAnyResults: false,
    });
  });

  it("should verify channel and return success result when product is found", async () => {
    // Arrange
    const mockResponse = {
      data: {
        product: {
          id: "product-123",
          name: "Test Product",
          isAvailable: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: null,
          variants: [
            { id: "variant-1", name: "Variant 1", quantityAvailable: 10 },
            { id: "variant-2", name: "Variant 2", quantityAvailable: 0 },
          ],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult).toBeDefined();
    expect(channelResult?.status).toBe("success");
    expect(channelResult?.result?.productFound).toBe(true);
    expect(channelResult?.result?.isAvailable).toBe(true);
    expect(channelResult?.result?.variantsWithStock).toBe(1); // Only variant-1 has stock > 0
    expect(channelResult?.result?.totalVariants).toBe(2);
  });

  it("should return productFound=false when product is not visible via public API", async () => {
    // Arrange - product is null (not published/visible)
    const mockResponse = {
      data: {
        product: null,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult?.status).toBe("success");
    expect(channelResult?.result?.productFound).toBe(false);
    expect(channelResult?.result?.isAvailable).toBeNull();
  });

  it("should handle GraphQL errors", async () => {
    // Arrange
    const mockResponse = {
      errors: [{ message: "Channel not found" }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "invalid-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult?.status).toBe("error");
    expect(channelResult?.error).toBe("Channel not found");
    expect(channelResult?.result).toBeNull();
  });

  it("should handle network errors", async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult?.status).toBe("error");
    expect(channelResult?.error).toBe("Network error");
  });

  it("should handle HTTP errors", async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult?.status).toBe("error");
    expect(channelResult?.error).toBe("HTTP error: 500 Internal Server Error");
  });

  it("should verify all channels in parallel", async () => {
    // Arrange
    const mockResponse1 = {
      data: {
        product: {
          id: "product-123",
          name: "Test Product",
          isAvailable: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: null,
          variants: [{ id: "variant-1", name: "Variant 1", quantityAvailable: 10 }],
        },
      },
    };

    const mockResponse2 = {
      data: {
        product: null,
      },
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse2),
      });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyAllChannels([
        { id: "channel-1", slug: "channel-1-slug" },
        { id: "channel-2", slug: "channel-2-slug" },
      ]);
    });

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.current.results.size).toBe(2);
    expect(result.current.lastVerified).not.toBeNull();
    expect(result.current.summary.totalChannels).toBe(2);
    expect(result.current.summary.completedChannels).toBe(2);
  });

  it("should clear results", async () => {
    // Arrange
    const mockResponse = {
      data: {
        product: {
          id: "product-123",
          name: "Test Product",
          isAvailable: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: null,
          variants: [],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    expect(result.current.results.size).toBe(1);

    // Act
    act(() => {
      result.current.clearResults();
    });

    // Assert
    expect(result.current.results.size).toBe(0);
    expect(result.current.lastVerified).toBeNull();
    expect(result.current.isVerifying).toBe(false);
  });

  it("should count variants with null quantityAvailable as having stock", async () => {
    // Arrange - null quantityAvailable means "not tracked" or "unlimited"
    const mockResponse = {
      data: {
        product: {
          id: "product-123",
          name: "Test Product",
          isAvailable: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: null,
          variants: [
            { id: "variant-1", name: "Variant 1", quantityAvailable: null }, // Not tracked = available
            { id: "variant-2", name: "Variant 2", quantityAvailable: 0 }, // Out of stock
            { id: "variant-3", name: "Variant 3", quantityAvailable: 5 }, // Has stock
          ],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "default-channel");
    });

    // Assert
    const channelResult = result.current.getChannelResult("channel-1");

    expect(channelResult?.result?.variantsWithStock).toBe(2); // variant-1 (null) and variant-3 (5)
    expect(channelResult?.result?.totalVariants).toBe(3);
  });

  it("should compute purchasable channels correctly in summary", async () => {
    // Arrange - one purchasable, one not found
    const mockResponse1 = {
      data: {
        product: {
          id: "product-123",
          name: "Test Product",
          isAvailable: true,
          isAvailableForPurchase: true,
          availableForPurchaseAt: null,
          variants: [{ id: "variant-1", name: "Variant 1", quantityAvailable: 10 }],
        },
      },
    };

    const mockResponse2 = {
      data: {
        product: null, // Not visible
      },
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse2),
      });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyAllChannels([
        { id: "channel-1", slug: "channel-1-slug" },
        { id: "channel-2", slug: "channel-2-slug" },
      ]);
    });

    // Assert
    expect(result.current.summary.purchasableChannels).toBe(1); // Only channel-1 is purchasable
    expect(result.current.summary.totalChannels).toBe(2);
  });

  it("should make unauthenticated request with correct headers", async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { product: null } }),
    });

    const { result } = renderHook(() => usePublicApiVerification("product-123"));

    // Act
    await act(async () => {
      await result.current.verifyChannel("channel-1", "test-channel");
    });

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql/",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: expect.stringContaining("product-123"),
      }),
    );
  });
});
