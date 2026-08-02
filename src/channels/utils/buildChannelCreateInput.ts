import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { type ChannelDuplicateSource } from "@dashboard/channels/utils/channelDuplicate";
import { getChannelCreateDefaults } from "@dashboard/channels/utils/getChannelCreateDefaults";
import { type ChannelCreateInput, type CountryCode } from "@dashboard/graphql";
import slugify from "slugify";

interface BuildChannelCreateInputOptions {
  /** When set, copy settings and warehouse/zone assigns from this source. */
  duplicateFrom?: ChannelDuplicateSource;
}

/** Build `channelCreate` input from the basic create dialog + operator defaults (or a duplicate source). */
export const buildChannelCreateInput = (
  data: ChannelCreateFormData,
  { duplicateFrom }: BuildChannelCreateInputOptions = {},
): ChannelCreateInput => {
  const defaults = getChannelCreateDefaults();
  const base: ChannelCreateInput = {
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

  if (!duplicateFrom) {
    return base;
  }

  const automaticCompletionEnabled =
    duplicateFrom.checkoutSettings.automaticallyCompleteFullyPaidCheckouts;

  return {
    ...base,
    // Start inactive so setup isn't skipped and the clone isn't live by accident.
    isActive: false,
    addWarehouses: duplicateFrom.warehouseIds,
    addShippingZones: duplicateFrom.shippingZoneIds,
    stockSettings: {
      allocationStrategy: duplicateFrom.allocationStrategy,
    },
    paymentSettings: {
      defaultTransactionFlowStrategy: duplicateFrom.paymentSettings.defaultTransactionFlowStrategy,
      releaseFundsForExpiredCheckouts:
        duplicateFrom.paymentSettings.releaseFundsForExpiredCheckouts,
      checkoutTtlBeforeReleasingFunds:
        duplicateFrom.paymentSettings.checkoutTtlBeforeReleasingFunds,
    },
    orderSettings: {
      markAsPaidStrategy: duplicateFrom.orderSettings.markAsPaidStrategy,
      expireOrdersAfter: duplicateFrom.orderSettings.expireOrdersAfter || 0,
      deleteExpiredOrdersAfter: duplicateFrom.orderSettings.deleteExpiredOrdersAfter,
      allowUnpaidOrders: duplicateFrom.orderSettings.allowUnpaidOrders,
      automaticallyConfirmAllNewOrders:
        duplicateFrom.orderSettings.automaticallyConfirmAllNewOrders,
      automaticallyFulfillNonShippableGiftCard:
        duplicateFrom.orderSettings.automaticallyFulfillNonShippableGiftCard,
    },
    checkoutSettings: {
      allowLegacyGiftCardUse: duplicateFrom.checkoutSettings.allowLegacyGiftCardUse,
      automaticCompletion: automaticCompletionEnabled
        ? {
            enabled: true,
            delay: duplicateFrom.checkoutSettings.automaticCompletionDelay,
            cutOffDate: duplicateFrom.checkoutSettings.automaticCompletionCutOffDate,
          }
        : {
            enabled: false,
          },
    },
  };
};
