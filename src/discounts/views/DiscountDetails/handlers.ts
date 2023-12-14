import { FetchResult } from "@apollo/client";
import { Rule } from "@dashboard/discounts/models";
import {
  PromotionDetailsFragment,
  PromotionRuleCreateMutation,
  PromotionRuleCreateMutationVariables,
  PromotionRuleUpdateMutation,
  PromotionRuleUpdateMutationVariables,
  PromotionUpdateMutation,
  PromotionUpdateMutationVariables,
} from "@dashboard/graphql";
import { getMutationErrors, joinDateTime } from "@dashboard/misc";
import difference from "lodash/difference";

import { DiscoutFormData } from "../../types";

export const createUpdateHandler = (
  promotion: PromotionDetailsFragment | undefined | null,
  update: (
    varaibles: PromotionUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionUpdateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    if (!promotion) {
      return;
    }

    const updateResponse = await update({
      id: promotion.id,
      input: {
        name: data.name,
        description: data.description ? JSON.parse(data.description) : null,
        startDate: joinDateTime(data.dates.startDate, data.dates.startTime),
        endDate: data.dates.hasEndDate
          ? joinDateTime(data.dates.endDate, data.dates.endTime)
          : null,
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
    if (!promotionData) {
      return;
    }

    const ruleData = promotionData?.rules?.find(rule => rule.id === data.id);
    const ruleChannels: string[] =
      ruleData?.channels?.map(channel => channel.id) ?? [];

    const { channels, ...input } = data.toAPI();

    const response = await updateRule({
      id: data.id!,
      input: {
        ...input,
        addChannels: difference(channels, ruleChannels),
        removeChannels: difference(ruleChannels, channels ?? []),
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return errors;
    }

    return [];
  };
};

export const createRuleCreateHandler = (
  promotionData: PromotionDetailsFragment | undefined | null,
  createRule: (
    variables: PromotionRuleCreateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleCreateMutation>>,
) => {
  return async (data: Rule) => {
    const ruleData = data.toAPI();

    const response = await createRule({
      input: {
        promotion: promotionData?.id ?? "",
        ...ruleData,
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return errors;
    }

    return [];
  };
};
