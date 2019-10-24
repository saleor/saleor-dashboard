import { ApolloError, MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import React from "react";
import { Mutation, MutationFunction, MutationResult } from "react-apollo";
import { useIntl } from "react-intl";

import useNotifier from "./hooks/useNotifier";
import { commonMessages } from "./intl";
import { maybe } from "./misc";

export interface TypedMutationInnerProps<TData, TVariables> {
  children: (
    mutateFn: MutationFunction<TData, TVariables>,
    result: MutationResult<TData>
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
    const { children, onCompleted, onError, variables } = props;

    return (
      <Mutation
        mutation={mutation}
        onCompleted={onCompleted}
        onError={(err: ApolloError) => {
          if (
            maybe(
              () =>
                err.graphQLErrors[0].extensions.exception.code ===
                "ReadOnlyException"
            )
          ) {
            notify({
              text: intl.formatMessage(commonMessages.readOnly)
            });
          } else {
            notify({
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
        {(mutateFn, result) => <>{children(mutateFn, result)}</>}
      </Mutation>
    );
  };
}
