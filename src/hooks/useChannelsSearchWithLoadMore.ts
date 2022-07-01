import { useBaseChannelsQuery } from "@saleor/graphql";
import chunk from "lodash/chunk";
import compact from "lodash/compact";
import concat from "lodash/concat";
import { useEffect, useState } from "react";

import {
  ChannelsWithLoadMoreProps,
  useChannelsSearch,
} from "./useChannelsSearch";

const DEFAULT_ITEMS_PER_PAGE = 6;
const INITIAL_INDEX = 0;

export const useChannelsSearchWithLoadMore = (
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE,
): ChannelsWithLoadMoreProps => {
  const { data, loading } = useBaseChannelsQuery({});

  const {
    query,
    onQueryChange: onSearchChange,
    filteredChannels,
  } = useChannelsSearch(data?.channels);

  const allChannelsChunks = chunk(filteredChannels, itemsPerPage);

  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [currentChannelsChunks, setCurrentChannelsChunks] = useState([]);

  const handleAddInitialChunk = () => {
    if (data?.channels && !loading) {
      setCurrentChannelsChunks([allChannelsChunks[INITIAL_INDEX]]);
    }
  };

  useEffect(handleAddInitialChunk, [loading, query]);

  const onFetchMore = () => {
    if (!hasMore) {
      return;
    }

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const newChunk = allChannelsChunks[newIndex];
    setCurrentChannelsChunks([...currentChannelsChunks, newChunk]);
  };

  const hasMore = allChannelsChunks.length > currentChannelsChunks.length;

  const channels = compact(concat([], ...currentChannelsChunks));

  const totalCount = data?.channels.length;

  return {
    query,
    onSearchChange,
    channels,
    hasMore,
    totalCount,
    onFetchMore,
    loading,
  };
};
