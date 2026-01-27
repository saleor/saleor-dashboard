import { useQuery } from "@apollo/client";
import { ChannelDiagnosticsQuery } from "@dashboard/graphql";
import { channelDiagnosticsQuery } from "@dashboard/products/queries";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { runAvailabilityChecks } from "../utils/availabilityChecks";
import {
  AvailabilityIssue,
  ChannelDiagnosticData,
  ChannelSummary,
  DiagnosticsResult,
  ProductDiagnosticData,
} from "../utils/types";

interface UseProductAvailabilityDiagnosticsProps {
  product: ProductDiagnosticData | null | undefined;
  enabled?: boolean;
}

/**
 * Hook to compute product availability diagnostics
 *
 * This hook analyzes the product configuration and channel setup
 * to identify potential issues that would prevent the product
 * from being purchasable.
 */
export function useProductAvailabilityDiagnostics({
  product,
  enabled = true,
}: UseProductAvailabilityDiagnosticsProps): DiagnosticsResult {
  const intl = useIntl();

  // Get channel IDs where product has any listing (including hidden)
  const channelIds = useMemo(() => {
    if (!product?.channelListings) {
      return [];
    }

    return product.channelListings.map(listing => listing.channel.id);
  }, [product?.channelListings]);

  // Fetch channel diagnostic data
  // Note: channels query doesn't support filtering, so we fetch all and filter client-side
  const {
    data: channelData,
    loading,
    error,
  } = useQuery<ChannelDiagnosticsQuery>(channelDiagnosticsQuery, {
    skip: !enabled || channelIds.length === 0,
  });

  // Use state to persist permission errors - Apollo may clear the error on subsequent renders
  // but we want to remember that a permission error occurred
  const [detectedPermissionError, setDetectedPermissionError] = useState<{
    canViewChannelWarehouses: boolean;
    canViewShippingZones: boolean;
  } | null>(null);

  // Detect and persist permission errors when they occur
  useEffect(() => {
    if (error?.message?.includes("permission")) {
      const errorMentionsShipping = error.message.includes("MANAGE_SHIPPING");
      const errorMentionsChannels = error.message.includes("MANAGE_CHANNELS");

      setDetectedPermissionError({
        canViewChannelWarehouses: !errorMentionsChannels,
        canViewShippingZones: !errorMentionsShipping,
      });
    }
  }, [error]);

  // Determine permission status based on what data is available
  // If the query fails with a permission error, or returns null for specific fields,
  // the user lacks the required permissions
  const basePermissions = useMemo(() => {
    // If we've detected a permission error (persisted in state), use that
    if (detectedPermissionError) {
      return detectedPermissionError;
    }

    // If query succeeded, check if specific fields are null (permission denied for sub-fields)
    // Only check if we actually have data (not loading and no error)
    if (!loading && channelData) {
      const canViewChannelWarehouses =
        channelData.channels?.some(c => c.warehouses !== null) ?? false;
      const canViewShippingZones = channelData.shippingZones !== null;

      return {
        canViewChannelWarehouses,
        canViewShippingZones,
      };
    }

    // Still loading or no data yet - assume we don't know permissions
    // Return true to avoid showing "Limited" message prematurely
    return {
      canViewChannelWarehouses: true,
      canViewShippingZones: true,
    };
  }, [channelData, loading, detectedPermissionError]);

  // Compute issues and summaries
  const result = useMemo((): DiagnosticsResult => {
    const defaultPermissions = {
      canViewChannelWarehouses: true,
      canViewShippingZones: true,
      missingPermissions: [] as string[],
    };

    if (!product || !enabled) {
      return {
        issues: [],
        channelSummaries: [],
        hasErrors: false,
        hasWarnings: false,
        isLoading: false,
        permissions: defaultPermissions,
      };
    }

    // Only wait for loading to complete - we can work with partial/missing channel data
    // by falling back to basic info from product's channel listings
    if (loading) {
      return {
        issues: [],
        channelSummaries: [],
        hasErrors: false,
        hasWarnings: false,
        isLoading: true,
        permissions: defaultPermissions,
      };
    }

    const issues: AvailabilityIssue[] = [];
    const channelSummaries: ChannelSummary[] = [];

    // Track if any channel required fallback to basic info (no full channel data)
    let hasChannelWithMissingData = false;

    // Build a map of shipping zones by channel ID
    const shippingZonesByChannel = new Map<string, ChannelDiagnosticData["shippingZones"]>();

    // Only process shipping zones if we have permission to view them and data is available
    if (basePermissions.canViewShippingZones && channelData?.shippingZones?.edges) {
      channelData.shippingZones.edges.forEach(({ node: zone }) => {
        zone.channels?.forEach(channel => {
          const existing = shippingZonesByChannel.get(channel.id) || [];

          shippingZonesByChannel.set(channel.id, [
            ...existing,
            {
              id: zone.id,
              name: zone.name,
              countries: zone.countries || [],
              warehouses: zone.warehouses || [],
            },
          ]);
        });
      });
    }

    // Build summaries for ALL channels where product has a listing
    // Run diagnostic checks only for channels that are active (published or available)
    product.channelListings.forEach(listing => {
      const isPublished = listing.isPublished === true;
      const isAvailableForPurchase = listing.isAvailableForPurchase === true;

      // Try to find full channel details from our query
      const channelFromQuery = channelData?.channels?.find(c => c.id === listing.channel.id);

      // If channel not found in query (user might have channel restrictions),
      // fall back to basic info from the product's channel listing
      const channel = channelFromQuery || {
        id: listing.channel.id,
        name: listing.channel.name,
        slug: listing.channel.slug,
        currencyCode: "", // Unknown without full channel access
        isActive: true, // Assume active - if product is listed, channel likely active
        warehouses: null as Array<{ id: string; name: string }> | null, // Unknown
      };

      // Track if we have full channel data or just basic info
      const hasFullChannelData = !!channelFromQuery;

      // Track if any channel is missing full data
      if (!hasFullChannelData) {
        hasChannelWithMissingData = true;
      }

      const shippingZones = shippingZonesByChannel.get(channel.id) || [];

      // Only run diagnostic checks for channels where product is active
      // Skip warehouse/shipping checks if we don't have permission to view that data
      // Also skip if we don't have full channel data
      if (isPublished || isAvailableForPurchase) {
        const diagnosticData: ChannelDiagnosticData = {
          id: channel.id,
          name: channel.name,
          slug: channel.slug,
          isActive: channel.isActive,
          // Pass empty arrays if we can't view the data - this will skip those checks
          warehouses:
            hasFullChannelData && basePermissions.canViewChannelWarehouses
              ? channel.warehouses || []
              : [],
          shippingZones:
            hasFullChannelData && basePermissions.canViewShippingZones ? shippingZones : [],
        };

        const channelIssues = runAvailabilityChecks(
          product,
          diagnosticData,
          listing,
          intl,
          // Pass permission context to skip checks we can't perform
          // Also skip if we don't have full channel data
          {
            skipWarehouseChecks: !hasFullChannelData || !basePermissions.canViewChannelWarehouses,
            skipShippingChecks: !hasFullChannelData || !basePermissions.canViewShippingZones,
          },
        );

        issues.push(...channelIssues);
      }

      // Collect unique countries from all shipping zones
      const allCountries = new Set<string>();

      if (hasFullChannelData && basePermissions.canViewShippingZones) {
        shippingZones.forEach(zone => {
          zone.countries?.forEach(country => allCountries.add(country.code));
        });
      }

      // Determine if we can show warehouse/shipping data
      // We need both full channel data AND the right permissions
      const canShowWarehouseData = hasFullChannelData && basePermissions.canViewChannelWarehouses;
      const canShowShippingData = hasFullChannelData && basePermissions.canViewShippingZones;

      // Build channel summary for ALL channels (including hidden)
      // Use "unknown" for values we can't determine due to permissions or missing channel data
      channelSummaries.push({
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        currencyCode: channel.currencyCode || "",
        isActive: channel.isActive,
        isPublished,
        publishedAt: listing.publishedAt,
        isAvailableForPurchase,
        availableForPurchaseAt: listing.availableForPurchaseAt,
        visibleInListings: listing.visibleInListings,
        warehouseCount: canShowWarehouseData ? channel.warehouses?.length || 0 : "unknown",
        warehouseNames: canShowWarehouseData ? channel.warehouses?.map(w => w.name) || [] : [],
        shippingZoneCount: canShowShippingData ? shippingZones.length : "unknown",
        shippingZoneNames: canShowShippingData ? shippingZones.map(z => z.name) : [],
        countryCount: canShowShippingData ? allCountries.size : "unknown",
      });
    });

    // Build final permissions with missing permissions list
    const missingPermissions: string[] = [];

    // If we couldn't get warehouse data from channels query
    if (!basePermissions.canViewChannelWarehouses) {
      missingPermissions.push("MANAGE_PRODUCTS");
    }

    // If we couldn't get shipping zones
    if (!basePermissions.canViewShippingZones) {
      missingPermissions.push("MANAGE_SHIPPING");
    }

    // If any channel required fallback (no access to channels list)
    if (hasChannelWithMissingData) {
      // User likely lacks MANAGE_CHANNELS or has channel restrictions
      if (!missingPermissions.includes("MANAGE_CHANNELS")) {
        missingPermissions.push("MANAGE_CHANNELS");
      }
    }

    const permissions = {
      canViewChannelWarehouses:
        basePermissions.canViewChannelWarehouses && !hasChannelWithMissingData,
      canViewShippingZones: basePermissions.canViewShippingZones && !hasChannelWithMissingData,
      missingPermissions,
    };

    return {
      issues,
      channelSummaries,
      hasErrors: issues.some(issue => issue.severity === "error"),
      hasWarnings: issues.some(issue => issue.severity === "warning"),
      isLoading: false,
      permissions,
    };
  }, [product, channelData, loading, enabled, intl, basePermissions]);

  return result;
}
