export const createChannelsChangeHandler = (
  selectedChannels: any,
  setSelectedChannels: (channels: any) => void,
  triggerChange: () => void
) => (
  channelId: string,
  value: { maxValue: number; minValue: number; price: number }
) => {
  const itemIndex = selectedChannels.findIndex(item => item.id === channelId);
  const channel = selectedChannels[itemIndex];
  setSelectedChannels([
    ...selectedChannels.slice(0, itemIndex),
    {
      ...channel,
      maxValue: value.maxValue,
      minValue: value.minValue,
      price: value.price
    },
    ...selectedChannels.slice(itemIndex + 1)
  ]);
  triggerChange();
};
