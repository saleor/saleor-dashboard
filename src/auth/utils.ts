import { ApolloError, ServerError } from "@apollo/client/core";
import { INotification, INotificationCallback } from "@dashboard/components/notifications";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors, parseLogMessage } from "@dashboard/misc";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import { isJwtError, isTokenExpired } from "./errors";
import { newPasswordUrl } from "./urls";

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
  notify: INotificationCallback;
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
  notify: (notification: INotification) => void;
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
  notify: INotificationCallback,
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

export const getNewPasswordResetRedirectUrl = () =>
  urlJoin(window.location.origin, getAppMountUriForRedirect(), newPasswordUrl().replace(/\?/, ""));

export const CLOUD_PLUGIN_ID = "cloud_auth.CloudAuthorizationPlugin";

export const SSO_PLUGIN_ID = "mirumee.authentication.openidconnect";

export const getExternalAuthenticationMethodName = ({
  pluginId,
  intl,
}: {
  pluginId: string;
  intl: IntlShape;
}): string | null => {
  switch (pluginId) {
    case CLOUD_PLUGIN_ID:
      return intl.formatMessage({
        defaultMessage: "Continue with Saleor Cloud",
        id: "qf8OtW",
      });
    case SSO_PLUGIN_ID:
      return intl.formatMessage({
        defaultMessage: "Continue with SSO",
        id: "qank7+",
      });
    default:
      return null;
  }
};
