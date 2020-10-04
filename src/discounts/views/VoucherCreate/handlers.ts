import { ChannelVoucherData } from "@saleor/channels/utils";
import { FormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { RequirementsPicker } from "@saleor/discounts/types";
import {
  VoucherChannelListingUpdate,
  VoucherChannelListingUpdateVariables
} from "@saleor/discounts/types/VoucherChannelListingUpdate";
import {
  VoucherCreate,
  VoucherCreateVariables
} from "@saleor/discounts/types/VoucherCreate";
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

export function createHandler(
  voucherCreate: (
    variables: VoucherCreateVariables
  ) => Promise<MutationFetchResult<VoucherCreate>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<VoucherChannelListingUpdate>>
) {
  return async (formData: FormData) => {
    const response = await voucherCreate({
      input: {
        applyOncePerCustomer: formData.applyOncePerCustomer,
        applyOncePerOrder: formData.applyOncePerOrder,
        code: formData.code,
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

    if (!response.data.voucherCreate.errors.length) {
      updateChannels({
        variables: getChannelsVariables(
          response.data.voucherCreate.voucher.id,
          formData,
          formData.channelListing
        )
      });
    }
  };
}
