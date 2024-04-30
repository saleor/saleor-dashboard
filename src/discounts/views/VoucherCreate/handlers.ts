// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import {
  DiscountValueTypeEnum,
  VoucherChannelListingUpdateMutation,
  VoucherChannelListingUpdateMutationVariables,
  VoucherCreateMutation,
  VoucherCreateMutationVariables,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { extractMutationErrors, getMutationErrors, joinDateTime } from "@dashboard/misc";

export function createHandler(
  voucherCreate: (
    variables: VoucherCreateMutationVariables,
  ) => Promise<FetchResult<VoucherCreateMutation>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<VoucherChannelListingUpdateMutation>>,
  validateFn: (data: VoucherDetailsPageFormData) => boolean,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    if (!validateFn(formData)) {
      return { errors: ["Invalid data"] };
    }

    const response = await voucherCreate({
      input: {
        name: formData.name,
        applyOncePerCustomer: formData.applyOncePerCustomer,
        applyOncePerOrder: formData.applyOncePerOrder,
        onlyForStaff: formData.onlyForStaff,
        addCodes: formData.codes.map(({ code }) => code).reverse(),
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
      },
    });
    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }

    const channelsUpdateErrors = await extractMutationErrors(
      updateChannels({
        variables: getChannelsVariables(
          response.data.voucherCreate.voucher.id,
          formData,
          formData.channelListings,
        ),
      }),
    );

    if (channelsUpdateErrors.length > 0) {
      return { errors: channelsUpdateErrors };
    }

    return { id: response.data.voucherCreate.voucher.id };
  };
}
