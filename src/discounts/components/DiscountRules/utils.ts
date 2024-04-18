import { ChannelFragment } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

export const getCurencySymbol = (selectedChannel: Option | null, channels: ChannelFragment[]) => {
  const selectedChannelId = selectedChannel?.value;
  const channel = channels.find(channel => channel.id === selectedChannelId);

  if (channel) {
    return channel.currencyCode;
  }

  return "";
};
