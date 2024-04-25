interface ChannelListing {
  channel: {
    id: string;
  };
}

export const useFilteredChannelListing = ({
  channelListing,
  allAvailableListings,
}: {
  allAvailableListings: Array<{ id: string }>;
  channelListing: ChannelListing[] | null | undefined;
}) => {
  if (!channelListing) {
    return [];
  }

  const listingIds = allAvailableListings.map(lst => lst.id);

  return channelListing.filter(channel => listingIds.includes(channel.channel.id));
};
