import { ChannelFragment } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

export const getCurencySymbol = (
  selectedChannels: Option[],
  channels: ChannelFragment[],
) => {
  if (selectedChannels.length === 1) {
    const selectedChannelId = selectedChannels[0].value;
    const channel = channels.find(channel => channel.id === selectedChannelId);

    if (channel) {
      return channel.currencyCode;
    }
  }

  const selectedChannelsCurrencyCodes = selectedChannels
    .map(
      selectedChannel =>
        channels.find(channel => channel.id === selectedChannel.value)
          ?.currencyCode,
    )
    .filter(Boolean);

  const uniqueCurrencyCodes = new Set(selectedChannelsCurrencyCodes);

  if (uniqueCurrencyCodes.size > 1) {
    return null;
  }

  return [...uniqueCurrencyCodes][0];
};
