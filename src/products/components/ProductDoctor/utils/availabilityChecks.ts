import { channelUrl } from "@dashboard/channels/urls";
import { IntlShape } from "react-intl";

import { messages } from "../messages";
import { AvailabilityIssue, ChannelDiagnosticData, ProductDiagnosticData } from "./types";

interface CheckContext {
  product: ProductDiagnosticData;
  channelData: ChannelDiagnosticData;
  channelListing: ProductDiagnosticData["channelListings"][0];
  intl: IntlShape;
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
 * Check if channel has no shipping zones assigned
 */
const checkNoShippingZones: CheckFunction = ({ channelData, intl }) => {
  if (!channelData.shippingZones || channelData.shippingZones.length === 0) {
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

  return null;
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
 * Check if warehouses with stock are not in any shipping zone
 */
const checkWarehouseNotInShippingZone: CheckFunction = ({ product, channelData, intl }) => {
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
const warehouseChecks: CheckFunction[] = [checkNoWarehouses, checkNoStock];

/**
 * Checks that require shipping zone visibility
 */
const shippingChecks: CheckFunction[] = [checkNoShippingZones, checkWarehouseNotInShippingZone];

/**
 * Options to skip certain check categories.
 * These are typically set based on user permissions - if the user cannot view
 * warehouse or shipping zone data, the corresponding checks should be skipped
 * to avoid false positives from missing data.
 */
interface CheckSkipOptions {
  /** Skip warehouse/stock checks (set when user lacks warehouse view permissions) */
  skipWarehouseChecks?: boolean;
  /** Skip shipping zone checks (set when user lacks shipping zone view permissions) */
  skipShippingChecks?: boolean;
}

/**
 * Run all availability checks for a product in a specific channel
 */
export function runAvailabilityChecks(
  product: ProductDiagnosticData,
  channelData: ChannelDiagnosticData,
  channelListing: ProductDiagnosticData["channelListings"][0],
  intl: IntlShape,
  skipOptions?: CheckSkipOptions,
): AvailabilityIssue[] {
  const context: CheckContext = {
    product,
    channelData,
    channelListing,
    intl,
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
  if (!skipOptions?.skipWarehouseChecks) {
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
  const shouldRunShippingChecks = !skipOptions?.skipShippingChecks && product.isShippingRequired;

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
