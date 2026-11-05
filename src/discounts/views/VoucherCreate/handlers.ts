import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { clearInactiveVoucherDiscountDrafts } from "@dashboard/discounts/data";
import { getChannelsVariables } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import {
  getVoucherSaveRequestErrors,
  type MutationOutcome,
  type VoucherSaveError,
} from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  DiscountValueTypeEnum,
  type VoucherChannelListingUpdateMutation,
  type VoucherChannelListingUpdateMutationVariables,
  type VoucherCreateMutation,
  type VoucherCreateMutationVariables,
  type VoucherDeleteMutation,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { joinDateTime } from "@dashboard/misc";

type VoucherCreateOutcome =
  | { validationFailed: true }
  | { id: string }
  | { errors: VoucherSaveError[] }
  /** Created, but its channel values were rejected and it couldn't be removed again. */
  | { errors: VoucherSaveError[]; createdWithoutChannelsId: string };

/**
 * Creates the voucher, then saves its channel values. The API can't take both in one request,
 * so when the channel values are rejected the new voucher is deleted again. Otherwise it would
 * stay live with no discount, and creating it again would fail because its codes are taken.
 */
export function createHandler(
  voucherCreate: (
    variables: VoucherCreateMutationVariables,
  ) => Promise<MutationOutcome<VoucherCreateMutation>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<MutationOutcome<VoucherChannelListingUpdateMutation>>,
  deleteVoucher: (id: string) => Promise<MutationOutcome<VoucherDeleteMutation>>,
  validateFn: (data: VoucherDetailsPageFormData) => boolean,
) {
  return async (formData: FormData): Promise<VoucherCreateOutcome> => {
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
    const createErrors = getVoucherSaveRequestErrors(
      response,
      payload => payload.voucherCreate?.errors,
    );
    const id = response.data?.voucherCreate?.voucher?.id;

    if (createErrors.length > 0 || !id) {
      return {
        errors:
          createErrors.length > 0
            ? createErrors
            : getVoucherSaveRequestErrors(response, () => null),
      };
    }

    const channelErrors = getVoucherSaveRequestErrors(
      await updateChannels({
        variables: getChannelsVariables(id, data, data.channelListings),
      }),
      payload => payload.voucherChannelListingUpdate?.errors,
    );

    if (channelErrors.length === 0) {
      return { id };
    }

    const deleteErrors = getVoucherSaveRequestErrors(
      await deleteVoucher(id),
      payload => payload.voucherDelete?.errors,
    );

    return deleteErrors.length === 0
      ? { errors: channelErrors }
      : { errors: channelErrors, createdWithoutChannelsId: id };
  };
}
