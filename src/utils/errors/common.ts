import { commonMessages } from "@saleor/intl";
import { defineMessages, IntlShape } from "react-intl";

const commonErrorMessages = defineMessages({
  graphqlError: {
    id: "c5pMZ8",
    defaultMessage: "API error",
  },
  invalid: {
    id: "577R2r",
    defaultMessage: "Invalid value",
  },
  unknownError: {
    id: "qDwvZ4",
    defaultMessage: "Unknown error",
  },
});

type CommonErrorCode = "GRAPHQL_ERROR" | "INVALID" | "REQUIRED";

interface CommonError<ErrorCode> {
  code: ErrorCode | CommonErrorCode;
  field?: string | null;
}

export function getCommonFormFieldErrorMessage<ErrorCode>(
  error: CommonError<ErrorCode> | undefined,
  intl: IntlShape,
): string {
  if (error) {
    switch (error.code) {
      case "GRAPHQL_ERROR":
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case "REQUIRED":
        return intl.formatMessage(commonMessages.requiredField);
      case "INVALID":
        return intl.formatMessage(commonErrorMessages.invalid);

      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default commonErrorMessages;
