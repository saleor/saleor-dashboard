import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import moment from "moment-timezone";

import { GiftCardCommonFormData, GiftCardExpiryType } from "./types";

const dateFormat = "L";

const addToCurrentDate = (
  expiryPeriodAmount: number,
  unit: moment.unitOfTime.DurationConstructor
) =>
  moment()
    .add(expiryPeriodAmount, unit)
    .format(dateFormat);

export const getExpiryPeriodTerminationDate = (
  expiryPeriodType: TimePeriodTypeEnum,
  expiryPeriodAmount: number = 0
) => {
  switch (expiryPeriodType) {
    case TimePeriodTypeEnum.DAY:
      return addToCurrentDate(expiryPeriodAmount, "d");
    case TimePeriodTypeEnum.MONTH:
      return addToCurrentDate(expiryPeriodAmount, "M");
    case TimePeriodTypeEnum.YEAR:
      return addToCurrentDate(expiryPeriodAmount, "y");
    default:
      return null;
  }
};

export const getGiftCardExpiryInputData = ({
  expiryType,
  expiryDate,
  expiryPeriodAmount,
  expiryPeriodType
}: Pick<
  GiftCardCommonFormData,
  "expiryDate" | "expiryPeriodAmount" | "expiryPeriodType" | "expiryType"
>): string => {
  if (!expiryDate && expiryType === "EXPIRY_PERIOD") {
    return getExpiryPeriodTerminationDate(expiryPeriodType, expiryPeriodAmount);
  }

  return expiryDate;
};
