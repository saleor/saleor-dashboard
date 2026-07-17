/** Show channel search once the matrix would benefit from filtering (~10 rows). */
export const CHANNEL_MATRIX_SEARCH_THRESHOLD = 10;

/** Up to this many visible rows fit without vertical scroll. */
export const CHANNEL_MATRIX_SCROLL_THRESHOLD = 5;

export interface ChannelMatrixRow {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ChannelMatrixFilterOptions {
  query: string;
  hideInactive: boolean;
}

export const sortChannelsForMatrix = <T extends ChannelMatrixRow>(channels: T[]): T[] =>
  [...channels].sort((left, right) => {
    if (left.isActive !== right.isActive) {
      return left.isActive ? -1 : 1;
    }

    return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });

export const filterChannelsForMatrix = <T extends ChannelMatrixRow>(
  channels: T[],
  { query, hideInactive }: ChannelMatrixFilterOptions,
): T[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return channels.filter(channel => {
    if (hideInactive && !channel.isActive) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      channel.name.toLowerCase().includes(normalizedQuery) ||
      channel.slug.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const getVisibleChannelsForMatrix = <T extends ChannelMatrixRow>(
  channels: T[],
  options: ChannelMatrixFilterOptions,
): T[] => filterChannelsForMatrix(sortChannelsForMatrix(channels), options);
