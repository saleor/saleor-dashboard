import { isJwtError } from "@saleor/auth/errors";
import { commonMessages } from "@saleor/intl";
import { getMutationStatus, maybe } from "@saleor/misc";
import { MutationResultAdditionalProps } from "@saleor/types";
import { ApolloError } from "apollo-client";
import { DocumentNode } from "graphql";
import {
  MutationFunction,
  MutationResult,
  useMutation as useBaseMutation
} from "react-apollo";
import { useIntl } from "react-intl";

import useNotifier from "./useNotifier";
import useUser from "./useUser";

export type UseMutation<TData, TVariables> = [
  MutationFunction<TData, TVariables>,
  MutationResult<TData> & MutationResultAdditionalProps
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
    const user = useUser();

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
            status: "error",
            text: intl.formatMessage(commonMessages.readOnly)
          });
        } else if (err.graphQLErrors.some(isJwtError)) {
          user.logout();
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.sessionExpired)
          });
        } else {
          notify({
            status: "error",
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
        status: getMutationStatus(result)
      }
    ];
  }

  return useMutation;
}

export default makeMutation;
