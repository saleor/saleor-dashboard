import { ChannelVoucherData } from "@dashboard/channels/utils";

import { ProductChannels } from "./types";

export const isProductAvailableInVoucherChannels = (
  productChannels: ProductChannels,
  selectedChannels: ChannelVoucherData[],
) => {
  const selectedChannelsIds = selectedChannels.map(chan => chan.id);
  const productChannelsIds = productChannels.map(chan => chan.channel.id);

  return productChannelsIds.some(productChannel =>
    selectedChannelsIds.includes(productChannel),
  );
};
