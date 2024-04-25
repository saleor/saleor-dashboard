import { PromotionTypeEnum } from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";
import * as z from "zod";

const validationMessages = defineMessages({
  nameRequired: {
    id: "7Hdiw2",
    defaultMessage: "Rule name is required",
  },
});

export const getValidationSchema = (intl: IntlShape) => {
  return z.object({
    type: z.enum([PromotionTypeEnum.CATALOGUE, PromotionTypeEnum.ORDER]),
    name: z.string().min(1, intl.formatMessage(validationMessages.nameRequired)),
    description: z.string().optional(),
    dates: z
      .object({
        endDate: z.string().optional(),
        endTime: z.string().optional(),
        hasEndDate: z.boolean().optional(),
        startDate: z.string().optional(),
        startTime: z.string().optional(),
      })
      .refine(
        data => {
          if (data.hasEndDate && data.endDate && !data.startDate) {
            return false;
          }

          return true;
        },
        {
          message: "Start date is required when end date is provided",
          path: ["startDate"],
        },
      ),
    rules: z.array(z.any()).optional(),
  });
};
