import { CommonError, CommonErrorCode } from "@dashboard/utils/errors/common";

import { TaxClassesPageFormData } from "../types";

const createEmptyRequiredError = (field: string): CommonError<CommonErrorCode> => ({
  code: CommonErrorCode.REQUIRED,
  field,
  message: null,
});

export const validateTaxClassFormData = (data: TaxClassesPageFormData) => {
  let errors: Array<CommonError<CommonErrorCode>> = [];

  if (!data.name) {
    errors = [...errors, createEmptyRequiredError("name")];
  }

  return errors;
};
