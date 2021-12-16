import { ChannelCollectionData } from "@saleor/channels/utils";

export const createChannelsChangeHandler = (
  channelListings: ChannelCollectionData[],
  updateChannels: (data: ChannelCollectionData[]) => void,
  triggerChange: () => void
) => (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => {
  const channelIndex = channelListings.findIndex(channel => channel.id === id);
  const channel = channelListings[channelIndex];

  const updatedChannels = [
    ...channelListings.slice(0, channelIndex),
    {
      ...channel,
      ...data
    },
    ...channelListings.slice(channelIndex + 1)
  ];
  updateChannels(updatedChannels);
  triggerChange();
};
