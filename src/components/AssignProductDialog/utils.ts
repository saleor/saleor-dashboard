import { ProductChannels, SelectedChannel } from "./types";

export const isProductAvailableInVoucherChannels = (
  productChannels?: ProductChannels,
  selectedChannels?: SelectedChannel[],
) => {
  // If there are no selected channels, the product is available in all channels
  if (!selectedChannels) {
    return true;
  }

  // If there are no product channels, the product is not available in any channel
  if (!productChannels) {
    return false;
  }

  const selectedChannelsIds = selectedChannels.map(chan => chan.id);
  const productChannelsIds = productChannels.map(chan => chan.channel.id);

  return productChannelsIds.some(productChannel => selectedChannelsIds.includes(productChannel));
};
