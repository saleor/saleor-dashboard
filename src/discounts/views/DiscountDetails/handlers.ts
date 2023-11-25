import { FetchResult } from "@apollo/client";
import { RuleDTO } from "@dashboard/discounts/dto/dto";
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

import { DiscoutFormData, Rule } from "../../types";
import { getRulesToCreateData, getRulesToUpdateData } from "./utils";

export const createUpdateHandler = (
  promotion: PromotionDetailsFragment | undefined | null,
  update: (
    varaibles: PromotionUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionUpdateMutation>>,
  updateRule: (
    variables: PromotionRuleUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleUpdateMutation>>,
  createRule: (
    variables: PromotionRuleCreateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleCreateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    if (!promotion) {
      return;
    }

    const updateResponse = update({
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

    const rulesToUpdateData = getRulesToUpdateData(data.rules, promotion.rules);
    const rulesToCreateData = getRulesToCreateData(data.rules, promotion.rules);

    const rulesToUpdateMutation = rulesToUpdateData.map(({ id, input }) =>
      updateRule({ id, input }),
    );
    const rulesToCreateMutation = rulesToCreateData.map(rule =>
      createRule({
        input: {
          promotion: promotion.id,
          ...rule,
        },
      }),
    );

    const response = await Promise.all([
      updateResponse,
      ...rulesToUpdateMutation,
      ...rulesToCreateMutation,
    ]);

    const errors = response.map(res => getMutationErrors(res)).flat();

    if (errors.length > 0) {
      return { errors };
    }
  };
};

export const createRuleUpdateHandler = (
  promotionData: PromotionDetailsFragment | undefined,
  updateRule: (
    variables: PromotionRuleUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionRuleUpdateMutation>>,
) => {
  return async (data: Rule) => {
    if (!promotionData) {
      return;
    }

    const ruleData = promotionData?.rules.find(rule => rule.id === data.id);
    const ruleChannels = ruleData?.channels.map(channel => channel.id) ?? [];

    const { channels, ...input } = RuleDTO.toAPI(data);

    const response = await updateRule({
      id: data.id!,
      input: {
        ...input,
        addChannels: difference(channels, ruleChannels),
        removeChannels: difference(ruleChannels, channels),
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }
  };
};
