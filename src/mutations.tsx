import { ApolloError, MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import React from "react";
import { Mutation, MutationFunction, MutationResult } from "react-apollo";

import useNotifier from "./hooks/useNotifier";
import i18n from "./i18n";

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
    const { children, onCompleted, onError, variables } = props;

    return (
      <Mutation
        mutation={mutation}
        onCompleted={onCompleted}
        onError={err => {
          const msg = i18n.t("Something went wrong: {{ message }}", {
            message: err.message
          });
          notify({ text: msg });
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
