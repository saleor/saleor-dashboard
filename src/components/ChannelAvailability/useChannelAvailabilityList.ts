import { useEffect, useMemo, useState } from "react";

import { type ChannelAvailabilitySummary } from "./types";
import { filterChannelsBySearch, paginateItems } from "./utils";

const DEFAULT_PAGE_SIZE = 10;

export function useChannelAvailabilityList<T extends ChannelAvailabilitySummary>(
  channels: T[],
  pageSize = DEFAULT_PAGE_SIZE,
  searchEnabled = true,
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedChannelId, setExpandedChannelId] = useState<string | undefined>();
  const effectiveSearchQuery = searchEnabled ? searchQuery : "";

  const filteredChannels = useMemo(
    () => filterChannelsBySearch(channels, effectiveSearchQuery),
    [channels, effectiveSearchQuery],
  );
  const totalPages = Math.ceil(filteredChannels.length / pageSize);
  const paginatedChannels = paginateItems(filteredChannels, currentPage, pageSize);
  const showPagination = filteredChannels.length > pageSize;

  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearchQuery]);

  useEffect(() => {
    if (expandedChannelId && !paginatedChannels.find(channel => channel.id === expandedChannelId)) {
      setExpandedChannelId(undefined);
    }
  }, [paginatedChannels, expandedChannelId]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    expandedChannelId,
    setExpandedChannelId,
    filteredChannels,
    paginatedChannels,
    totalPages,
    showPagination,
    pageSize,
  };
}
