import { RewardValueTypeEnum } from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";
import * as z from "zod";

const validationMessages = defineMessages({
  nameRequired: {
    id: "7Hdiw2",
    defaultMessage: "Rule name is required",
  },
  channelRequired: {
    id: "y08GTW",
    defaultMessage: "Channel is required",
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
      type: z.string().optional(),
      name: z
        .string()
        .min(1, intl.formatMessage(validationMessages.nameRequired)),
      channel: z.object(
        { label: z.string(), value: z.string() },
        {
          required_error: intl.formatMessage(
            validationMessages.channelRequired,
          ),
          invalid_type_error: intl.formatMessage(
            validationMessages.channelRequired,
          ),
        },
      ),
      conditions: z.array(
        z.object({
          id: z.string().nullable(),
          type: z.string(),
          values: z
            .array(z.object({ label: z.string(), value: z.string() }))
            .or(z.string())
            .or(z.tuple([z.string(), z.string()])),
        }),
      ),
      rewardValue: z
        .number({
          required_error: intl.formatMessage(validationMessages.nameRequired),
          invalid_type_error: intl.formatMessage(
            validationMessages.nameRequired,
          ),
        })
        .min(1, intl.formatMessage(validationMessages.rewardValueRequired)),
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
