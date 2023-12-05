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
      channels: z.array(z.object({ label: z.string(), value: z.string() })),
      conditions: z.array(
        z.object({
          type: z.string().nullable(),
          condition: z.string(),
          values: z.array(z.object({ label: z.string(), value: z.string() })),
        }),
      ),
      rewardValue: z.number({
        required_error: intl.formatMessage(validationMessages.nameRequired),
        invalid_type_error: intl.formatMessage(validationMessages.nameRequired),
      }),
      rewardValueType: z.string(),
    })
    .refine(
      ({ rewardValue, rewardValueType, channels }) => {
        if (
          channels.length > 0 &&
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
