import { type ProductChannels, type SelectedChannel } from "./types";

export const getSelectedIdsFromDict = (selection: Record<string, boolean>): string[] =>
  Object.entries(selection)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id)
    .sort((a, b) => a.localeCompare(b));

export const hasMultiSelectionChanged = (
  current: Record<string, boolean>,
  initial: Record<string, boolean>,
): boolean => {
  const currentIds = getSelectedIdsFromDict(current);
  const initialIds = getSelectedIdsFromDict(initial);

  if (currentIds.length !== initialIds.length) {
    return true;
  }

  return currentIds.some((id, index) => id !== initialIds[index]);
};

export const hasSingleSelectionChanged = (current: string, initial: string): boolean =>
  current !== initial;

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
