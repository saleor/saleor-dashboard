import { ProductChannelListingAddInput } from "@dashboard/graphql";
import { areChannelFieldsDifferent } from "@dashboard/products/components/ProductUpdatePage/formChannels";

import { AvailabilityIssue, ChannelSummary } from "./types";

/**
 * Groups availability issues by channel ID for efficient lookup.
 *
 * @param issues - Array of availability issues
 * @returns Map of channel ID to array of issues for that channel
 */
export function groupIssuesByChannel(
  issues: AvailabilityIssue[],
): Map<string, AvailabilityIssue[]> {
  const map = new Map<string, AvailabilityIssue[]>();

  issues.forEach(issue => {
    const existing = map.get(issue.channelId) || [];

    map.set(issue.channelId, [...existing, issue]);
  });

  return map;
}

/**
 * Determines which channels have unsaved changes (dirty state).
 *
 * @param channelSummaries - Original channel summaries from server
 * @param formChannelData - Current form state for channel listings
 * @returns Array of channel IDs that have pending changes
 */
export function getDirtyChannelIds(
  channelSummaries: ChannelSummary[],
  formChannelData: ProductChannelListingAddInput[] | undefined,
): string[] {
  if (!formChannelData) {
    return [];
  }

  return channelSummaries
    .filter(summary => {
      const formData = formChannelData.find(fc => fc.channelId === summary.id);

      if (!formData) {
        return false;
      }

      return areChannelFieldsDifferent(formData, summary);
    })
    .map(summary => summary.id);
}

/**
 * Filters channel summaries by search query.
 * Matches against channel name and currency code.
 *
 * @param summaries - Channel summaries to filter
 * @param searchQuery - Search query string
 * @returns Filtered summaries matching the query
 */
export function filterChannelsBySearch(
  summaries: ChannelSummary[],
  searchQuery: string,
): ChannelSummary[] {
  if (!searchQuery.trim()) {
    return summaries;
  }

  const query = searchQuery.toLowerCase().trim();

  return summaries.filter(
    summary =>
      summary.name.toLowerCase().includes(query) ||
      summary.currencyCode.toLowerCase().includes(query),
  );
}

/**
 * Paginates an array of items.
 *
 * @param items - Array of items to paginate
 * @param currentPage - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Slice of items for the current page
 */
export function paginateItems<T>(items: T[], currentPage: number, pageSize: number): T[] {
  return items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
}

/**
 * Counts issues by severity.
 *
 * @param issues - Array of availability issues
 * @returns Object with error and warning counts
 */
export function countIssuesBySeverity(issues: AvailabilityIssue[]): {
  errorCount: number;
  warningCount: number;
} {
  return {
    errorCount: issues.filter(i => i.severity === "error").length,
    warningCount: issues.filter(i => i.severity === "warning").length,
  };
}
