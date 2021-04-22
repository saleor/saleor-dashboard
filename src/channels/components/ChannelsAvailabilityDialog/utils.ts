import { useChannelsList } from "@saleor/channels/queries";
import { filter } from "fuzzaldrin";
import { compact } from "lodash-es";
import chunk from "lodash-es/chunk";
import concat from "lodash-es/concat";
import React, { useEffect, useState } from "react";

const DEFAULT_ITEMS_PER_PAGE = 2;
const INITIAL_INDEX = 0;

export const useChannelsSearch = function<T extends { name: string }>(
  channels: T[]
) {
  const [query, onQueryChange] = React.useState("");
  const filteredChannels =
    filter<T, "name">(channels, query, { key: "name" }) || [];

  return { query, onQueryChange, filteredChannels };
};

export const useChannelsSearchWithLoadMore = (
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
) => {
  const { data, loading } = useChannelsList({});

  const { query, onQueryChange, filteredChannels } = useChannelsSearch(
    data?.channels
  );

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

  const channels = compact(concat(...currentChannelsChunks));

  const totalCount = data?.channels.length;

  return {
    query,
    onQueryChange,
    channels,
    hasMore,
    totalCount,
    onFetchMore,
    loading
  };
};
