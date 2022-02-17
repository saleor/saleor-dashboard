import { ApolloError } from "@apollo/client/core";
import { IMessageContext } from "@saleor/components/messages";
import { UseNotifierResult } from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ServerErrorWithName } from "@saleor/types";
import { IntlShape } from "react-intl";

import { isJwtError, isTokenExpired } from "./errors";

export const displayDemoMessage = (
  intl: IntlShape,
  notify: UseNotifierResult
) => {
  notify({
    text: intl.formatMessage(commonMessages.demo)
  });
};

const getAllErrorMessages = (error: ApolloError) => {
  const errorMessages = [];

  if (error.graphQLErrors.length) {
    error.graphQLErrors.forEach(err => {
      errorMessages.push(err.message);
    });
  }

  const networkErrors = error.networkError as ServerErrorWithName;

  if (error.networkError) {
    // Apparently network errors can be an object or an array
    if (Array.isArray(networkErrors.result)) {
      networkErrors.result.forEach(result => {
        if (result.errors) {
          result.errors.forEach(({ message }) => {
            errorMessages.push(message);
          });
        }
      });
    } else {
      errorMessages.push(networkErrors.result.errors.message);
    }
  }

  return errorMessages;
};

export const showAllErrors = ({
  notify,
  error
}: {
  notify: IMessageContext;
  error: ApolloError;
}) => {
  getAllErrorMessages(error).forEach(message => {
    notify({
      text: error.message,
      status: "error",
      apiMessage: message
    });
  });
};

export async function handleQueryAuthError(
  error: ApolloError,
  notify: IMessageContext,
  logout: () => void,
  intl: IntlShape
) {
  if (error.graphQLErrors.some(isJwtError)) {
    logout();
    if (error.graphQLErrors.every(isTokenExpired)) {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.sessionExpired)
      });
    } else {
      showAllErrors({ notify, error });
    }
  } else {
    showAllErrors({ notify, error });
  }
}
