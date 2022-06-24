import { FetchResult } from "@apollo/client";
import { ChannelVoucherData } from "@saleor/channels/utils";
import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@saleor/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@saleor/discounts/types";
import {
  DiscountValueTypeEnum,
  VoucherChannelListingUpdateMutation,
  VoucherChannelListingUpdateMutationVariables,
  VoucherDetailsFragment,
  VoucherTypeEnum,
  VoucherUpdateMutation,
  VoucherUpdateMutationVariables,
} from "@saleor/graphql";
import { joinDateTime } from "@saleor/misc";

export function createUpdateHandler(
  voucher: VoucherDetailsFragment,
  voucherChannelsChoices: ChannelVoucherData[],
  updateVoucher: (
    variables: VoucherUpdateMutationVariables,
  ) => Promise<FetchResult<VoucherUpdateMutation>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<VoucherChannelListingUpdateMutation>>,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    const { id } = voucher;

    const errors = await Promise.all([
      updateVoucher({
        id,
        input: {
          applyOncePerCustomer: formData.applyOncePerCustomer,
          applyOncePerOrder: formData.applyOncePerOrder,
          onlyForStaff: formData.onlyForStaff,
          discountValueType:
            formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE
              ? DiscountValueTypeEnum.PERCENTAGE
              : formData.discountType === DiscountTypeEnum.VALUE_FIXED
              ? DiscountValueTypeEnum.FIXED
              : DiscountValueTypeEnum.PERCENTAGE,
          endDate: formData.hasEndDate
            ? joinDateTime(formData.endDate, formData.endTime)
            : null,
          minCheckoutItemsQuantity:
            formData.requirementsPicker !== RequirementsPicker.ITEM
              ? 0
              : parseFloat(formData.minCheckoutItemsQuantity),
          startDate: joinDateTime(formData.startDate, formData.startTime),
          type:
            formData.discountType === DiscountTypeEnum.SHIPPING
              ? VoucherTypeEnum.SHIPPING
              : formData.type,
          usageLimit: formData.hasUsageLimit ? formData.usageLimit : null,
        },
      }).then(({ data }) => data?.voucherUpdate.errors ?? []),

      updateChannels({
        variables: getChannelsVariables(id, formData, voucherChannelsChoices),
      }).then(({ data }) => data?.voucherChannelListingUpdate.errors ?? []),
    ]);

    return errors.flat();
  };
}
