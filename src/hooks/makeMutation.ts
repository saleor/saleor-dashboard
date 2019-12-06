import { ApolloError } from "apollo-client";
import { DocumentNode } from "graphql";
import {
  MutationFunction,
  MutationResult,
  useMutation as useBaseMutation
} from "react-apollo";
import { useIntl } from "react-intl";

import { commonMessages } from "@saleor/intl";
import { maybe, getMutationStatus } from "@saleor/misc";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import useNotifier from "./useNotifier";

export type UseMutation<TData, TVariables> = [
  MutationFunction<TData, TVariables>,
  MutationResult<TData> & {
    state: ConfirmButtonTransitionState;
  }
];
export type UseMutationCbs<TData> = Partial<{
  onCompleted: (data: TData) => void;
  onError: (error: ApolloError) => void;
}>;
export type UseMutationHook<TData, TVariables> = (
  cbs: UseMutationCbs<TData>
) => UseMutation<TData, TVariables>;

function makeMutation<TData, TVariables>(
  mutation: DocumentNode
): UseMutationHook<TData, TVariables> {
  function useMutation<TData, TVariables>({
    onCompleted,
    onError
  }: UseMutationCbs<TData>): UseMutation<TData, TVariables> {
    const notify = useNotifier();
    const intl = useIntl();
    const [mutateFn, result] = useBaseMutation(mutation, {
      onCompleted,
      onError: (err: ApolloError) => {
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
      }
    });

    return [
      mutateFn,
      {
        ...result,
        state: getMutationStatus(result)
      }
    ];
  }

  return useMutation;
}

export default makeMutation;
