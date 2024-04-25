// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { ChannelVoucherData } from "@dashboard/channels/utils";
import { VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import {
  DiscountValueTypeEnum,
  VoucherChannelListingUpdateMutation,
  VoucherChannelListingUpdateMutationVariables,
  VoucherDetailsFragment,
  VoucherTypeEnum,
  VoucherUpdateMutation,
  VoucherUpdateMutationVariables,
} from "@dashboard/graphql";
import { joinDateTime } from "@dashboard/misc";

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
          name: formData.name,
          applyOncePerCustomer: formData.applyOncePerCustomer,
          applyOncePerOrder: formData.applyOncePerOrder,
          onlyForStaff: formData.onlyForStaff,
          discountValueType:
            formData.discountType === DiscountTypeEnum.VALUE_PERCENTAGE
              ? DiscountValueTypeEnum.PERCENTAGE
              : formData.discountType === DiscountTypeEnum.VALUE_FIXED
                ? DiscountValueTypeEnum.FIXED
                : DiscountValueTypeEnum.PERCENTAGE,
          endDate: formData.hasEndDate ? joinDateTime(formData.endDate, formData.endTime) : null,
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
          singleUse: formData.singleUse,
          addCodes: formData.codes.map(({ code }) => code),
        },
      }).then(({ data }) => data?.voucherUpdate.errors ?? []),

      updateChannels({
        variables: getChannelsVariables(id, formData, voucherChannelsChoices),
      }).then(({ data }) => data?.voucherChannelListingUpdate.errors ?? []),
    ]);

    return errors.flat();
  };
}
