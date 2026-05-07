import { channelUrl } from "@dashboard/channels/urls";
import { type IntlShape } from "react-intl";

import { messages } from "../messages";
import { LEGACY_MODE_FALLBACK } from "./constants";
import {
  type AvailabilityIssue,
  type ChannelDiagnosticData,
  type ProductDiagnosticData,
} from "./types";

interface CheckContext {
  product: ProductDiagnosticData;
  channelData: ChannelDiagnosticData;
  channelListing: ProductDiagnosticData["channelListings"][0];
  intl: IntlShape;
  /**
   * Whether the shop is configured with the legacy shipping-zone-based stock
   * availability behavior. Saleor 3.23 introduced a "direct warehouse-channel"
   * mode (Shop.useLegacyShippingZoneStockAvailability=false) where shipping
   * zones no longer affect stock availability, only the channel-warehouse link
   * does. Some checks become misleading or lose meaning in direct mode.
   */
  useLegacyShippingZoneStockAvailability: boolean;
}

type CheckFunction = (context: CheckContext) => AvailabilityIssue | null;

/**
 * Check if channel is inactive
 */
const checkChannelInactive: CheckFunction = ({ channelData, intl }) => {
  if (!channelData.isActive) {
    return {
      id: "channel-inactive",
      severity: "error",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.channelInactive, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.channelInactiveDescription),
      actionLabel: intl.formatMessage(messages.configureChannel),
      actionUrl: channelUrl(channelData.id),
    };
  }

  return null;
};

/**
 * Check if product has no variants
 */
const checkNoVariants: CheckFunction = ({ product, channelData, intl }) => {
  if (!product.variants || product.variants.length === 0) {
    return {
      id: "no-variants",
      severity: "error",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noVariants),
      description: intl.formatMessage(messages.noVariantsDescription),
    };
  }

  return null;
};

/**
 * Check if no variant is available in the channel
 */
const checkNoVariantInChannel: CheckFunction = ({ product, channelData, intl }) => {
  if (!product.variants || product.variants.length === 0) {
    return null; // Handled by checkNoVariants
  }

  const hasVariantInChannel = product.variants.some(variant =>
    variant.channelListings?.some(listing => listing.channel.id === channelData.id),
  );

  if (!hasVariantInChannel) {
    return {
      id: "no-variant-in-channel",
      severity: "error",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noVariantInChannel, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.noVariantInChannelDescription),
    };
  }

  return null;
};

/**
 * Check if no variant has price set for channel
 */
const checkNoVariantPriced: CheckFunction = ({ product, channelData, intl }) => {
  if (!product.variants || product.variants.length === 0) {
    return null; // Handled by checkNoVariants
  }

  const hasVariantWithPrice = product.variants.some(variant =>
    variant.channelListings?.some(
      listing => listing.channel.id === channelData.id && listing.price !== null,
    ),
  );

  if (!hasVariantWithPrice) {
    return {
      id: "no-variant-priced",
      severity: "error",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noVariantPriced, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.noVariantPricedDescription),
    };
  }

  return null;
};

/**
 * Check if channel has no warehouses assigned
 */
const checkNoWarehouses: CheckFunction = ({ channelData, intl }) => {
  if (!channelData.warehouses || channelData.warehouses.length === 0) {
    return {
      id: "no-warehouses",
      severity: "warning",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noWarehouses, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.noWarehousesDescription),
      actionLabel: intl.formatMessage(messages.configureChannel),
      actionUrl: channelUrl(channelData.id),
    };
  }

  return null;
};

/**
 * Check if channel has no shipping zones assigned.
 *
 * In legacy mode (`useLegacyShippingZoneStockAvailability=true`), the absence
 * of shipping zones blocks customers from purchasing because the legacy stock
 * availability resolver intersects channel warehouses with shipping-zone
 * warehouses. Severity = warning.
 *
 * In direct mode (`useLegacyShippingZoneStockAvailability=false`), the product
 * appears as available via the public API regardless of shipping zones — but
 * the order still cannot be fulfilled without a shipping method. Severity =
 * info, with shipping-only copy.
 */
