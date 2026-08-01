import {
  AllocationStrategyEnum,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

/**
 * Standard defaults for a new channel — Shopify-operator expectations.
 * Applied on create without requiring the merchant to open Advanced.
 */
export const getChannelCreateDefaults = () => ({
  allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
  markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
  defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
  automaticallyConfirmAllNewOrders: true,
  automaticallyFulfillNonShippableGiftCard: true,
  allowUnpaidOrders: false,
  automaticallyCompleteCheckouts: false,
  deleteExpiredOrdersAfter: 60,
  allowLegacyGiftCardUse: false,
  automaticCompletionDelay: null as number | null,
  automaticCompletionCutOffDate: "",
  automaticCompletionCutOffTime: "",
});

export type ChannelCreateDefaults = ReturnType<typeof getChannelCreateDefaults>;
