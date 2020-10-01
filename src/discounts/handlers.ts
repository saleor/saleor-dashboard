import { ChannelVoucherData } from "@saleor/channels/utils";

export function createChannelsChangeHandler(
  channelListing: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void
) {
  return (id: string, minSpent: number) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        minSpent
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}
