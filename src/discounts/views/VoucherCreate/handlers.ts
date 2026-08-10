import { type FetchResult } from "@apollo/client";
import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { clearInactiveVoucherDiscountDrafts } from "@dashboard/discounts/data";
import { getChannelsVariables } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import {
  DiscountValueTypeEnum,
  type VoucherChannelListingUpdateMutation,
  type VoucherChannelListingUpdateMutationVariables,
  type VoucherCreateMutation,
  type VoucherCreateMutationVariables,
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
  return async (formData: FormData) => {
    const data = clearInactiveVoucherDiscountDrafts(formData);

    if (!validateFn(data)) {
      return { validationFailed: true as const };
    }

    const response = await voucherCreate({
      input: {
        name: data.name,
        applyOncePerCustomer: data.applyOncePerCustomer,
        applyOncePerOrder: data.applyOncePerOrder,
        onlyForStaff: data.onlyForStaff,
        addCodes: data.codes.map(({ code }) => code).reverse(),
        discountValueType:
          data.discountType === DiscountTypeEnum.VALUE_PERCENTAGE
            ? DiscountValueTypeEnum.PERCENTAGE
            : data.discountType === DiscountTypeEnum.VALUE_FIXED
              ? DiscountValueTypeEnum.FIXED
              : DiscountValueTypeEnum.PERCENTAGE,
        endDate: data.hasEndDate ? joinDateTime(data.endDate, data.endTime) : null,
        minCheckoutItemsQuantity:
          data.requirementsPicker !== RequirementsPicker.ITEM
            ? 0
            : parseFloat(data.minCheckoutItemsQuantity),
        startDate: joinDateTime(data.startDate, data.startTime),
        type:
          data.discountType === DiscountTypeEnum.SHIPPING ? VoucherTypeEnum.SHIPPING : data.type,
        usageLimit: data.hasUsageLimit ? data.usageLimit : null,
        singleUse: data.singleUse,
        products: data.products.map(product => product.id),
        collections: data.collections.map(collection => collection.id),
        categories: data.categories.map(category => category.id),
        countries: data.countries.map(country => country.code),
        variants: data.variants.map(variant => variant.id),
      },
    });
    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }

    if (!response?.data?.voucherCreate?.voucher) {
      return {
        errors: ["Could not update channels"],
      };
    }

    const channelsUpdateErrors = await extractMutationErrors(
      updateChannels({
        variables: getChannelsVariables(
          response.data.voucherCreate.voucher.id,
          data,
          data.channelListings,
        ),
      }),
    );

    if (channelsUpdateErrors.length > 0) {
      return { errors: channelsUpdateErrors };
    }

    return { id: response.data.voucherCreate.voucher.id };
  };
}
