import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { type VoucherChannelListingAddInput } from "@dashboard/graphql";

import { type VoucherDetailsPageFormData } from "./components/VoucherDetailsPage";
import { DiscountTypeEnum, RequirementsPicker } from "./types";

/**
 * Percentage and fixed amounts are independent per-channel drafts while editing.
 * Drop the inactive draft at save time — only the active type is persisted.
 */
export const clearInactiveVoucherDiscountDrafts = <T extends VoucherDetailsPageFormData>(
  formData: T,
): T => {
  if (formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE) {
    return {
      ...formData,
      percentageDiscountValue: "",
      channelListings: formData.channelListings.map(channel => ({
        ...channel,
        discountValue: "",
      })),
    };
  }

  if (formData.discountType === DiscountTypeEnum.VALUE_FIXED) {
    return {
      ...formData,
      percentageDiscountValue: "",
      channelListings: formData.channelListings.map(channel => ({
        ...channel,
        percentageDiscountValue: "",
      })),
    };
  }

  // Shipping has no amount draft — clear both temps.
  return {
    ...formData,
    percentageDiscountValue: "",
    channelListings: formData.channelListings.map(channel => ({
      ...channel,
      discountValue: "",
      percentageDiscountValue: "",
    })),
  };
};

const getChannelDiscountValue = (
  channel: ChannelVoucherData,
  formData: VoucherDetailsPageFormData,
) => {
  // 100 means that the discount is 100%
  if (formData.discountType === DiscountTypeEnum.SHIPPING) {
    return 100;
  }

  if (formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE) {
    return channel.percentageDiscountValue;
  }

  return channel.discountValue;
};
const getChannelMinAmountSpent = (
  channel: ChannelVoucherData,
  formData: VoucherDetailsPageFormData,
) => {
  if (formData.requirementsPicker === RequirementsPicker.NONE) {
    return null;
  }

  if (formData.requirementsPicker === RequirementsPicker.ITEM) {
    return 0;
  }

  return channel.minSpent;
};
const mapChannelToChannelInput =
  (formData: VoucherDetailsPageFormData) => (channel: ChannelVoucherData) => ({
    channelId: channel.id,
    discountValue: getChannelDiscountValue(channel, formData),
    minAmountSpent: getChannelMinAmountSpent(channel, formData),
  });
const filterNotDiscountedChannel = (channelInput: VoucherChannelListingAddInput) =>
  !!channelInput.discountValue;

export const getAddedChannelsInputFromFormData = (formData: VoucherDetailsPageFormData) =>
  formData.channelListings
    ?.map(mapChannelToChannelInput(formData))
    .filter(filterNotDiscountedChannel) || [];
