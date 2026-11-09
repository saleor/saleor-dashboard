// @ts-strict-ignore
import {
  type ApolloError,
  type MutationFunction,
  type MutationHookOptions as BaseMutationHookOptions,
  type MutationResult,
  useMutation as useBaseMutation,
} from "@apollo/client";
import { isJwtError, isSessionEndedError, isSessionExpiredError } from "@dashboard/auth/errors";
import { useUser } from "@dashboard/auth/useUser";
import { handleNestedMutationErrors, showAllErrors } from "@dashboard/auth/utils";
import { isConnectionError } from "@dashboard/connection/connectionErrors";
import { connectionMessages } from "@dashboard/connection/messages";
import { commonMessages } from "@dashboard/intl";
import { getMutationStatus } from "@dashboard/misc";
import { type MutationResultAdditionalProps } from "@dashboard/types";
import { GqlErrors, hasError } from "@dashboard/utils/api";
import { type DocumentNode } from "graphql";
import { useIntl } from "react-intl";

import { useNotifier } from "./useNotifier/useNotifier";

export type MutationResultWithOpts<TData> = MutationResult<TData> & MutationResultAdditionalProps;

type UseMutation<TData, TVariables> = [
  MutationFunction<TData, TVariables>,
  MutationResultWithOpts<TData>,
];

export type MutationHookOptions<TData, TVariables> = BaseMutationHookOptions<TData, TVariables> & {
  disableErrorHandling?: boolean;
};

export function useMutation<TData, TVariables>(
  mutation: DocumentNode,
  { onCompleted, onError, disableErrorHandling, ...opts }: MutationHookOptions<TData, TVariables>,
): UseMutation<TData, TVariables> {
  const notify = useNotifier();
  const intl = useIntl();
  const user = useUser();
  const [mutateFn, result] = useBaseMutation(mutation, {
    ...opts,
    onCompleted: data => {
      if (!disableErrorHandling) {
        handleNestedMutationErrors({
          data,
          intl,
          notify,
        });
      }

      if (onCompleted) {
        onCompleted(data);
      }
    },
    onError: (err: ApolloError) => {
      // Two ways a session ends while an action waits for a token refresh. The API refusing the
      // refresh token logged out, so the session expired; a logout or another login means nothing
      // went wrong for the merchant, so the action is dropped quietly.
      if (!disableErrorHandling && isSessionExpiredError(err)) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.sessionExpired),
        });
      } else if (!disableErrorHandling && !isSessionEndedError(err)) {
        if (err?.graphQLErrors?.length > 0) {
          if (hasError(err, GqlErrors.ReadOnlyException)) {
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.readOnly),
            });
          } else if (err.graphQLErrors.some(isJwtError)) {
            user.logout();
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.sessionExpired),
            });
          } else if (!hasError(err, GqlErrors.LimitReachedException)) {
            err.graphQLErrors.forEach(graphQLError => {
              notify({
                status: "error",
                apiMessage: graphQLError.message,
              });
            });
          }
        } else if (isConnectionError(err)) {
          // Without the network or parser text. The request may still have reached Saleor (a
          // 504, or a connection lost after sending), so it doesn't claim nothing was saved:
          // retrying a create could make a duplicate. Stays until dismissed, like other errors.
          notify({
            status: "error",
            title: intl.formatMessage(connectionMessages.actionFailedTitle),
            text: intl.formatMessage(connectionMessages.actionFailedDescription),
          });
        } else {
          showAllErrors({ notify, error: err });
        }
      }

      if (onError) {
        onError(err);
      }
    },
  });

  return [
    mutateFn,
    {
      ...result,
      status: getMutationStatus(result),
    },
  ];
}
