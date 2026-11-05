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
  DiscountErrorCode,
  DiscountValueTypeEnum,
  type VoucherChannelListingUpdateMutation,
  type VoucherChannelListingUpdateMutationVariables,
  type VoucherCreateMutation,
  type VoucherCreateMutationVariables,
  type VoucherDeleteMutation,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { joinDateTime } from "@dashboard/misc";
import { CommonErrorCode } from "@dashboard/utils/errors/common";

type VoucherCreateOutcome =
  | { validationFailed: true }
  | { id: string }
  | {
      errors: VoucherSaveError[];
      /** The request that failed, so the page shows only that attempt's errors. */
      failedStep: "create" | "channels";
      /** Set when the voucher was created, its channel values were rejected, and it couldn't be deleted again. */
      createdWithoutChannelsId?: string;
    };

const toRequestError = (error: unknown): VoucherSaveError[] => [
  {
    field: null,
    code: CommonErrorCode.GRAPHQL_ERROR,
    message: error instanceof Error ? error.message : null,
  },
];

/**
 * Creates the voucher, then saves its channel values. The API can't take both in one request,
 * so when the channel values are rejected the new voucher is deleted again. Otherwise it would
 * stay live with no discount, and creating it again would fail because its codes are taken.
 */
export function createHandler({
  createVoucher,
  updateChannels,
  deleteVoucher,
  validate,
}: {
  createVoucher: (
    variables: VoucherCreateMutationVariables,
  ) => Promise<MutationOutcome<VoucherCreateMutation>>;
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<MutationOutcome<VoucherChannelListingUpdateMutation>>;
  deleteVoucher: (id: string) => Promise<MutationOutcome<VoucherDeleteMutation>>;
  validate: (data: VoucherDetailsPageFormData) => boolean;
}) {
  const saveChannels = async (id: string, data: FormData): Promise<VoucherSaveError[]> => {
    try {
      return getVoucherSaveRequestErrors(
        await updateChannels({
          variables: getChannelsVariables(id, data, data.channelListings),
        }),
        payload => payload.voucherChannelListingUpdate?.errors,
      );
    } catch (error) {
      // Still counts as rejected, so the new voucher is deleted again.
      return toRequestError(error);
    }
  };

  const removeVoucher = async (id: string): Promise<VoucherSaveError[]> => {
    try {
      const errors = getVoucherSaveRequestErrors(
        await deleteVoucher(id),
        payload => payload.voucherDelete?.errors,
      );

      // Not found means the voucher is already gone, which is what the delete is for.
      return errors.every(error => error.code === DiscountErrorCode.NOT_FOUND) ? [] : errors;
    } catch (error) {
      return toRequestError(error);
    }
  };

  return async (formData: FormData): Promise<VoucherCreateOutcome> => {
    const data = clearInactiveVoucherDiscountDrafts(formData);

    if (!validate(data)) {
      return { validationFailed: true as const };
    }

    const response = await createVoucher({
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

    if (createErrors.length > 0) {
      return { errors: createErrors, failedStep: "create" };
    }

    const id = response.data?.voucherCreate?.voucher?.id;

    if (!id) {
      // No voucher and no errors: treat it like a failed request.
      return { errors: toRequestError(null), failedStep: "create" };
    }

    const channelErrors = await saveChannels(id, data);

    if (channelErrors.length === 0) {
      return { id };
    }

    const deleteErrors = await removeVoucher(id);

    return {
      errors: channelErrors,
      failedStep: "channels",
      ...(deleteErrors.length > 0 ? { createdWithoutChannelsId: id } : {}),
    };
  };
}
