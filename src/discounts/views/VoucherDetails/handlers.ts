import { type ChannelVoucherData } from "@dashboard/channels/utils";
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
  type VoucherCataloguesAddMutation,
  type VoucherCataloguesAddMutationVariables,
  type VoucherCataloguesRemoveMutation,
  type VoucherCataloguesRemoveMutationVariables,
  type VoucherChannelListingUpdateMutation,
  type VoucherChannelListingUpdateMutationVariables,
  type VoucherCodeBulkDeleteMutation,
  type VoucherCodeBulkDeleteMutationVariables,
  type VoucherDetailsFragment,
  type VoucherFragment,
  type VoucherInput,
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

/**
 * Which requests went through, so their staged changes can be cleared when another part of the
 * save failed. A part that had nothing to send is not counted as saved.
 */
interface VoucherSavedParts {
  /** Details, schedule, added codes and countries, saved together by `voucherUpdate`. */
  details: boolean;
  codeRemovals: boolean;
  catalogueAdds: boolean;
  catalogueRemoves: boolean;
}

interface VoucherSaveOutcome {
  errors: VoucherSaveError[];
  saved: VoucherSavedParts;
  /**
   * Some of the save changed the voucher, so a failure elsewhere is a partial save. Code
   * removals and catalogue changes count only when they were sent. Channel values don't count,
   * since every save sends them.
   */
  savedChanges: boolean;
}

interface CreateUpdateHandlerOptions {
  cataloguesAdd: (options: {
    variables: VoucherCataloguesAddMutationVariables;
  }) => Promise<MutationOutcome<VoucherCataloguesAddMutation>>;
  cataloguesRemove: (options: {
    variables: VoucherCataloguesRemoveMutationVariables;
  }) => Promise<MutationOutcome<VoucherCataloguesRemoveMutation>>;
  voucherCodesDelete: (options: {
    variables: VoucherCodeBulkDeleteMutationVariables;
  }) => Promise<MutationOutcome<VoucherCodeBulkDeleteMutation>>;
  getCatalogueDraft: () => VoucherCatalogueDraft;
  getPendingRemovedCodeIds: () => string[];
  catalogueQueryVariables: Omit<VoucherCataloguesAddMutationVariables, "id" | "input">;
}

const getCountryCodes = (voucher: Pick<VoucherFragment, "countries">): string[] =>
  (voucher.countries ?? []).map(country => country.code).sort();

/** Dates are sent to the minute, and the API may return them with a different offset. */
const toMinutes = (date: string | null | undefined): number | null =>
  date ? Math.floor(Date.parse(date) / 60_000) : null;

const getComparableDetails = (
  voucher: VoucherFragment,
): Array<string | number | boolean | null | undefined> => [
  voucher.name,
  voucher.type,
  voucher.discountValueType,
  voucher.usageLimit ?? null,
  // An unset minimum quantity is saved as 0.
  voucher.minCheckoutItemsQuantity ?? 0,
  toMinutes(voucher.startDate),
  toMinutes(voucher.endDate),
  getCountryCodes(voucher).join(),
];

/**
 * Whether `voucherUpdate` changed the voucher. Every save sends all details, so a save that only
 * changed channel values must not be reported as partly saved when the channel step fails.
 */
export const hasSavedVoucherDetailsChanges = ({
  before,
  input,
  after,
}: {
  before: VoucherDetailsFragment;
  input: VoucherInput;
  after: VoucherFragment | null | undefined;
}): boolean => {
  if (!after || (input.addCodes?.length ?? 0) > 0) {
    return true;
  }

  // Not in the voucherUpdate response, so compared with what was sent.
  const sentOnlyFields = [
    "applyOncePerCustomer",
    "applyOncePerOrder",
    "onlyForStaff",
    "singleUse",
  ] as const;
  const afterDetails = getComparableDetails(after);

  return (
    getComparableDetails(before).some((value, index) => value !== afterDetails[index]) ||
    sentOnlyFields.some(field => input[field] !== before[field])
  );
};

const getVoucherUpdateInput = (
  data: VoucherDetailsPageFormData,
  countryCodes: string[] | null,
): VoucherInput => ({
  name: data.name,
  applyOncePerCustomer: data.applyOncePerCustomer,
  applyOncePerOrder: data.applyOncePerOrder,
  onlyForStaff: data.onlyForStaff,
  discountValueType:
    data.discountType === DiscountTypeEnum.VALUE_FIXED
      ? DiscountValueTypeEnum.FIXED
      : DiscountValueTypeEnum.PERCENTAGE,
  endDate: data.hasEndDate ? joinDateTime(data.endDate, data.endTime) : null,
  minCheckoutItemsQuantity:
    data.requirementsPicker !== RequirementsPicker.ITEM
      ? 0
      : parseFloat(data.minCheckoutItemsQuantity),
  startDate: joinDateTime(data.startDate, data.startTime),
  type: data.discountType === DiscountTypeEnum.SHIPPING ? VoucherTypeEnum.SHIPPING : data.type,
  usageLimit: data.hasUsageLimit ? data.usageLimit : null,
  singleUse: data.singleUse,
  addCodes: data.codes.map(({ code }) => code),
  ...(countryCodes !== null ? { countries: countryCodes } : {}),
});

const hasDiscountTypeChanged = (voucher: VoucherDetailsFragment, input: VoucherInput): boolean =>
  input.discountValueType !== voucher.discountValueType || input.type !== voucher.type;

