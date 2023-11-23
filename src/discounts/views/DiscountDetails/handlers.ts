import { FetchResult } from "@apollo/client";
import {
  PromotionUpdateMutation,
  PromotionUpdateMutationVariables,
} from "@dashboard/graphql";
import { getMutationErrors, joinDateTime } from "@dashboard/misc";

import { DiscoutFormData } from "../../types";

export const createUpdateHandler = (
  id: string,
  update: (
    varaibles: PromotionUpdateMutationVariables,
  ) => Promise<FetchResult<PromotionUpdateMutation>>,
) => {
  return async (data: DiscoutFormData) => {
    const response = await update({
      id,
      input: {
        name: data.name,
        description: JSON.parse(data.description),
        startDate: joinDateTime(data.dates.startDate, data.dates.startTime),
        endDate: data.dates.hasEndDate
          ? joinDateTime(data.dates.endDate, data.dates.endTime)
          : null,
      },
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }
  };
};
