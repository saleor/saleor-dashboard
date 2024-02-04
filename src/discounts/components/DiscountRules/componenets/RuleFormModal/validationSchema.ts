import { RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
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
  rewardValueMustBeLessThan100: {
    id: "JyaQcP",
    defaultMessage: "Rule reword value must be less than 100",
  },
  rewardGiftRequired: {
    id: "GxsQuO",
    defaultMessage: "You must select at least one gift",
  },
});

const option = z.object({ label: z.string(), value: z.string() });
const rewardValueRequired = (intl: IntlShape) =>
  z
    .number({
      required_error: intl.formatMessage(
        validationMessages.rewardValueRequired,
      ),
      invalid_type_error: intl.formatMessage(
        validationMessages.rewardValueRequired,
      ),
    })
    .min(1, intl.formatMessage(validationMessages.rewardValueRequired));

const getDefaultSchema = (intl: IntlShape) =>
  z.object({
    id: z.string().optional(),
    description: z.string().nullable(),
    name: z
      .string()
      .min(1, intl.formatMessage(validationMessages.nameRequired)),
    channel: z.object(
      { label: z.string(), value: z.string() },
      {
        required_error: intl.formatMessage(validationMessages.channelRequired),
        invalid_type_error: intl.formatMessage(
          validationMessages.channelRequired,
        ),
      },
    ),
    conditions: z.array(
      z.object({
        id: z.string().nullable(),
        type: z.string(),
        value: z
          .array(option)
          .or(z.string())
          .or(z.tuple([z.string(), z.string()])),
      }),
    ),
  });

const getCatalogRewardValidation = (intl: IntlShape) =>
  z.object({
    rewardValue: rewardValueRequired(intl),
    rewardValueType: z.string(),
    rewardType: z.literal(null),
    rewardGifts: z.array(option).optional(),
  });

const getOrderRewardSubtotalValidation = (intl: IntlShape) => {
  return z.object({
    rewardValue: rewardValueRequired(intl),
    rewardValueType: z.string(),
    rewardType: z.literal(RewardTypeEnum.SUBTOTAL_DISCOUNT),
    rewardGifts: z.array(option).optional(),
  });
};

const getOrderRewardGiftsValidation = (intl: IntlShape) =>
  z.object({
    rewardValue: z.null(),
    rewardValueType: z.string(),
    rewardType: z.literal(RewardTypeEnum.GIFT),
    rewardGifts: z.array(option).nonempty({
      message: intl.formatMessage(validationMessages.rewardGiftRequired),
    }),
  });

export const getValidationSchema = (intl: IntlShape) => {
  const schemaCond = z.discriminatedUnion("rewardType", [
    getCatalogRewardValidation(intl),
    getOrderRewardSubtotalValidation(intl),
    getOrderRewardGiftsValidation(intl),
  ]);

  return z.intersection(schemaCond, getDefaultSchema(intl)).refine(
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
        validationMessages.rewardValueMustBeLessThan100,
      ),
      path: ["rewardValue"],
    },
  );
};
