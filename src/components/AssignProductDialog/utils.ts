import { ProductChannels, SelectedChannel } from "./types";

export const isProductAvailableInVoucherChannels = (
  productChannels: ProductChannels,
  selectedChannels?: SelectedChannel[],
) => {
  if (!selectedChannels) {
    return true;
  }

  const selectedChannelsIds = selectedChannels.map(chan => chan.id);
  const productChannelsIds = productChannels.map(chan => chan.channel.id);

  return productChannelsIds.some(productChannel => selectedChannelsIds.includes(productChannel));
};
