import { ChannelErrorCode, ChannelErrorFragment } from "@dashboard/graphql";

import { FormData } from "./components/ChannelForm";
import { isCutoffDateTooOld } from "./components/ChannelForm/automatic-checkout-complete/utils";

const createEmptyRequiredError = (field: string): ChannelErrorFragment => ({
  __typename: "ChannelError",
  code: ChannelErrorCode.REQUIRED,
  field,
  message: null,
});

const createInvalidError = (field: string): ChannelErrorFragment => ({
  __typename: "ChannelError",
  code: ChannelErrorCode.INVALID,
  field,
  message: null,
});

export const validateChannelFormData = (data: FormData) => {
  let errors: ChannelErrorFragment[] = [];

  if (!data.name) {
    errors = [...errors, createEmptyRequiredError("name")];
  }

  if (!data.slug) {
    errors = [...errors, createEmptyRequiredError("slug")];
  }

  if (!data.currencyCode) {
    errors = [...errors, createEmptyRequiredError("currencyCode")];
  }

  if (!data.defaultCountry) {
    errors = [...errors, createEmptyRequiredError("defaultCountry")];
  }

  if (
    data.automaticallyCompleteCheckouts &&
    isCutoffDateTooOld(data.automaticCompletionCutOffDate)
  ) {
    errors = [...errors, createInvalidError("automaticCompletionCutOffDate")];
  }

  return errors;
};
