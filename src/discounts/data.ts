import { ChannelVoucherData } from "@saleor/channels/utils";
import { VoucherChannelListingAddInput } from "@saleor/graphql";

import { VoucherDetailsPageFormData } from "./components/VoucherDetailsPage";
import { RequirementsPicker } from "./types";

const getChannelDiscountValue = (
  channel: ChannelVoucherData,
  formData: VoucherDetailsPageFormData,
) =>
  formData.discountType.toString() === "SHIPPING" ? 100 : channel.discountValue;

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

const mapChannelToChannelInput = (formData: VoucherDetailsPageFormData) => (
  channel: ChannelVoucherData,
) => ({
  channelId: channel.id,
  discountValue: getChannelDiscountValue(channel, formData),
  minAmountSpent: getChannelMinAmountSpent(channel, formData),
});

const filterNotDiscountedChannel = (
  channelInput: VoucherChannelListingAddInput,
) => !!channelInput.discountValue;

export const getAddedChannelsInputFromFormData = (
  formData: VoucherDetailsPageFormData,
) =>
  formData.channelListings
    ?.map(mapChannelToChannelInput(formData))
    .filter(filterNotDiscountedChannel) || [];
