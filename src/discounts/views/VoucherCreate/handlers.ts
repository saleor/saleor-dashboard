import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@saleor/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@saleor/discounts/types";
import {
  VoucherChannelListingUpdate,
  VoucherChannelListingUpdateVariables
} from "@saleor/discounts/types/VoucherChannelListingUpdate";
import {
  VoucherCreate,
  VoucherCreateVariables
} from "@saleor/discounts/types/VoucherCreate";
import {
  extractMutationErrors,
  getMutationErrors,
  joinDateTime
} from "@saleor/misc";
import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

export function createHandler(
  voucherCreate: (
    variables: VoucherCreateVariables
  ) => Promise<MutationFetchResult<VoucherCreate>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<VoucherChannelListingUpdate>>
) {
  return async (formData: VoucherDetailsPageFormData) => {
    const response = await voucherCreate({
      input: {
        applyOncePerCustomer: formData.applyOncePerCustomer,
        applyOncePerOrder: formData.applyOncePerOrder,
        onlyForStaff: formData.onlyForStaff,
        code: formData.code,
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
        usageLimit: formData.hasUsageLimit ? formData.usageLimit : null
      }
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
          formData.channelListings
        )
      })
    );

    if (channelsUpdateErrors.length > 0) {
      return { errors: channelsUpdateErrors };
    }

    return { id: response.data.voucherCreate.voucher.id };
  };
}
