import { type FetchResult } from "@apollo/client";
import { type Rule, toAPI } from "@dashboard/discounts/models";
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
 * Clear end date in a separate mutation first when that conflict would occur.
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

export const createUpdateHandler = (
  promotion: PromotionDetailsFragment | undefined | null,
  update: (
    variables: PromotionUpdateMutationVariables,
    options?: { silent?: boolean },
  ) => Promise<FetchResult<PromotionUpdateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    if (!promotion) {
      return;
    }

    const startDate = joinDateTime(data.dates.startDate, data.dates.startTime);
    const endDate = data.dates.hasEndDate
      ? joinDateTime(data.dates.endDate, data.dates.endTime)
      : null;

    if (
      shouldClearPromotionEndDateFirst({
        hasEndDate: data.dates.hasEndDate,
        nextStartDate: startDate,
        currentEndDate: promotion.endDate,
      })
    ) {
      const clearEndResponse = await update(
        {
          id: promotion.id,
          input: { endDate: null },
        },
        { silent: true },
      );
      const clearEndErrors = getMutationErrors(clearEndResponse);

      if (clearEndErrors.length) {
        return { errors: clearEndErrors };
      }
    }

    const updateResponse = await update({
      id: promotion.id,
      input: {
        name: data.name,
        description: data.description ? JSON.parse(data.description) : null,
        startDate,
        endDate,
      },
    });
    const errors = getMutationErrors(updateResponse);

    if (errors.length) {
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
