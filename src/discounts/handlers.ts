import { ChannelVoucherData } from "@saleor/channels/utils";

export interface ChannelInput {
  discountValue: number;
  minSpent: number;
}

export function createChannelsChangeHandler(
  channelListing: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void
) {
  return (id: string, input: ChannelInput) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        ...input
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}
