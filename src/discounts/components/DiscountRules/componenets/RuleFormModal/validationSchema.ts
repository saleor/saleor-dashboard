import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import { type ChannelFragment, RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import { defineMessages, type IntlShape } from "react-intl";
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
    id: "uf1ttM",
    defaultMessage: "Rule reward value is required",
  },
  rewardValueMustBeLessThan100: {
    id: "DDYrvn",
    defaultMessage: "Rule reward value must be less than 100",
  },
  rewardGiftRequired: {
    id: "GxsQuO",
    defaultMessage: "You must select at least one gift",
  },
  fixedRewardMixesCurrencies: {
    id: "dbuT2a",
    defaultMessage:
      "A fixed amount needs one currency, but this rule also applies in {channels}. Use a percentage instead.",
    description: "promotion rule error when a fixed reward would mix channel currencies",
  },
});
const option = z.object({ label: z.string(), value: z.string() });
const rewardValueRequired = (intl: IntlShape) =>
  z
    .number({
      required_error: intl.formatMessage(validationMessages.rewardValueRequired),
      invalid_type_error: intl.formatMessage(validationMessages.rewardValueRequired),
    })
    // A typed 0 stays in the field, so say what is wrong with it rather than "required".
    .gt(0, intl.formatMessage(voucherFeedbackMessages.discountValueNotPositive));
const getDefaultSchema = (intl: IntlShape) =>
  z.object({
    id: z.string().optional(),
    description: z.string().nullable(),
    hasPredicateNestedConditions: z.boolean().optional(),
    name: z.string().min(1, intl.formatMessage(validationMessages.nameRequired)),
    channel: z.object(
      { label: z.string(), value: z.string() },
      {
        required_error: intl.formatMessage(validationMessages.channelRequired),
        invalid_type_error: intl.formatMessage(validationMessages.channelRequired),
      },
    ),
    otherChannels: z
      .array(z.object({ id: z.string(), name: z.string(), currencyCode: z.string() }))
      .optional(),
    conditions: z.array(
      z.object({
        id: z.string().nullable(),
        type: z.string(),
        value: z
          .array(option)
          .or(z.string())
          .or(z.tuple([z.string(), z.string()]))
          .or(z.null()),
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

/**
 * Pass `channels` to check a fixed reward against the rule's other channels: Saleor rejects a
 * fixed amount across channels in different currencies.
 */
export const getValidationSchema = (
  intl: IntlShape,
  { channels = [] }: { channels?: ChannelFragment[] } = {},
) => {
  const schemaCond = z.discriminatedUnion("rewardType", [
    getCatalogRewardValidation(intl),
    getOrderRewardSubtotalValidation(intl),
    getOrderRewardGiftsValidation(intl),
  ]);

  return z
    .intersection(schemaCond, getDefaultSchema(intl))
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
        message: intl.formatMessage(validationMessages.rewardValueMustBeLessThan100),
        path: ["rewardValue"],
      },
    )
    .superRefine(({ rewardType, rewardValueType, channel, otherChannels }, ctx) => {
      if (
        rewardType === RewardTypeEnum.GIFT ||
        rewardValueType !== RewardValueTypeEnum.FIXED ||
        !otherChannels?.length
      ) {
        return;
      }

      const currency = channels.find(({ id }) => id === channel?.value)?.currencyCode;
      const otherCurrencies = otherChannels.filter(other => other.currencyCode !== currency);

      if (otherCurrencies.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rewardValue"],
          message: intl.formatMessage(validationMessages.fixedRewardMixesCurrencies, {
            channels: intl.formatList(otherCurrencies.map(other => other.name)),
          }),
        });
      }
    });
};