const revertDiscountType = async ({
  voucher,
  input,
  updateVoucher,
}: {
  voucher: VoucherDetailsFragment;
  input: VoucherInput;
  updateVoucher: (
    variables: VoucherUpdateMutationVariables,
  ) => Promise<MutationOutcome<VoucherUpdateMutation>>;
}): Promise<{
  errors: VoucherSaveError[];
  savedInput: VoucherInput;
  savedVoucher: VoucherFragment | null | undefined;
}> => {
  const revertInput: VoucherInput = {
    discountValueType: voucher.discountValueType,
    type: voucher.type,
  };
  const result = await updateVoucher({ id: voucher.id, input: revertInput });
  const errors = getVoucherSaveRequestErrors(result, response => response.voucherUpdate?.errors);

  return errors.length === 0
    ? {
        errors,
        savedInput: { ...input, ...revertInput },
        savedVoucher: result.data?.voucherUpdate?.voucher,
      }
    : { errors, savedInput: input, savedVoucher: undefined };
};

/**
 * Saves the voucher in order: `voucherUpdate` first, and only when it succeeds the channel values,
 * code removals and catalogue changes. Channel percentages are checked against the saved discount
 * type, and replacement codes are added by `voucherUpdate`, so neither can run before it. A
 * failed `voucherUpdate` leaves the voucher unchanged.
 */
export function createUpdateHandler(
  voucher: VoucherDetailsFragment,
  voucherChannelsChoices: ChannelVoucherData[],
  updateVoucher: (
    variables: VoucherUpdateMutationVariables,
  ) => Promise<MutationOutcome<VoucherUpdateMutation>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateMutationVariables;
  }) => Promise<MutationOutcome<VoucherChannelListingUpdateMutation>>,
  options: CreateUpdateHandlerOptions,
) {
  return async (formData: VoucherDetailsPageFormData): Promise<VoucherSaveOutcome> => {
    const data = clearInactiveVoucherDiscountDrafts(formData);
    const { id } = voucher;
    const draft = options.getCatalogueDraft();
    const addInput = getCatalogueAddInput(draft);
    const removeInput = getCatalogueRemoveInput(draft);
    const pendingRemovedCodeIds = options.getPendingRemovedCodeIds();
    const saved: VoucherSavedParts = {
      details: false,
      codeRemovals: false,
      catalogueAdds: false,
      catalogueRemoves: false,
    };
    const input = getVoucherUpdateInput(data, draft.countryCodes);

    const detailsResult = await updateVoucher({ id, input });
    const detailsErrors = getVoucherSaveRequestErrors(
      detailsResult,
      response => response.voucherUpdate?.errors,
    );

    if (detailsErrors.length > 0) {
      return { errors: detailsErrors, saved, savedChanges: false };
    }

    saved.details = true;

    // Each part below resolves to its errors, or to null when it had nothing to send.
    const sendChannels = async (): Promise<VoucherSaveError[]> =>
      getVoucherSaveRequestErrors(
        await updateChannels({
          variables: getChannelsVariables(id, data, voucherChannelsChoices),
        }),
        response => response.voucherChannelListingUpdate?.errors,
      );

    const sendCodeRemovals = async (): Promise<VoucherSaveError[] | null> =>
      pendingRemovedCodeIds.length === 0
        ? null
        : getVoucherSaveRequestErrors(
            await options.voucherCodesDelete({ variables: { ids: pendingRemovedCodeIds } }),
            response =>
              // Map to field:"codes" so save-failure toast / section scroll treat deletes like addCodes errors.
              response.voucherCodeBulkDelete?.errors.map(error => ({
                field: "codes",
                message: error.message,
                code: error.code,
              })),
          );

    const sendCatalogueAdds = async (): Promise<VoucherSaveError[] | null> =>
      addInput
        ? getVoucherSaveRequestErrors(
            await options.cataloguesAdd({
              variables: { id, input: addInput, ...options.catalogueQueryVariables },
            }),
            response => response.voucherCataloguesAdd?.errors,
          )
        : null;

    const sendCatalogueRemoves = async (): Promise<VoucherSaveError[] | null> =>
      removeInput
        ? getVoucherSaveRequestErrors(
            await options.cataloguesRemove({
              variables: { id, input: removeInput, ...options.catalogueQueryVariables },
            }),
            response => response.voucherCataloguesRemove?.errors,
          )
        : null;

    const [channelErrors, codeRemovalErrors, catalogueAddErrors, catalogueRemoveErrors] =
      await Promise.all([
        sendChannels(),
        sendCodeRemovals(),
        sendCatalogueAdds(),
        sendCatalogueRemoves(),
      ]);

    saved.codeRemovals = codeRemovalErrors?.length === 0;
    saved.catalogueAdds = catalogueAddErrors?.length === 0;
    saved.catalogueRemoves = catalogueRemoveErrors?.length === 0;

    // The channel values for a new discount type were rejected, so the saved amounts would now
    // apply under it ($50 off becoming 50% off). Put the saved type back.
    const revert =
      channelErrors.length > 0 && hasDiscountTypeChanged(voucher, input)
        ? await revertDiscountType({ voucher, input, updateVoucher })
        : null;
    const savedInput = revert?.savedInput ?? input;
    const savedVoucher = revert ? revert.savedVoucher : detailsResult.data?.voucherUpdate?.voucher;

    return {
      errors: [
        ...channelErrors,
        ...(codeRemovalErrors ?? []),
        ...(catalogueAddErrors ?? []),
        ...(catalogueRemoveErrors ?? []),
        ...(revert?.errors ?? []),
      ],
      saved,
      savedChanges:
        hasSavedVoucherDetailsChanges({
          before: voucher,
          input: savedInput,
          after: savedVoucher,
        }) ||
        saved.codeRemovals ||
        saved.catalogueAdds ||
        saved.catalogueRemoves,
    };
  };
}
