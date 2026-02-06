import { useQuery } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";
import { IntlProvider } from "react-intl";

import { runAvailabilityChecks } from "../utils/availabilityChecks";
import { ProductDiagnosticData } from "../utils/types";
import { useProductAvailabilityDiagnostics } from "./useProductAvailabilityDiagnostics";

// Mock Apollo's useQuery
jest.mock("@apollo/client", () => ({
  ...(jest.requireActual("@apollo/client") as object),
  useQuery: jest.fn(),
}));

// Mock the availability checks to isolate hook logic
jest.mock("../utils/availabilityChecks", () => ({
  runAvailabilityChecks: jest.fn(() => []),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockRunAvailabilityChecks = runAvailabilityChecks as jest.Mock;

// Wrapper with IntlProvider for useIntl
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

const createMockProduct = (overrides?: Partial<ProductDiagnosticData>): ProductDiagnosticData => ({
  id: "product-123",
  name: "Test Product",
  isShippingRequired: true,
  channelListings: [
    {
      channel: {
        id: "channel-1",
        name: "Default Channel",
        slug: "default-channel",
      },
      isPublished: true,
      publishedAt: "2024-01-01T00:00:00Z",
      isAvailableForPurchase: true,
      availableForPurchaseAt: null,
      visibleInListings: true,
    },
  ],
  variants: [
    {
      id: "variant-1",
      name: "Variant 1",
      channelListings: [
        {
          channel: { id: "channel-1" },
          price: { amount: 10 },
        },
      ],
      stocks: [
        {
          warehouse: { id: "warehouse-1" },
          quantity: 100,
        },
      ],
    },
  ],
  ...overrides,
});

const createMockChannelData = () => ({
  channels: [
    {
      id: "channel-1",
      name: "Default Channel",
      slug: "default-channel",
      currencyCode: "USD",
      isActive: true,
      warehouses: [{ id: "warehouse-1", name: "Main Warehouse" }],
    },
  ],
  shippingZones: {
    edges: [
      {
        node: {
          id: "zone-1",
          name: "US Zone",
          channels: [{ id: "channel-1" }],
          countries: [{ code: "US", country: "United States" }],
          warehouses: [{ id: "warehouse-1", name: "Main Warehouse" }],
        },
      },
    ],
  },
});

describe("useProductAvailabilityDiagnostics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRunAvailabilityChecks.mockReturnValue([]);
  });

  it("should return empty results when product is null", () => {
    // Arrange
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product: null }), {
      wrapper,
    });

    // Assert
    expect(result.current.issues).toEqual([]);
    expect(result.current.channelSummaries).toEqual([]);
    expect(result.current.hasErrors).toBe(false);
    expect(result.current.hasWarnings).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return empty results when disabled", () => {
    // Arrange
    const product = createMockProduct();

    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(
      () => useProductAvailabilityDiagnostics({ product, enabled: false }),
      { wrapper },
    );

    // Assert
    expect(result.current.issues).toEqual([]);
    expect(result.current.channelSummaries).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return loading state while fetching channel data", () => {
    // Arrange
    const product = createMockProduct();

    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.channelSummaries).toEqual([]);
  });

  it("should build channel summaries from product and channel data", () => {
    // Arrange
    const product = createMockProduct();
    const channelData = createMockChannelData();

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.channelSummaries).toHaveLength(1);

    const summary = result.current.channelSummaries[0];

    expect(summary.id).toBe("channel-1");
    expect(summary.name).toBe("Default Channel");
    expect(summary.isPublished).toBe(true);
    expect(summary.isAvailableForPurchase).toBe(true);
    expect(summary.warehouseCount).toBe(1);
    expect(summary.shippingZoneCount).toBe(1);
    expect(summary.countryCount).toBe(1);
  });

  it("should call runAvailabilityChecks for active channels", () => {
    // Arrange
    const product = createMockProduct();
    const channelData = createMockChannelData();

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    // Act
    renderHook(() => useProductAvailabilityDiagnostics({ product }), { wrapper });

    // Assert
    expect(mockRunAvailabilityChecks).toHaveBeenCalled();
  });

  it("should not run checks for channels where product is not published and not available", () => {
    // Arrange
    const product = createMockProduct({
      channelListings: [
        {
          channel: {
            id: "channel-1",
            name: "Default Channel",
            slug: "default-channel",
          },
          isPublished: false, // Not published
          publishedAt: null,
          isAvailableForPurchase: false, // Not available
          availableForPurchaseAt: null,
          visibleInListings: false,
        },
      ],
    });
    const channelData = createMockChannelData();

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    // Act
    renderHook(() => useProductAvailabilityDiagnostics({ product }), { wrapper });

    // Assert - checks should not be run for hidden channels
    expect(mockRunAvailabilityChecks).not.toHaveBeenCalled();
  });

  it("should detect permission errors and update permissions state", () => {
    // Arrange
    const product = createMockProduct();

    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: {
        message: "You need MANAGE_SHIPPING permission to access this resource",
      },
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.permissions.canViewShippingZones).toBe(false);
    expect(result.current.permissions.missingPermissions).toContain("MANAGE_SHIPPING");
  });

  it("should detect when channel warehouses are not accessible", () => {
    // Arrange
    const product = createMockProduct();
    const channelData = {
      channels: [
        {
          id: "channel-1",
          name: "Default Channel",
          slug: "default-channel",
          currencyCode: "USD",
          isActive: true,
          warehouses: null, // No access to warehouses
        },
      ],
      shippingZones: {
        edges: [],
      },
    };

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.permissions.canViewChannelWarehouses).toBe(false);
  });

  it("should handle missing channel data gracefully by falling back to basic info", () => {
    // Arrange - product has a channel listing but channel query doesn't return that channel
    const product = createMockProduct();
    const channelData = {
      channels: [], // Channel not found in query results
      shippingZones: null,
    };

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert - should still have channel summary from product data
    expect(result.current.channelSummaries).toHaveLength(1);
    expect(result.current.channelSummaries[0].name).toBe("Default Channel");
    // Warehouse/shipping counts should be "unknown" due to missing channel data
    expect(result.current.channelSummaries[0].warehouseCount).toBe("unknown");
    expect(result.current.channelSummaries[0].shippingZoneCount).toBe("unknown");
    // Permissions should indicate missing channel access
    expect(result.current.permissions.missingPermissions).toContain("MANAGE_CHANNELS");
  });

  it("should report hasErrors when issues contain errors", () => {
    // Arrange
    const product = createMockProduct();
    const channelData = createMockChannelData();

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    mockRunAvailabilityChecks.mockReturnValue([
      {
        id: "test-error",
        severity: "error",
        channelId: "channel-1",
        channelName: "Default Channel",
        message: "Test error",
        description: "Test description",
      },
    ]);

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.hasErrors).toBe(true);
    expect(result.current.issues).toHaveLength(1);
  });

  it("should report hasWarnings when issues contain warnings", () => {
    // Arrange
    const product = createMockProduct();
    const channelData = createMockChannelData();

    mockUseQuery.mockReturnValue({
      data: channelData,
      loading: false,
      error: null,
    });

    mockRunAvailabilityChecks.mockReturnValue([
      {
        id: "test-warning",
        severity: "warning",
        channelId: "channel-1",
        channelName: "Default Channel",
        message: "Test warning",
        description: "Test description",
      },
    ]);

    // Act
    const { result } = renderHook(() => useProductAvailabilityDiagnostics({ product }), {
      wrapper,
    });

    // Assert
    expect(result.current.hasWarnings).toBe(true);
    expect(result.current.hasErrors).toBe(false);
  });

  it("should skip query when product has no channel listings", () => {
    // Arrange
    const product = createMockProduct({ channelListings: [] });

    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    // Act
    renderHook(() => useProductAvailabilityDiagnostics({ product }), { wrapper });

    // Assert - query should be skipped (skip: true)
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ skip: true }),
    );
  });
});
