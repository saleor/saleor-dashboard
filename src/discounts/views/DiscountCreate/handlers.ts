import { FetchResult } from "@apollo/client";
import { toAPI } from "@dashboard/discounts/models";
import { DiscoutFormData } from "@dashboard/discounts/types";
import {
  PromotionCreateMutation,
  PromotionCreateMutationVariables,
} from "@dashboard/graphql";
import { getMutationErrors, joinDateTime } from "@dashboard/misc";

export const useDiscountCreate = (
  create: (
    varaibles: PromotionCreateMutationVariables,
  ) => Promise<FetchResult<PromotionCreateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    const response = await create({
      input: {
        name: data.name,
        type: data.type,
        description: data.description ? JSON.parse(data.description) : null,
        endDate: data.dates.hasEndDate
          ? joinDateTime(data.dates.endDate, data.dates.endTime)
          : null,
        startDate: joinDateTime(data.dates.startDate, data.dates.startTime),
        rules: data.rules.map(toAPI(data.type)),
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }
  };
};
