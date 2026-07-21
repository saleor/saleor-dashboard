import { type MarkAsPaidStrategyEnum } from "@dashboard/graphql";

export interface ChannelOrderSettingsFormData {
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
  allowUnpaidOrders: boolean;
  deleteExpiredOrdersAfter: number;
  /** Preserved on save — not edited in the hub matrix. */
  markAsPaidStrategy: MarkAsPaidStrategyEnum;
}

export type ChannelOrderSettingsFormMap = Record<string, ChannelOrderSettingsFormData>;

export type ChannelOrderSettingsMatrixField = keyof Omit<
  ChannelOrderSettingsFormData,
  "markAsPaidStrategy"
>;

export interface OrderSettingsFormData {
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
  reserveStockDurationAnonymousUser: number;
  reserveStockDurationAuthenticatedUser: number;
  limitQuantityPerCheckout: number;
  channels: ChannelOrderSettingsFormMap;
}
