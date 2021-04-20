export const getConfigByChannelId = (channelIdToCompare: string) => ({
  channel
}: {
  channel: { id: string };
}) => channel.id === channelIdToCompare;
