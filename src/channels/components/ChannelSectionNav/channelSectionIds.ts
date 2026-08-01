export const channelSectionIds = {
  general: "channel-section-general",
  orders: "channel-section-orders",
  payments: "channel-section-payments",
} as const;

export type ChannelSectionId = (typeof channelSectionIds)[keyof typeof channelSectionIds];
