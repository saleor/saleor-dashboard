import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { getChannelCreateDefaults } from "@dashboard/channels/utils/getChannelCreateDefaults";
import { type ChannelCreateInput, type CountryCode } from "@dashboard/graphql";
import slugify from "slugify";

/** Build `channelCreate` input from the basic create dialog + operator defaults. */
export const buildChannelCreateInput = (data: ChannelCreateFormData): ChannelCreateInput => {
  const defaults = getChannelCreateDefaults();

  return {
    name: data.name.trim(),
    slug: (data.slug || slugify(data.name).toLowerCase()).trim(),
    defaultCountry: data.defaultCountry as CountryCode,
    currencyCode: data.currencyCode.toUpperCase(),
    addShippingZones: [],
    addWarehouses: [],
    stockSettings: {
      allocationStrategy: defaults.allocationStrategy,
    },
    paymentSettings: {
      defaultTransactionFlowStrategy: defaults.defaultTransactionFlowStrategy,
      releaseFundsForExpiredCheckouts: defaults.releaseFundsForExpiredCheckouts,
      checkoutTtlBeforeReleasingFunds: defaults.checkoutTtlBeforeReleasingFunds,
    },
    orderSettings: {
      markAsPaidStrategy: defaults.markAsPaidStrategy,
      expireOrdersAfter: defaults.expireOrdersAfter || 0,
      deleteExpiredOrdersAfter: defaults.deleteExpiredOrdersAfter,
      allowUnpaidOrders: defaults.allowUnpaidOrders,
      automaticallyConfirmAllNewOrders: defaults.automaticallyConfirmAllNewOrders,
      automaticallyFulfillNonShippableGiftCard: defaults.automaticallyFulfillNonShippableGiftCard,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: defaults.automaticallyCompleteCheckouts,
      allowLegacyGiftCardUse: defaults.allowLegacyGiftCardUse,
    },
  };
};
