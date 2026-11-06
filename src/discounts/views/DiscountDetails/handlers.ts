import { type FetchResult } from "@apollo/client";
import { type Rule } from "@dashboard/discounts/models/Rule";
import { toAPI } from "@dashboard/discounts/models/transformRule";
import {
  getVoucherSaveRequestErrors,
  type MutationOutcome,
  type VoucherSaveError,
} from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  type PromotionDetailsFragment,
  type PromotionRuleCreateErrorFragment,
  type PromotionRuleCreateMutation,
  type PromotionRuleCreateMutationVariables,
  type PromotionRuleUpdateErrorFragment,
  type PromotionRuleUpdateMutation,
  type PromotionRuleUpdateMutationVariables,
  type PromotionUpdateMutation,
  type PromotionUpdateMutationVariables,
} from "@dashboard/graphql";
import { getMutationErrors, joinDateTime } from "@dashboard/misc";
import { type CommonError } from "@dashboard/utils/errors/common";
import difference from "lodash/difference";

import { type DiscoutFormData } from "../../types";

/**
 * Saleor promotionUpdate validates dates with
 * `cleaned_input.get("end_date") or instance.end_date`, so `endDate: null` is ignored
 * for validation. Clearing the end while moving start past the previous end fails.
 * Clear end date in a separate mutation first when that conflict would occur, and put it
 * back when the main update fails.
 */
export const shouldClearPromotionEndDateFirst = ({
  hasEndDate,
  nextStartDate,
  currentEndDate,
}: {
  hasEndDate: boolean;
  nextStartDate: string | null;
  currentEndDate: string | null | undefined;
}): boolean => {
  if (hasEndDate || !currentEndDate || !nextStartDate) {
    return false;
  }

  return new Date(nextStartDate).getTime() > new Date(currentEndDate).getTime();
};

/** Payload errors, or one error for a request that failed as a whole (it has no payload). */
const getPromotionUpdateErrors = (
  result: MutationOutcome<PromotionUpdateMutation>,
): VoucherSaveError[] => getVoucherSaveRequestErrors(result, data => data.promotionUpdate?.errors);

interface UpdateHandlerDeps {
  promotion: PromotionDetailsFragment | undefined | null;
  update: (
    variables: PromotionUpdateMutationVariables,
    options?: { silent?: boolean },
  ) => Promise<MutationOutcome<PromotionUpdateMutation>>;
  /** Puts back an end date cleared before an update that then failed. */
  restoreEndDate: (endDate: string) => Promise<unknown>;
}

export const createUpdateHandler = ({ promotion, update, restoreEndDate }: UpdateHandlerDeps) => {
  return async (data: DiscoutFormData) => {
    if (!promotion) {
      return;
    }

    const startDate = joinDateTime(data.dates.startDate, data.dates.startTime);
    const endDate = data.dates.hasEndDate
      ? joinDateTime(data.dates.endDate, data.dates.endTime)
      : null;
    // Build the update before clearing the end date, so nothing can throw between the two.
    const input = {
      name: data.name,
      description: data.description ? JSON.parse(data.description) : null,
      startDate,
      endDate,
    };

    const previousEndDate = promotion.endDate;
    const clearsEndDateFirst = shouldClearPromotionEndDateFirst({
      hasEndDate: data.dates.hasEndDate,
      nextStartDate: startDate,
      currentEndDate: previousEndDate,
    });
    // The end date is already gone when the update fails. Without it the promotion runs from its
    // old start with no end, so put it back before reporting the failure.
    const restoreClearedEndDate = async (): Promise<void> => {
      if (clearsEndDateFirst && previousEndDate) {
        await restoreEndDate(previousEndDate);
      }
    };

    if (clearsEndDateFirst) {
      const clearEndResponse = await update(
        {
          id: promotion.id,
          input: { endDate: null },
        },
        { silent: true },
      );
      const clearEndErrors = getPromotionUpdateErrors(clearEndResponse);

      if (clearEndErrors.length) {
        return { errors: clearEndErrors };
      }
    }

    let updateResponse: MutationOutcome<PromotionUpdateMutation>;

    try {
      updateResponse = await update({ id: promotion.id, input });
    } catch (error) {
      await restoreClearedEndDate();
      throw error;
    }

    const errors = getPromotionUpdateErrors(updateResponse);

    if (errors.length) {
      await restoreClearedEndDate();

      return { errors };
    }

    return { errors: [] };
  };
};

export const createRuleUpdateHandler = (
  promotionData: PromotionDetailsFragment | undefined | null,
  updateRule: (
    variables: PromotionRuleUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleUpdateMutation>>,
) => {
  return async (data: Rule) => {
    const emptyRuleErrors = [] as Array<CommonError<PromotionRuleUpdateErrorFragment>>;

    if (!promotionData) {
      return emptyRuleErrors;
    }

    const ruleData = promotionData?.rules?.find(rule => rule.id === data.id);
    const ruleChannels: string[] = ruleData?.channels?.map(channel => channel.id) ?? [];
    const ruleGifts: string[] = ruleData?.giftIds ?? [];
    const { channels, gifts, ...input } = toAPI(promotionData?.type)(data);
    const response = await updateRule({
      id: data.id!,
      input: {
        ...input,
        addChannels: difference(channels, ruleChannels),
        removeChannels: difference(ruleChannels, channels ?? []),
        addGifts: difference(gifts, ruleGifts),
        removeGifts: difference(ruleGifts, gifts ?? []),
      },
    });
    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return errors as Array<CommonError<PromotionRuleUpdateErrorFragment>>;
    }

    return emptyRuleErrors;
  };
};

export const createRuleCreateHandler = (
  promotionData: PromotionDetailsFragment | undefined | null,
  createRule: (
    variables: PromotionRuleCreateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleCreateMutation>>,
) => {
  return async (data: Rule) => {
    const ruleData = toAPI(promotionData?.type)(data);
    const response = await createRule({
      input: {
        promotion: promotionData?.id ?? "",
        ...ruleData,
      },
    });
    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return errors as Array<CommonError<PromotionRuleCreateErrorFragment>>;
    }

    return [] as Array<CommonError<PromotionRuleCreateErrorFragment>>;
  };
};
