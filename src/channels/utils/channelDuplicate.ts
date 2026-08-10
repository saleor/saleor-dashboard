import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import {
  type AllocationStrategyEnum,
  type ChannelDetailsFragment,
  type CountryCode,
  type MarkAsPaidStrategyEnum,
  type TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import slugify from "slugify";

/** Settings + assignments copied when duplicating a channel (not catalog or tax config). */
export type ChannelDuplicateSource = {
  name: string;
  slug: string;
  currencyCode: string;
  defaultCountry: CountryCode;
  defaultCountryDisplayName: string;
  warehouseIds: string[];
  shippingZoneIds: string[];
  allocationStrategy: AllocationStrategyEnum;
  orderSettings: {
    markAsPaidStrategy: MarkAsPaidStrategyEnum;
    expireOrdersAfter: number | null;
    deleteExpiredOrdersAfter: number;
    allowUnpaidOrders: boolean;
    automaticallyConfirmAllNewOrders: boolean;
    automaticallyFulfillNonShippableGiftCard: boolean;
  };
  paymentSettings: {
    defaultTransactionFlowStrategy: TransactionFlowStrategyEnum;
    releaseFundsForExpiredCheckouts: boolean | null;
    checkoutTtlBeforeReleasingFunds: number | null;
  };
  checkoutSettings: {
    automaticallyCompleteFullyPaidCheckouts: boolean;
    automaticCompletionDelay: number | null;
    automaticCompletionCutOffDate: string | null;
    allowLegacyGiftCardUse: boolean;
  };
};

export const buildChannelDuplicateSource = (
  channel: ChannelDetailsFragment,
  shippingZoneIds: string[],
): ChannelDuplicateSource => ({
  name: channel.name,
  slug: channel.slug,
  currencyCode: channel.currencyCode,
  defaultCountry: channel.defaultCountry.code as CountryCode,
  defaultCountryDisplayName: channel.defaultCountry.country,
  warehouseIds: channel.warehouses.map(warehouse => warehouse.id),
  shippingZoneIds,
  allocationStrategy: channel.stockSettings.allocationStrategy,
  orderSettings: {
    markAsPaidStrategy: channel.orderSettings.markAsPaidStrategy,
    expireOrdersAfter: channel.orderSettings.expireOrdersAfter ?? null,
    deleteExpiredOrdersAfter: channel.orderSettings.deleteExpiredOrdersAfter,
    allowUnpaidOrders: channel.orderSettings.allowUnpaidOrders,
    automaticallyConfirmAllNewOrders: channel.orderSettings.automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard:
      channel.orderSettings.automaticallyFulfillNonShippableGiftCard,
  },
  paymentSettings: {
    defaultTransactionFlowStrategy: channel.paymentSettings.defaultTransactionFlowStrategy,
    releaseFundsForExpiredCheckouts: channel.paymentSettings.releaseFundsForExpiredCheckouts,
    checkoutTtlBeforeReleasingFunds: channel.paymentSettings.checkoutTtlBeforeReleasingFunds,
  },
  checkoutSettings: {
    automaticallyCompleteFullyPaidCheckouts:
      channel.checkoutSettings.automaticallyCompleteFullyPaidCheckouts,
    automaticCompletionDelay: channel.checkoutSettings.automaticCompletionDelay ?? null,
    automaticCompletionCutOffDate: channel.checkoutSettings.automaticCompletionCutOffDate ?? null,
    allowLegacyGiftCardUse: channel.checkoutSettings.allowLegacyGiftCardUse,
  },
});

/** Prefill create-dialog fields from a source channel (`…-copy` slug; name supplied by caller). */
export const getChannelDuplicateFormPrefill = (
  source: ChannelDuplicateSource,
  { name }: { name: string },
): ChannelCreateFormData & { countryDisplayName: string } => ({
  name,
  slug: `${slugify(source.slug || source.name).toLowerCase()}-copy`,
  currencyCode: source.currencyCode,
  defaultCountry: source.defaultCountry,
  countryDisplayName: source.defaultCountryDisplayName,
});
