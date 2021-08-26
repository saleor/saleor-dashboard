import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import moment from "moment-timezone";

import { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";

const addToCurrentDate = (
  expiryPeriodAmount: number,
  unit: moment.unitOfTime.DurationConstructor
) => moment().add(expiryPeriodAmount, unit);

export const getExpiryPeriodTerminationDate = (
  expiryPeriodType: TimePeriodTypeEnum,
  expiryPeriodAmount: number = 0
): moment.Moment | null => {
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
  expirySelected,
  expiryType,
  expiryDate,
  expiryPeriodAmount,
  expiryPeriodType
}: Pick<
  GiftCardCreateFormData,
  | "expirySelected"
  | "expiryDate"
  | "expiryPeriodAmount"
  | "expiryPeriodType"
  | "expiryType"
>): string => {
  if (!expirySelected) {
    return;
  }

  if (expiryType === "EXPIRY_PERIOD") {
    return getExpiryPeriodTerminationDate(
      expiryPeriodType,
      expiryPeriodAmount
    )?.format("YYYY-MM-DD");
  }

  return expiryDate;
};