const checkNoShippingZones: CheckFunction = ({
  channelData,
  intl,
  useLegacyShippingZoneStockAvailability,
}) => {
  if (channelData.shippingZones && channelData.shippingZones.length > 0) {
    return null;
  }

  if (useLegacyShippingZoneStockAvailability) {
    return {
      id: "no-shipping-zones",
      severity: "warning",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noShippingZones, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.noShippingZonesDescription),
      actionLabel: intl.formatMessage(messages.configureChannel),
      actionUrl: channelUrl(channelData.id),
    };
  }

  return {
    id: "no-shipping-zones",
    severity: "info",
    channelId: channelData.id,
    channelName: channelData.name,
    message: intl.formatMessage(messages.noShippingZonesShippingOnly, {
      channelName: channelData.name,
    }),
    description: intl.formatMessage(messages.noShippingZonesShippingOnlyDescription),
    actionLabel: intl.formatMessage(messages.configureChannel),
    actionUrl: channelUrl(channelData.id),
  };
};

/**
 * Check if no stock exists in warehouses for this channel
 */
const checkNoStock: CheckFunction = ({ product, channelData, intl }) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  if (!channelData.warehouses || channelData.warehouses.length === 0) {
    return null; // Handled by checkNoWarehouses
  }

  const channelWarehouseIds = new Set(channelData.warehouses.map(w => w.id));

  const hasStockInChannelWarehouse = product.variants.some(variant =>
    variant.stocks?.some(
      stock => channelWarehouseIds.has(stock.warehouse.id) && stock.quantity > 0,
    ),
  );

  if (!hasStockInChannelWarehouse) {
    return {
      id: "no-stock",
      severity: "warning",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.noStock, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.noStockDescription),
    };
  }

  return null;
};

/**
 * Check if warehouses with stock are not in any shipping zone.
 *
 * Only meaningful under legacy mode, where stock availability is gated by the
 * intersection of channel warehouses and shipping-zone warehouses. Under the
 * direct warehouse-channel mode (Saleor 3.23+ when
 * `useLegacyShippingZoneStockAvailability=false`) shipping zones do not affect
 * `Product.isAvailable` / `quantityAvailable`, so this signal is no longer a
 * purchase blocker and would produce a false positive that contradicts the
 * public API verification.
 */
const checkWarehouseNotInShippingZone: CheckFunction = ({
  product,
  channelData,
  intl,
  useLegacyShippingZoneStockAvailability,
}) => {
  if (!useLegacyShippingZoneStockAvailability) {
    return null;
  }

  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  if (!channelData.warehouses || channelData.warehouses.length === 0) {
    return null;
  }

  if (!channelData.shippingZones || channelData.shippingZones.length === 0) {
    return null; // Handled by checkNoShippingZones
  }

  // Get all warehouse IDs that have stock
  const warehouseIdsWithStock = new Set<string>();

  product.variants.forEach(variant => {
    variant.stocks?.forEach(stock => {
      if (stock.quantity > 0) {
        warehouseIdsWithStock.add(stock.warehouse.id);
      }
    });
  });

  // Get all warehouse IDs that are in shipping zones for this channel
  const warehouseIdsInShippingZones = new Set<string>();

  channelData.shippingZones.forEach(zone => {
    zone.warehouses?.forEach(warehouse => {
      warehouseIdsInShippingZones.add(warehouse.id);
    });
  });

  // Pre-compute channel warehouse IDs for O(1) lookup instead of O(W) scan
  const channelWarehouseIds = new Set(channelData.warehouses.map(w => w.id));

  // Check if any warehouse with stock is also in a shipping zone AND assigned to this channel
  const hasReachableStock = Array.from(warehouseIdsWithStock).some(
    warehouseId =>
      warehouseIdsInShippingZones.has(warehouseId) && channelWarehouseIds.has(warehouseId),
  );

  if (warehouseIdsWithStock.size > 0 && !hasReachableStock) {
    return {
      id: "warehouse-not-in-zone",
      severity: "warning",
      channelId: channelData.id,
      channelName: channelData.name,
      message: intl.formatMessage(messages.warehouseNotInZone, {
        channelName: channelData.name,
      }),
      description: intl.formatMessage(messages.warehouseNotInZoneDescription),
      actionLabel: intl.formatMessage(messages.configureChannel),
      actionUrl: channelUrl(channelData.id),
    };
  }

  return null;
};

/**
 * Surface "stranded" stock: variant has stock in warehouses, but none of those
 * warehouses are assigned to the current channel. This is the most common
 * pitfall when migrating to direct warehouse-channel mode (the warehouse needs
 * to be linked to the channel to count toward stock availability) and is also
 * useful context under legacy mode, where it explains why `checkNoStock` fired.
 *
 * Severity is info — it complements (rather than replaces) the existing
 * `no-stock` warning by pointing at a concrete fix.
 */
