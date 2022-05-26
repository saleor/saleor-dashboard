import { defineMessages } from "react-intl";

import { ValidationErrorCode } from "./types";

export const validationMessages = defineMessages<ValidationErrorCode>({
  VALUE_REQUIRED: {
    id: "XkX56I",
    defaultMessage: "Choose a value",
    description: "filters error messages value required",
  },
  DEPENDENCIES_MISSING: {
    id: "erC44f",
    defaultMessage: "Filter requires other filters: {dependencies}",
    description: "filters error messages dependencies missing",
  },
  UNKNOWN_ERROR: {
    id: "USS3Q7",
    defaultMessage: "Unknown error occurred",
    description: "filters error messages unknown error",
  },
});

export const keyValueMessages = defineMessages({
  key: {
    defaultMessage: "Key",
    id: "q1shey",
    description: "key-value field input",
  },
  value: {
    defaultMessage: "Value",
    id: "Pnj+JH",
    description: "key-value field input",
  },
  add: {
    defaultMessage: "Add more",
    id: "ILgbKN",
    description: "key-value field button add more key-value pairs",
  },
});
