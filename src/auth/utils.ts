import { ApolloError, ServerError } from "@apollo/client/core";
import { IMessage, IMessageContext } from "@dashboard/components/messages";
import { UseNotifierResult } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors, parseLogMessage } from "@dashboard/misc";
import { IntlShape } from "react-intl";

import { isJwtError, isTokenExpired } from "./errors";

export const displayDemoMessage = (intl: IntlShape, notify: UseNotifierResult) => {
  notify({
    text: intl.formatMessage(commonMessages.demo),
  });
};

const getNetworkErrors = (error: ApolloError): string[] => {
  const networkErrors = error.networkError as ServerError;
  if (networkErrors) {
    // Apparently network errors can be an object or an array

    if (Array.isArray(networkErrors.result)) {
      networkErrors.result.forEach(result => {
        if (result.errors) {
          return result.errors.map(({ message }: { message: string }) => message);
        }
      });
    }

    if (networkErrors.result?.errors) {
      return networkErrors.result.errors.map(({ message }: { message: string }) => message);
    }

    return [networkErrors.message];
  }

  return [];
};
const getAllErrorMessages = (error: ApolloError) => [
  ...(error.graphQLErrors?.map(err => err.message) || []),
  ...getNetworkErrors(error),
];

export const showAllErrors = ({
  notify,
  error,
}: {
  notify: IMessageContext;
  error: ApolloError;
}) => {
  getAllErrorMessages(error).forEach(message => {
    notify({
      text: error.message,
      status: "error",
      apiMessage: message,
    });
  });
};

export const handleNestedMutationErrors = ({
  data,
  intl,
  notify,
}: {
  data: any;
  intl: IntlShape;
  notify: (message: IMessage) => void;
}) => {
  const mutationErrors = getMutationErrors({ data });

  if (mutationErrors.length > 0) {
    mutationErrors.forEach(error => {
      notify({
        status: "error",
        text: error.message,
        apiMessage: parseLogMessage({
          intl,
          code: error.code,
          field: error.field,
          voucherCodes: error.voucherCodes,
        }),
      });
    });
  }
};

export async function handleQueryAuthError(
  error: ApolloError,
  notify: IMessageContext,
  logout: () => void,
  intl: IntlShape,
) {
  if (error.graphQLErrors.some(isJwtError)) {
    logout();
    if (error.graphQLErrors.every(isTokenExpired)) {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.sessionExpired),
      });
    } else {
      showAllErrors({ notify, error });
    }
  } else {
    showAllErrors({ notify, error });
  }
}
