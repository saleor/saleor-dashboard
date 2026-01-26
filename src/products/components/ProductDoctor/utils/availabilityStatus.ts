import { ChannelSummary } from "./types";

/**
 * Determines the visibility status of a product in a channel.
 *
 * @param summary - Channel summary with publication info
 * @param dateNow - Current timestamp in milliseconds (pass Date.now() or a fixed value for testing)
 * @returns "live" if visible, "scheduled" if will become visible in future, "hidden" if not published
 */
export const getAvailabilityStatus = (
  summary: ChannelSummary,
  dateNow: number,
): "live" | "scheduled" | "hidden" => {
  // Product is not published - hidden from public API
  if (!summary.isPublished) {
    return "hidden";
  }

  // Check if publication date is in the future (scheduled)
  // Note: Saleor auto-sets publishedAt to current server time when publishing without a date
  // We add a small tolerance (2 seconds) to avoid "scheduled" flash due to clock differences
  const CLOCK_TOLERANCE_MS = 2000;
  const publishedAtTime = summary.publishedAt ? Date.parse(summary.publishedAt) : null;
  const isScheduledForFuture =
    publishedAtTime !== null && publishedAtTime > dateNow + CLOCK_TOLERANCE_MS;

  if (isScheduledForFuture) {
    return "scheduled"; // Will become visible when date arrives
  }

  // Product is visible (published with past/no date)
  return "live";
};

/**
 * Determines if a product is currently available for purchase in a channel.
 *
 * Note: This checks if availableForPurchaseAt date is in the past.
 * Returns false if no date is set (product needs a date to be purchasable).
 *
 * @param summary - Channel summary with availability info
 * @param dateNow - Current timestamp in milliseconds
 * @returns true if product can be purchased now
 */
export const isPurchasable = (summary: ChannelSummary, dateNow: number): boolean => {
  const availableAtTime = summary.availableForPurchaseAt
    ? Date.parse(summary.availableForPurchaseAt)
    : null;

  if (availableAtTime === null) {
    return false;
  }

  return availableAtTime <= dateNow;
};
