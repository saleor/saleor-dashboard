import {
  AllocationStrategyEnum,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { getChannelCreateDefaults } from "./getChannelCreateDefaults";

describe("getChannelCreateDefaults", () => {
  it("returns Shopify-operator standard defaults", () => {
    // Arrange & Act
    const defaults = getChannelCreateDefaults();

    // Assert
    expect(defaults).toEqual({
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
      releaseFundsForExpiredCheckouts: false,
      checkoutTtlBeforeReleasingFunds: null,
      automaticallyConfirmAllNewOrders: true,
      automaticallyFulfillNonShippableGiftCard: true,
      allowUnpaidOrders: false,
      automaticallyCompleteCheckouts: false,
      expireOrdersAfter: null,
      deleteExpiredOrdersAfter: 60,
      allowLegacyGiftCardUse: false,
      automaticCompletionDelay: null,
      automaticCompletionCutOffDate: "",
      automaticCompletionCutOffTime: "",
    });
  });
});
