import { RewardValueTypeEnum } from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";
import * as z from "zod";

const validationMessages = defineMessages({
  nameRequired: {
    id: "7Hdiw2",
    defaultMessage: "Rule name is required",
  },
  rewardValueRequired: {
    id: "CFlmRP",
    defaultMessage: "Rule reword value is required",
  },
  rewordValueMustBeLessThan100: {
    id: "JyaQcP",
    defaultMessage: "Rule reword value must be less than 100",
  },
});

export const getValidationSchema = (intl: IntlShape) =>
  z
    .object({
      id: z.string().optional(),
      name: z
        .string()
        .min(1, intl.formatMessage(validationMessages.nameRequired)),
      channel: z.object({ label: z.string(), value: z.string() }).nullable(),
      conditions: z.array(
        z
          .object({
            type: z.string().nullable(),
            condition: z.string(),
            values: z.array(z.object({ label: z.string(), value: z.string() })),
          })
          .optional(),
      ),
      rewardValue: z.number({
        required_error: intl.formatMessage(validationMessages.nameRequired),
        invalid_type_error: intl.formatMessage(validationMessages.nameRequired),
      }),
      rewardValueType: z.string(),
      description: z.string().nullable(),
    })
    .refine(
      ({ rewardValue, rewardValueType, channel }) => {
        if (
          channel &&
          rewardValueType === RewardValueTypeEnum.PERCENTAGE &&
          Number(rewardValue) > 100
        ) {
          return false;
        }

        return true;
      },
      {
        message: intl.formatMessage(
          validationMessages.rewordValueMustBeLessThan100,
        ),
        path: ["rewardValue"],
      },
    );
