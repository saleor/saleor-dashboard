import { defineMessages } from "react-intl";

import { ValidationErrorCode } from "./types";

export const validationMessages = defineMessages<ValidationErrorCode>({
  VALUE_REQUIRED: {
    defaultMessage: "Choose a value",
    description: "filters error messages value required"
  },
  DEPENDENCIES_MISSING: {
    defaultMessage: "Filter requires other filters: {dependencies}",
    description: "filters error messages dependencies missing"
  },
  UNKNOWN_ERROR: {
    defaultMessage: "Unknown error occurred",
    description: "filters error messages unknown error"
  }
});
