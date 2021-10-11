import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import moment from "moment-timezone";

import { GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";
import { GiftCardCreateCommonFormErrors } from "./types";

const addToCurrentDate = (
  currentDate: number,
  expiryPeriodAmount: number,
  unit: moment.unitOfTime.DurationConstructor
) => moment(currentDate).add(expiryPeriodAmount, unit);

export const getExpiryPeriodTerminationDate = (
  currentDate: number,
  expiryPeriodType: TimePeriodTypeEnum,
  expiryPeriodAmount: number = 0
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

export const getGiftCardExpiryInputData = (
  {
    expirySelected,
    expiryType,
    expiryDate,
    expiryPeriodAmount,
    expiryPeriodType
  }: GiftCardCreateCommonFormData,
  currentDate: number
): string => {
  if (!expirySelected) {
    return;
  }

  if (expiryType === "EXPIRY_PERIOD") {
    return getExpiryPeriodTerminationDate(
      currentDate,
      expiryPeriodType,
      expiryPeriodAmount
    )?.format("YYYY-MM-DD");
  }

  return expiryDate;
};
