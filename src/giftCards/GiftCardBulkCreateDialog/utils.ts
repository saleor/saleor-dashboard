import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { GiftCardErrorCode } from "@saleor/types/globalTypes";
import reduce from "lodash/reduce";

import {
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors
} from "./types";

export const getFormError = (
  {
    expiryDate,
    expiryPeriodAmount,
    expiryType,
    expirySelected,
    expiryPeriodType
  }: GiftCardBulkCreateFormData,
  value,
  key: keyof GiftCardBulkCreateFormData
): Pick<GiftCardError, "field" | "code"> | null => {
  const error = { code: GiftCardErrorCode.INVALID, field: key };

  switch (key) {
    case "cardsAmount":
    case "tag":
    case "balanceCurrency":
    case "balanceAmount":
      return !value ? error : null;

    case "expiryDate":
      if (expirySelected && expiryType === "EXPIRY_DATE") {
        return !expiryDate ? error : null;
      }
      return null;

    case "expiryPeriodAmount":
      if (expirySelected && expiryType === "EXPIRY_PERIOD") {
        return !expiryPeriodType || !expiryPeriodAmount
          ? { ...error, field: "expiryDate" }
          : null;
      }
      return null;
  }
};

export const getFormSchemaErrors = (
  formData: GiftCardBulkCreateFormData
): GiftCardBulkCreateFormErrors =>
  reduce(
    formData,
    (resultErrors, value, key: keyof GiftCardBulkCreateFormData) => {
      const correspondingKeys = {
        cardsAmount: "count",
        balanceCurrency: "balance",
        balanceAmount: "balance",
        expiryPeriodAmount: "expiryDate"
      };

      const formError = getFormError(formData, value, key);

      if (!formError) {
        return resultErrors;
      }

      return { ...resultErrors, [correspondingKeys[key] || key]: formError };
    },
    {}
  );
