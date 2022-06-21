import { IMessage } from "@saleor/components/messages";
import { GiftCardCreateMutation, TimePeriodTypeEnum } from "@saleor/graphql";
import commonErrorMessages from "@saleor/utils/errors/common";
import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import { giftCardUpdateFormMessages } from "../GiftCardsList/messages";
import { giftCardCreateMessages as messages } from "./messages";

const addToCurrentDate = (
  currentDate: number,
  expiryPeriodAmount: number,
  unit: moment.unitOfTime.DurationConstructor,
) => moment(currentDate).add(expiryPeriodAmount, unit);

export const getExpiryPeriodTerminationDate = (
  currentDate: number,
  expiryPeriodType: TimePeriodTypeEnum,
  expiryPeriodAmount: number = 0,
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

export const getGiftCardExpiryError = (intl: IntlShape): IMessage => ({
  title: intl.formatMessage(
    giftCardUpdateFormMessages.giftCardInvalidExpiryDateHeader,
  ),
  text: intl.formatMessage(
    giftCardUpdateFormMessages.giftCardInvalidExpiryDateContent,
  ),
  status: "error",
});

export const getGiftCardCreateOnCompletedMessage = (
  errors: GiftCardCreateMutation["giftCardCreate"]["errors"],
  intl: IntlShape,
  successMessage?: IMessage,
): IMessage => {
  const hasExpiryError = errors.some(error => error.field === "expiryDate");
  const successGiftCardMessage = successMessage || {
    status: "success",
    text: intl.formatMessage(messages.createdSuccessAlertTitle),
  };

  if (hasExpiryError) {
    return getGiftCardExpiryError(intl);
  }

  return !!errors?.length
    ? {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
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
