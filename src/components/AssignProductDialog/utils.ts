import { ChannelVoucherData } from "@dashboard/channels/utils";
import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export const isProductChannelInSelectedChannels = (
  productChannels: RelayToFlat<
    SearchProductsQuery["search"]
  >[number]["channelListings"],
  selectedChannels: ChannelVoucherData[],
) => {
  const selectedChannelsIds = selectedChannels.map(chan => chan.id);
  const productChannelsIds = productChannels.map(chan => chan.channel.id);

  return productChannelsIds.some(productChannel =>
    selectedChannelsIds.includes(productChannel),
  );
};
