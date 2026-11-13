import { type ApolloError, type ServerError } from "@apollo/client/core";
import {
  type INotification,
  type INotificationCallback,
} from "@dashboard/components/notifications/NotificationContext";
import { connectionMessages } from "@dashboard/connection/messages";
import { getServerErrorProblem, type ServerErrorProblem } from "@dashboard/connection/serverErrors";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors, parseLogMessage } from "@dashboard/misc";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { type IntlShape } from "react-intl";
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

const getServerErrorNotification = (
  problem: ServerErrorProblem,
  intl: IntlShape,
  context: "load" | "action",
): INotification => {
  if (context === "load") {
    return {
      status: "error",
      title: intl.formatMessage(connectionMessages.loadFailedTitle),
      text:
        problem.kind === "serverError"
          ? intl.formatMessage(connectionMessages.loadServerErrorDescription, {
              status: problem.status,
            })
          : problem.kind === "refused"
            ? intl.formatMessage(connectionMessages.loadRefusedDescription, {
                status: problem.status,
              })
            : intl.formatMessage(connectionMessages.loadUnreadableDescription),
    };
  }

  // A refused request never reached Saleor. After a 5xx or an unreadable answer, the change may
  // or may not have gone through.
  return problem.kind === "refused"
    ? {
        status: "error",
        title: intl.formatMessage(connectionMessages.actionRefusedTitle, {
          status: problem.status,
        }),
        text: intl.formatMessage(connectionMessages.actionRefusedDescription),
      }
    : {
        status: "error",
        title:
          problem.kind === "serverError"
            ? intl.formatMessage(connectionMessages.actionServerErrorTitle, {
                status: problem.status,
              })
            : intl.formatMessage(connectionMessages.actionUnreadableTitle),
        text: intl.formatMessage(connectionMessages.actionFailedDescription),
      };
};

/**
 * Reports a failed request's errors. An answer whose raw text would mean nothing to a merchant (a
 * 5xx, a proxy's page, an answer that isn't JSON) gets a plain message instead; `context` says
 * whether it failed loading data or doing an action.
 */
export const showAllErrors = ({
  notify,
  error,
  intl,
  context,
}: {
  notify: INotificationCallback;
  error: ApolloError;
  intl: IntlShape;
  context: "load" | "action";
}) => {
  const problem = getServerErrorProblem(error);

  if (problem) {
    notify(getServerErrorNotification(problem, intl, context));

    return;
  }

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
      showAllErrors({ notify, error, intl, context: "load" });
    }
  } else {
    showAllErrors({ notify, error, intl, context: "load" });
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
