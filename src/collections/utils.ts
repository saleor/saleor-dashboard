import { ChannelCollectionData } from "@saleor/channels/utils";

export const createChannelsChangeHandler = (
  channelListing: ChannelCollectionData[],
  updateChannels: (data: ChannelCollectionData[]) => void,
  triggerChange: () => void
) => (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => {
  const channelIndex = channelListing.findIndex(channel => channel.id === id);
  const channel = channelListing[channelIndex];

  const updatedChannels = [
    ...channelListing.slice(0, channelIndex),
    {
      ...channel,
      ...data
    },
    ...channelListing.slice(channelIndex + 1)
  ];
  updateChannels(updatedChannels);
  triggerChange();
};
