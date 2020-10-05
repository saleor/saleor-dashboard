import { ChannelVoucherData } from "@saleor/channels/utils";
import { FormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { RequirementsPicker } from "@saleor/discounts/types";
import {
  VoucherChannelListingUpdate,
  VoucherChannelListingUpdateVariables
} from "@saleor/discounts/types/VoucherChannelListingUpdate";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import {
  VoucherUpdate,
  VoucherUpdateVariables
} from "@saleor/discounts/types/VoucherUpdate";
import { joinDateTime } from "@saleor/misc";
import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";
import { MutationFetchResult } from "react-apollo";

const getChannelsVariables = (
  id: string,
  formData: FormData,
  prevChannels?: ChannelVoucherData[]
) => {
  const removeChannels = prevChannels
    ? diff(
        prevChannels,
        formData.channelListing,
        (a, b) => a.id === b.id
      ).removed?.map(removedChannel => removedChannel.id)
    : [];

  return {
    id,
    input: {
      addChannels:
        formData.channelListing?.map(channel => ({
          channelId: channel.id,
          discountValue:
            formData.discountType.toString() === "SHIPPING"
              ? 100
              : channel.discountValue,
          minAmountSpent:
            formData.requirementsPicker === RequirementsPicker.NONE
              ? null
              : formData.requirementsPicker === RequirementsPicker.ITEM
              ? 0
              : channel.minSpent
        })) || [],
      removeChannels
    }
  };
};

export function createUpdateHandler(
  voucher: VoucherDetails_voucher,
  voucherChannelsChoices: ChannelVoucherData[],
  updateVoucher: (
    variables: VoucherUpdateVariables
  ) => Promise<MutationFetchResult<VoucherUpdate>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<VoucherChannelListingUpdate>>
) {
  return (formData: FormData) => {
    const { id } = voucher;
    updateVoucher({
      id,
      input: {
        applyOncePerCustomer: formData.applyOncePerCustomer,
        applyOncePerOrder: formData.applyOncePerOrder,
        discountValueType:
          formData.discountType.toString() === "SHIPPING"
            ? DiscountValueTypeEnum.PERCENTAGE
            : formData.discountType,
        endDate: formData.hasEndDate
          ? joinDateTime(formData.endDate, formData.endTime)
          : null,
        minCheckoutItemsQuantity:
          formData.requirementsPicker !== RequirementsPicker.ITEM
            ? 0
            : parseFloat(formData.minCheckoutItemsQuantity),
        startDate: joinDateTime(formData.startDate, formData.startTime),
        type:
          formData.discountType.toString() === "SHIPPING"
            ? VoucherTypeEnum.SHIPPING
            : formData.type,
        usageLimit: formData.hasUsageLimit
          ? parseInt(formData.usageLimit, 10)
          : null
      }
    });

    updateChannels({
      variables: getChannelsVariables(id, formData, voucherChannelsChoices)
    });
  };
}
