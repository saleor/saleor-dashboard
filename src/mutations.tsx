import { ApolloError, MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import React from "react";
import { Mutation, MutationFunction, MutationResult } from "react-apollo";
import { useIntl } from "react-intl";

import { isJwtError } from "./auth/errors";
import useNotifier from "./hooks/useNotifier";
import useUser from "./hooks/useUser";
import { commonMessages } from "./intl";
import { getMutationStatus } from "./misc";
import { MutationResultAdditionalProps } from "./types";
import { GqlErrors, hasError } from "./utils/api";

export interface TypedMutationInnerProps<TData, TVariables> {
  children: (
    mutateFn: MutationFunction<TData, TVariables>,
    result: MutationResult<TData> & MutationResultAdditionalProps
  ) => React.ReactNode;
  onCompleted?: (data: TData) => void;
  onError?: (error: ApolloError) => void;
  variables?: TVariables;
}

// For some reason Mutation returns () => Element instead of () => ReactNode
export function TypedMutation<TData, TVariables>(
  mutation: DocumentNode,
  update?: MutationUpdaterFn<TData>
) {
  return (props: TypedMutationInnerProps<TData, TVariables>) => {
    const notify = useNotifier();
    const intl = useIntl();
    const user = useUser();
    const { children, onCompleted, onError, variables } = props;

    return (
      <Mutation
        mutation={mutation}
        onCompleted={onCompleted}
        onError={(err: ApolloError) => {
          if (err.networkError) {
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.somethingWentWrong)
            });
          }
          if (hasError(err, GqlErrors.ReadOnlyException)) {
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.readOnly)
            });
          } else if (err.graphQLErrors.some(isJwtError)) {
            user.logout();
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.sessionExpired)
            });
          } else if (!hasError(err, GqlErrors.LimitReachedException)) {
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.somethingWentWrong)
            });
          }
          if (onError) {
            onError(err);
          }
        }}
        variables={variables}
        update={update}
      >
        {(mutateFn, result) => (
          <>
            {children(mutateFn, {
              ...result,
              status: getMutationStatus(result)
            })}
          </>
        )}
      </Mutation>
    );
  };
}
