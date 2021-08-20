import { commonMessages } from "@saleor/intl";
import { defineMessages, IntlShape } from "react-intl";

const commonErrorMessages = defineMessages({
  graphqlError: {
    defaultMessage: "API error"
  },
  invalid: {
    defaultMessage: "Invalid value"
  },
  unknownError: {
    defaultMessage: "Unknown error"
  }
});

enum CommonErrorCode {
  GRAPHQL_ERROR = "GRAPHQL_ERROR",
  INVALID = "INVALID",
  REQUIRED = "REQUIRED"
}
interface CommonError<ErrorCode> {
  code: ErrorCode | CommonErrorCode;
  field: string | null;
}

export function getCommonFormFieldErrorMessage<ErrorCode>(
  error: CommonError<ErrorCode> | undefined,
  intl: IntlShape
): string {
  if (error) {
    switch (error.code) {
      case CommonErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case CommonErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case CommonErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);

      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default commonErrorMessages;
