type IssueSeverity = "error" | "warning" | "info";

export interface AvailabilityIssue {
  id: string;
  severity: IssueSeverity;
  channelId: string;
  channelName: string;
  message: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ChannelDiagnosticData {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  warehouses: Array<{
    id: string;
    name: string;
  }>;
  shippingZones: Array<{
    id: string;
    name: string;
    countries: Array<{
      code: string;
      country: string;
    }>;
    warehouses: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

export interface ProductDiagnosticData {
  id: string;
  name: string;
  /**
   * Whether the product type requires shipping (from productType.isShippingRequired).
   *
   * This flag affects which diagnostic checks run:
   * - When true: All checks run (shipping zones, warehouses, stock, etc.)
   * - When false: Shipping zone checks are skipped (non-shippable products don't need shipping)
   *
   * Note: Warehouse/stock checks still run for non-shippable products because they may
   * track inventory (e.g., activation codes, digital license keys). If a product doesn't
   * track inventory, variant.stocks will be empty and warehouse checks will pass naturally.
   */
  isShippingRequired: boolean;
  channelListings: Array<{
    channel: {
      id: string;
      name: string;
      slug: string;
    };
    isPublished: boolean;
    publishedAt: string | null;
    isAvailableForPurchase: boolean | null;
    availableForPurchaseAt: string | null;
    visibleInListings: boolean;
  }>;
  variants: Array<{
    id: string;
    name: string;
    channelListings: Array<{
      channel: {
        id: string;
      };
      price: {
        amount: number;
      } | null;
    }>;
    stocks: Array<{
      warehouse: {
        id: string;
      };
      quantity: number;
    }>;
  }>;
}

export interface ChannelSummary {
  id: string;
  name: string;
  slug: string;
  currencyCode: string;
  isActive: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  /** Note: This is COMPUTED by Saleor, not stored. Use availableForPurchaseAt !== null to check if enabled. */
  isAvailableForPurchase: boolean | null;
  availableForPurchaseAt: string | null;
  visibleInListings: boolean;
  // These can be "unknown" when user lacks permissions to view the data
  warehouseCount: number | "unknown";
  warehouseNames: string[];
  shippingZoneCount: number | "unknown";
  shippingZoneNames: string[];
  countryCount: number | "unknown";
}

// Status is inferred from getAvailabilityStatus return type

export interface DiagnosticsPermissions {
  canViewChannelWarehouses: boolean;
  canViewShippingZones: boolean;
  // Permissions that would be needed to see full diagnostics
  missingPermissions: string[];
}

export interface DiagnosticsResult {
  issues: AvailabilityIssue[];
  channelSummaries: ChannelSummary[];
  hasErrors: boolean;
  hasWarnings: boolean;
  isLoading: boolean;
  permissions: DiagnosticsPermissions;
}
