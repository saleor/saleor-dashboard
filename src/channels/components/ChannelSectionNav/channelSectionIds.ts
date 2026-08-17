export const channelSectionIds = {
  general: "channel-section-general",
  orders: "channel-section-orders",
  payments: "channel-section-payments",
  paymentGateways: "channel-section-payment-gateways",
  taxes: "channel-section-taxes",
  catalog: "channel-section-catalog",
} as const;

export type ChannelSectionId = (typeof channelSectionIds)[keyof typeof channelSectionIds];
