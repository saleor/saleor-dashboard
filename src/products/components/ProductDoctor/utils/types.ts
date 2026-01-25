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
  isAvailableForPurchase: boolean;
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
