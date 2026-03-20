import { type ChannelFragment } from "@dashboard/graphql";
import { type Option } from "@saleor/macaw-ui-next";

export const getCurencySymbol = (selectedChannel: Option | null, channels: ChannelFragment[]) => {
  const selectedChannelId = selectedChannel?.value;
  const channel = channels.find(channel => channel.id === selectedChannelId);

  if (channel) {
    return channel.currencyCode;
  }

  return "";
};
