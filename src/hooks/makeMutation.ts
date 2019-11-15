import { ApolloError } from "apollo-client";
import { DocumentNode } from "graphql";
import {
  MutationFunction,
  MutationResult,
  useMutation as useBaseMutation
} from "react-apollo";
import { useIntl } from "react-intl";

import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import useNotifier from "./useNotifier";

type UseMutation<TData, TVariables> = [
  MutationFunction<TData, TVariables>,
  MutationResult<TData>
];
type UseMutationCbs<TData> = Partial<{
  onCompleted: (data: TData) => void;
  onError: (error: ApolloError) => void;
}>;
type UseMutationHook<TData, TVariables> = (
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

    return [mutateFn, result];
  }

  return useMutation;
}

export default makeMutation;