const checkStockOutsideChannelWarehouses: CheckFunction = ({ product, channelData, intl }) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  if (!channelData.warehouses) {
    return null;
  }

  const channelWarehouseIds = new Set(channelData.warehouses.map(w => w.id));

  // Collect every warehouse that holds positive stock of any variant.
  const warehousesWithStock = new Set<string>();

  product.variants.forEach(variant => {
    variant.stocks?.forEach(stock => {
      if (stock.quantity > 0) {
        warehousesWithStock.add(stock.warehouse.id);
      }
    });
  });

  if (warehousesWithStock.size === 0) {
    return null;
  }

  const hasStockInChannelWarehouse = Array.from(warehousesWithStock).some(id =>
    channelWarehouseIds.has(id),
  );

  if (hasStockInChannelWarehouse) {
    return null;
  }

  return {
    id: "stock-outside-channel-warehouses",
    severity: "info",
    channelId: channelData.id,
    channelName: channelData.name,
    message: intl.formatMessage(messages.stockOutsideChannelWarehouses, {
      channelName: channelData.name,
    }),
    description: intl.formatMessage(messages.stockOutsideChannelWarehousesDescription),
    actionLabel: intl.formatMessage(messages.configureChannel),
    actionUrl: channelUrl(channelData.id),
  };
};

/**
 * Checks that don't require warehouse/shipping permissions
 */
const coreChecks: CheckFunction[] = [
  checkChannelInactive,
  checkNoVariants,
  checkNoVariantInChannel,
  checkNoVariantPriced,
];

/**
 * Checks that require warehouse visibility
 */
const warehouseChecks: CheckFunction[] = [
  checkNoWarehouses,
  checkNoStock,
  checkStockOutsideChannelWarehouses,
];

/**
 * Checks that require shipping zone visibility
 */
const shippingChecks: CheckFunction[] = [checkNoShippingZones, checkWarehouseNotInShippingZone];

/**
 * Options controlling which checks run and how they interpret the data.
 *
 * `skipWarehouseChecks` / `skipShippingChecks` are typically set based on the
 * current user's permissions — when the user cannot read warehouse or shipping
 * zone data, those checks must be skipped to avoid false positives caused by
 * missing input.
 *
 * `useLegacyShippingZoneStockAvailability` mirrors the
 * `Shop.useLegacyShippingZoneStockAvailability` flag introduced in Saleor 3.23.
 * It changes how some checks reason about stock availability:
 *  - legacy (true): stock visibility is gated by shipping zones; the
 *    `warehouse-not-in-zone` check applies, and missing shipping zones block
 *    purchases.
 *  - direct (false): stock visibility is gated only by the channel-warehouse
 *    link; shipping zones only affect order fulfillment, not availability.
 *
 * Defaults to `true` to preserve the historical behavior for callers that
 * have not yet been updated.
 */
export interface CheckOptions {
  skipWarehouseChecks?: boolean;
  skipShippingChecks?: boolean;
  useLegacyShippingZoneStockAvailability?: boolean;
}

/**
 * Run all availability checks for a product in a specific channel
 */
export function runAvailabilityChecks(
  product: ProductDiagnosticData,
  channelData: ChannelDiagnosticData,
  channelListing: ProductDiagnosticData["channelListings"][0],
  intl: IntlShape,
  options?: CheckOptions,
): AvailabilityIssue[] {
  const useLegacyShippingZoneStockAvailability =
    options?.useLegacyShippingZoneStockAvailability ?? LEGACY_MODE_FALLBACK;

  const context: CheckContext = {
    product,
    channelData,
    channelListing,
    intl,
    useLegacyShippingZoneStockAvailability,
  };

  const issues: AvailabilityIssue[] = [];

  // Always run core checks (variants, pricing, channel status)
  for (const check of coreChecks) {
    const issue = check(context);

    if (issue) {
      issues.push(issue);
    }
  }

  // Run warehouse checks only if we have permission.
  // Note: Warehouse checks run for ALL products (including non-shippable) because:
  // - Non-shippable products may still track inventory (e.g., activation codes, digital license keys)
  // - If a product doesn't track inventory, variant.stocks will be empty and checks will pass
  if (!options?.skipWarehouseChecks) {
    for (const check of warehouseChecks) {
      const issue = check(context);

      if (issue) {
        issues.push(issue);
      }
    }
  }

  // Run shipping checks only if:
  // 1. We have permission (skipShippingChecks is not set)
  // 2. Product requires shipping (non-shippable products don't need shipping configuration)
  const shouldRunShippingChecks = !options?.skipShippingChecks && product.isShippingRequired;

  if (shouldRunShippingChecks) {
    for (const check of shippingChecks) {
      const issue = check(context);

      if (issue) {
        issues.push(issue);
      }
    }
  }

  return issues;
}
