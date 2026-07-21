// @ts-strict-ignore
import { type INotification } from "@dashboard/components/notifications";
import {
  type GiftCardCreateInput,
  type GiftCardCreateMutation,
  TimePeriodTypeEnum,
} from "@dashboard/graphql";
import commonErrorMessages from "@dashboard/utils/errors/common";
import moment from "moment-timezone";
import { type IntlShape } from "react-intl";

import { type GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import { giftCardUpdateFormMessages } from "../GiftCardsList/messages";
import { type GiftCardCreateFormData } from "./GiftCardCreateDialogForm";
import { giftCardCreateMessages as messages } from "./messages";
import { type GiftCardCreateFormCustomer } from "./types";

const addToCurrentDate = (
  currentDate: number,
  expiryPeriodAmount: number,
  unit: moment.unitOfTime.DurationConstructor,
) => moment(currentDate).add(expiryPeriodAmount, unit);

export const getExpiryPeriodTerminationDate = (
  currentDate: number,
  expiryPeriodType: TimePeriodTypeEnum,
  expiryPeriodAmount = 0,
): moment.Moment | null => {
  switch (expiryPeriodType) {
    case TimePeriodTypeEnum.DAY:
      return addToCurrentDate(currentDate, expiryPeriodAmount, "d");
    case TimePeriodTypeEnum.WEEK:
      return addToCurrentDate(currentDate, expiryPeriodAmount, "w");
    case TimePeriodTypeEnum.MONTH:
      return addToCurrentDate(currentDate, expiryPeriodAmount, "M");
    case TimePeriodTypeEnum.YEAR:
      return addToCurrentDate(currentDate, expiryPeriodAmount, "y");
    default:
      return null;
  }
};

const getGiftCardExpiryError = (intl: IntlShape): INotification => ({
  title: intl.formatMessage(giftCardUpdateFormMessages.giftCardInvalidExpiryDateHeader),
  text: intl.formatMessage(giftCardUpdateFormMessages.giftCardInvalidExpiryDateContent),
  status: "error",
});

export const getGiftCardCreateOnCompletedMessage = (
  errors: GiftCardCreateMutation["giftCardCreate"]["errors"],
  intl: IntlShape,
  successMessage?: INotification,
): INotification => {
  const hasExpiryError = errors.some(error => error.field === "expiryDate");
  const successGiftCardMessage = successMessage || {
    status: "success",
    text: intl.formatMessage(messages.createdSuccessAlertTitle),
  };

  if (hasExpiryError) {
    return getGiftCardExpiryError(intl);
  }

  return errors?.length
    ? {
        status: "error",
        text:
          errors.find(error => error.message)?.message ??
          intl.formatMessage(commonErrorMessages.unknownError),
      }
    : successGiftCardMessage;
};

export const getGiftCardExpiryInputData = (
  {
    expirySelected,
    expiryType,
    expiryDate,
    expiryPeriodAmount,
    expiryPeriodType,
  }: GiftCardCreateCommonFormData,
  currentDate: number,
): string => {
  if (!expirySelected) {
    return;
  }

  if (expiryType === "EXPIRY_PERIOD") {
    return getExpiryPeriodTerminationDate(
      currentDate,
      expiryPeriodType,
      expiryPeriodAmount,
    )?.format("YYYY-MM-DD");
  }

  return expiryDate;
};

export const getCreateGiftCardInputData = (
  formData: GiftCardCreateFormData,
  selectedCustomer: GiftCardCreateFormCustomer,
  currentDate: number,
  defaultChannelSlug?: string | null,
  assignedCustomer?: { id: string } | null,
): GiftCardCreateInput => {
  const {
    balanceAmount,
    balanceCurrency,
    channelSlug,
    note,
    requiresActivation,
    sendToCustomerSelected,
    tags,
  } = formData;
  const resolvedChannelSlug = channelSlug || defaultChannelSlug;

  return {
    addTags: tags?.map(tag => tag.value) || null,
    assignedTo: assignedCustomer?.id || null,
    balance: {
      amount: balanceAmount,
      currency: balanceCurrency,
    },
    channel: (sendToCustomerSelected && resolvedChannelSlug) || null,
    expiryDate: getGiftCardExpiryInputData(formData, currentDate),
    isActive: !requiresActivation,
    note: note || null,
    userEmail: (sendToCustomerSelected && selectedCustomer.email) || null,
  };
};
