import { TaxClassUpdateErrorCode } from "@saleor/graphql";
import { CommonError, CommonErrorCode } from "@saleor/utils/errors/common";

import { TaxClassesPageFormData } from "../pages/TaxClassesPage/form";

export const createEmptyRequiredError = (
  field: string,
): CommonError<TaxClassUpdateErrorCode> => ({
  code: CommonErrorCode.REQUIRED,
  field,
  message: null,
});

export const validateTaxClassFormData = (data: TaxClassesPageFormData) => {
  let errors: Array<CommonError<TaxClassUpdateErrorCode>> = [];

  if (!data.name) {
    errors = [...errors, createEmptyRequiredError("name")];
  }

  return errors;
};
