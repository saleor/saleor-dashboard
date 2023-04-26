import {
  ApolloError,
  MutationFunction,
  MutationHookOptions as BaseMutationHookOptions,
  MutationResult,
  useMutation as useBaseMutation,
} from "@apollo/client";
import {
  handleNestedMutationErrors,
  showAllErrors,
  useUser,
} from "@dashboard/auth";
import { isJwtError } from "@dashboard/auth/errors";
import { commonMessages } from "@dashboard/intl";
import { getMutationStatus } from "@dashboard/misc";
import { MutationResultAdditionalProps } from "@dashboard/types";
import { GqlErrors, hasError } from "@dashboard/utils/api";
import { DocumentNode } from "graphql";
import { useIntl } from "react-intl";

import useNotifier from "./useNotifier";

export type MutationResultWithOpts<TData> = MutationResult<TData> &
  MutationResultAdditionalProps;

export type UseMutation<TData, TVariables> = [
  MutationFunction<TData, TVariables>,
  MutationResultWithOpts<TData>,
];
export type UseMutationHook<TData, TVariables> = (
  cbs: MutationHookOptions<TData, TVariables>,
) => UseMutation<TData, TVariables>;

export type MutationHookOptions<TData, TVariables> = BaseMutationHookOptions<
  TData,
  TVariables
> & { disableErrorHandling?: boolean };

export function useMutation<TData, TVariables>(
  mutation: DocumentNode,
  {
    onCompleted,
    onError,
    disableErrorHandling,
    ...opts
  }: MutationHookOptions<TData, TVariables>,
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
      if (!disableErrorHandling) {
        if (err?.graphQLErrors.length > 0) {
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
            err.graphQLErrors.map(graphQLError => {
              notify({
                status: "error",
                apiMessage: graphQLError.message,
              });
            });
          }
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

function makeMutation<TData, TVariables>(
  mutation: DocumentNode,
): UseMutationHook<TData, TVariables> {
  return (opts: MutationHookOptions<TData, TVariables>) =>
    useMutation<TData, TVariables>(mutation, opts);
}

export default makeMutation;
