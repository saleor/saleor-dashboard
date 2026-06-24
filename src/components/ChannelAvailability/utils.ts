import { type ChannelAvailabilitySummary } from "./types";

export const CHANNEL_SEARCH_VISIBILITY_THRESHOLD = 5;

export function filterChannelsBySearch<T extends ChannelAvailabilitySummary>(
  channels: T[],
  searchQuery: string,
): T[] {
  if (!searchQuery.trim()) {
    return channels;
  }

  const query = searchQuery.toLowerCase().trim();

  return channels.filter(
    channel =>
      channel.name.toLowerCase().includes(query) ||
      channel.currencyCode.toLowerCase().includes(query),
  );
}

export function paginateItems<T>(items: T[], currentPage: number, pageSize: number): T[] {
  return items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
}
