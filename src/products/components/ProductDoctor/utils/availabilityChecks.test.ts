import { IntlShape, MessageDescriptor } from "react-intl";

import { runAvailabilityChecks } from "./availabilityChecks";
import { ChannelDiagnosticData, ProductDiagnosticData } from "./types";

// Mock intl for testing - validates that message placeholders are provided
const createMockIntl = (): IntlShape =>
  ({
    formatMessage: (descriptor: MessageDescriptor, values?: Record<string, unknown>) => {
      const message = String(descriptor.defaultMessage ?? "");

      // Extract placeholders like {channelName} from the message
      const placeholders: string[] = message.match(/\{(\w+)\}/g) ?? [];

      // Verify all placeholders have corresponding values
      placeholders.forEach((placeholder: string) => {
        const key = placeholder.slice(1, -1); // Remove { and }

        if (!values || !(key in values)) {
          throw new Error(`Missing value for placeholder "${key}" in message: "${message}"`);
        }
      });

      // Replace placeholders with values for readable test output
      let result = message;

      if (values) {
        Object.entries(values).forEach(([key, value]) => {
          result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
        });
      }

      return result;
    },
  }) as unknown as IntlShape;

const mockIntl = createMockIntl();

// Helper to create a minimal product diagnostic data
const createProduct = (overrides: Partial<ProductDiagnosticData> = {}): ProductDiagnosticData => ({
  id: "product-1",
  name: "Test Product",
  isShippingRequired: true,
  channelListings: [
    {
      channel: { id: "channel-1", name: "Default Channel", slug: "default-channel" },
      isPublished: true,
      publishedAt: "2024-01-01T00:00:00Z",
      isAvailableForPurchase: true,
      availableForPurchaseAt: "2024-01-01T00:00:00Z",
      visibleInListings: true,
    },
  ],
  variants: [
    {
      id: "variant-1",
      name: "Variant A",
      channelListings: [{ channel: { id: "channel-1" }, price: { amount: 10.0 } }],
      stocks: [{ warehouse: { id: "warehouse-1" }, quantity: 100 }],
    },
  ],
  ...overrides,
});

// Helper to create channel diagnostic data
const createChannelData = (
  overrides: Partial<ChannelDiagnosticData> = {},
): ChannelDiagnosticData => ({
  id: "channel-1",
  name: "Default Channel",
  slug: "default-channel",
  isActive: true,
  warehouses: [{ id: "warehouse-1", name: "Main Warehouse" }],
  shippingZones: [],
  ...overrides,
});

describe("runAvailabilityChecks", () => {
  describe("shipping checks for shippable products", () => {
    it("should return no-shipping-zones warning for shippable product without shipping zones", () => {
      // Arrange
      const product = createProduct({ isShippingRequired: true });
      const channelData = createChannelData({ shippingZones: [] });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert
      const shippingIssue = issues.find(i => i.id === "no-shipping-zones");

      expect(shippingIssue).toBeDefined();
      expect(shippingIssue?.severity).toBe("warning");
    });

    it("should return warehouse-not-in-zone warning when stock is not reachable via shipping", () => {
      // Arrange
      const product = createProduct({ isShippingRequired: true });
      const channelData = createChannelData({
        shippingZones: [
          {
            id: "zone-1",
            name: "Zone 1",
            countries: [{ code: "US", country: "United States" }],
            // Warehouse in zone is different from warehouse with stock
            warehouses: [{ id: "warehouse-other", name: "Other Warehouse" }],
          },
        ],
      });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert
      const zoneIssue = issues.find(i => i.id === "warehouse-not-in-zone");

      expect(zoneIssue).toBeDefined();
      expect(zoneIssue?.severity).toBe("warning");
    });

    it("should NOT return shipping warnings when properly configured", () => {
      // Arrange - shippable product with correct shipping zone configuration
      const product = createProduct({ isShippingRequired: true });
      const channelData = createChannelData({
        shippingZones: [
          {
            id: "zone-1",
            name: "Zone 1",
            countries: [{ code: "US", country: "United States" }],
            // Same warehouse as product stock - properly configured
            warehouses: [{ id: "warehouse-1", name: "Main Warehouse" }],
          },
        ],
      });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert - no shipping-related warnings
      const shippingIssues = issues.filter(
        i => i.id === "no-shipping-zones" || i.id === "warehouse-not-in-zone",
      );

      expect(shippingIssues).toHaveLength(0);
    });
  });

  describe("shipping checks for non-shippable products", () => {
    it("should NOT return no-shipping-zones warning for non-shippable product", () => {
      // Arrange - digital product that doesn't require shipping
      const product = createProduct({ isShippingRequired: false });
      const channelData = createChannelData({ shippingZones: [] });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert
      const shippingIssue = issues.find(i => i.id === "no-shipping-zones");

      expect(shippingIssue).toBeUndefined();
    });

    it("should NOT return warehouse-not-in-zone warning for non-shippable product", () => {
      // Arrange - digital product with stock but no shipping zone coverage
      const product = createProduct({ isShippingRequired: false });
      const channelData = createChannelData({
        shippingZones: [
          {
            id: "zone-1",
            name: "Zone 1",
            countries: [{ code: "US", country: "United States" }],
            // Warehouse in zone is different from warehouse with stock
            warehouses: [{ id: "warehouse-other", name: "Other Warehouse" }],
          },
        ],
      });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert
      const zoneIssue = issues.find(i => i.id === "warehouse-not-in-zone");

      expect(zoneIssue).toBeUndefined();
    });

    it("should still run warehouse checks for non-shippable products", () => {
      // Arrange - digital product that tracks inventory but has no warehouses
      const product = createProduct({ isShippingRequired: false });
      const channelData = createChannelData({ warehouses: [] });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert - warehouse warning should still appear
      const warehouseIssue = issues.find(i => i.id === "no-warehouses");

      expect(warehouseIssue).toBeDefined();
      expect(warehouseIssue?.severity).toBe("warning");
    });

    it("should still run core checks for non-shippable products", () => {
      // Arrange - digital product with no variants
      const product = createProduct({
        isShippingRequired: false,
        variants: [],
      });
      const channelData = createChannelData();
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl);

      // Assert - core checks should still run
      const noVariantsIssue = issues.find(i => i.id === "no-variants");

      expect(noVariantsIssue).toBeDefined();
      expect(noVariantsIssue?.severity).toBe("error");
    });
  });

  describe("skip options", () => {
    it("should skip warehouse checks when skipWarehouseChecks is true", () => {
      // Arrange
      const product = createProduct({ isShippingRequired: true });
      const channelData = createChannelData({ warehouses: [] });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl, {
        skipWarehouseChecks: true,
      });

      // Assert
      const warehouseIssue = issues.find(i => i.id === "no-warehouses");

      expect(warehouseIssue).toBeUndefined();
    });

    it("should skip shipping checks when skipShippingChecks is true even for shippable products", () => {
      // Arrange
      const product = createProduct({ isShippingRequired: true });
      const channelData = createChannelData({ shippingZones: [] });
      const channelListing = product.channelListings[0];

      // Act
      const issues = runAvailabilityChecks(product, channelData, channelListing, mockIntl, {
        skipShippingChecks: true,
      });

      // Assert
      const shippingIssue = issues.find(i => i.id === "no-shipping-zones");

      expect(shippingIssue).toBeUndefined();
    });
  });
});
