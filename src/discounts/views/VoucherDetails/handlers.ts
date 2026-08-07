// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { clearInactiveVoucherDiscountDrafts } from "@dashboard/discounts/data";
import { getChannelsVariables } from "@dashboard/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import {
  DiscountValueTypeEnum,
  type VoucherCataloguesAddMutation,
  type VoucherCataloguesAddMutationVariables,
  type VoucherCataloguesRemoveMutation,
  type VoucherCataloguesRemoveMutationVariables,
  type VoucherChannelListingUpdateMutation,
  type VoucherChannelListingUpdateMutationVariables,
  type VoucherCodeBulkDeleteMutation,
  type VoucherCodeBulkDeleteMutationVariables,
  type VoucherDetailsFragment,
  VoucherTypeEnum,
  type VoucherUpdateMutation,
  type VoucherUpdateMutationVariables,
} from "@dashboard/graphql";
import { joinDateTime } from "@dashboard/misc";

import {
  getCatalogueAddInput,
  getCatalogueRemoveInput,
  type VoucherCatalogueDraft,
} from "./voucherCatalogueDraft";

interface CreateUpdateHandlerOptions {
  cataloguesAdd: (options: {
    variables: VoucherCataloguesAddMutationVariables;
  }) => Promise<FetchResult<VoucherCataloguesAddMutation>>;
  cataloguesRemove: (options: {
    variables: VoucherCataloguesRemoveMutationVariables;
  }) => Promise<FetchResult<VoucherCataloguesRemoveMutation>>;
  voucherCodesDelete: (options: {
    variables: VoucherCodeBulkDeleteMutationVariables;
  }) => Promise<FetchResult<VoucherCodeBulkDeleteMutation>>;
  getCatalogueDraft: () => VoucherCatalogueDraft;
  getPendingRemovedCodeIds: () => string[];
  catalogueQueryVariables: Omit<VoucherCataloguesAddMutationVariables, "id" | "input">;
}

export function createUpdateHandler(
  voucher: VoucherDetailsFragment,
  voucherChannelsChoices: ChannelVoucherData[],
  updateVoucher: (
    variables: VoucherUpdateMutationVariables,
  ) => Promise<FetchResult<VoucherUpdateMutation>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<VoucherChannelListingUpdateMutation>>,
  options: CreateUpdateHandlerOptions,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    const data = clearInactiveVoucherDiscountDrafts(formData);
    const { id } = voucher;
    const draft = options.getCatalogueDraft();
    const addInput = getCatalogueAddInput(draft);
    const removeInput = getCatalogueRemoveInput(draft);
    const countryCodes = draft.countryCodes;
    const pendingRemovedCodeIds = options.getPendingRemovedCodeIds();

    const requests: Array<Promise<unknown[]>> = [
      updateVoucher({
        id,
        input: {
          name: data.name,
          applyOncePerCustomer: data.applyOncePerCustomer,
          applyOncePerOrder: data.applyOncePerOrder,
          onlyForStaff: data.onlyForStaff,
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
          addCodes: data.codes.map(({ code }) => code),
          ...(countryCodes !== null ? { countries: countryCodes } : {}),
        },
      }).then(({ data: response }) => response?.voucherUpdate.errors ?? []),

      updateChannels({
        variables: getChannelsVariables(id, data, voucherChannelsChoices),
      }).then(({ data: response }) => response?.voucherChannelListingUpdate.errors ?? []),
    ];

    if (pendingRemovedCodeIds.length > 0) {
      requests.push(
        options
          .voucherCodesDelete({
            variables: { ids: pendingRemovedCodeIds },
          })
          .then(({ data: response }) =>
            // Map to field:"codes" so save-failure toast / section scroll treat deletes like addCodes errors.
            (response?.voucherCodeBulkDelete?.errors ?? []).map(error => ({
              field: "codes",
              message: error.message,
              code: error.code,
            })),
          ),
      );
    }

    if (addInput) {
      requests.push(
        options
          .cataloguesAdd({
            variables: {
              id,
              input: addInput,
              ...options.catalogueQueryVariables,
            },
          })
          .then(({ data: response }) => response?.voucherCataloguesAdd.errors ?? []),
      );
    }

    if (removeInput) {
      requests.push(
        options
          .cataloguesRemove({
            variables: {
              id,
              input: removeInput,
              ...options.catalogueQueryVariables,
            },
          })
          .then(({ data: response }) => response?.voucherCataloguesRemove.errors ?? []),
      );
    }

    const errors = await Promise.all(requests);

    return errors.flat();
  };
}
