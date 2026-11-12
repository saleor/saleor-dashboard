import { type ApolloError, type FetchResult } from "@apollo/client";
import { isConnectionError } from "@dashboard/connection/connectionErrors";
import { getServerErrorProblem } from "@dashboard/connection/serverErrors";
import { CommonErrorCode } from "@dashboard/utils/errors/common";

export interface VoucherSaveError {
  field: string | null;
  code: string;
  message?: string | null;
  /**
   * The request got no answer, a server error or an answer that couldn't be read, so the change
   * may have been saved anyway. Trying again could save it twice.
   */
  outcomeUnknown?: boolean;
}

/**
 * What a mutation resolves with. Mutation hooks with an `onError` handler, which all dashboard
 * mutations have, resolve a failed request with the ApolloError in `errors`.
 */
export type MutationOutcome<TData> = FetchResult<TData> | { data?: null; errors: ApolloError };

const getRequestErrorMessages = (
  errors: MutationOutcome<unknown>["errors"],
): Array<string | null> => {
  if (!errors) {
    return [null];
  }

  if ("graphQLErrors" in errors) {
    return errors.graphQLErrors.length > 0
      ? errors.graphQLErrors.map(error => error.message)
      : [errors.message];
  }

  return errors.length > 0 ? errors.map(error => error.message) : [null];
};

/**
 * Whether a request that failed as a whole may still have been saved: it got no answer, a server
 * error, or an answer that isn't JSON. A request refused with a 4xx, or rejected by the API with
 * GraphQL errors, wasn't.
 */
const isOutcomeUnknown = (errors: MutationOutcome<unknown>["errors"]): boolean => {
  if (!errors || !("graphQLErrors" in errors) || !errors.networkError) {
    return false;
  }

  if (isConnectionError(errors)) {
    return true;
  }

  const problem = getServerErrorProblem(errors);

  return problem !== null && problem.kind !== "refused";
};

/**
 * The errors of one voucher save request. A request that fails as a whole (rejected input, a
 * server or network error) has no payload; it counts as failed rather than as a save without
 * errors.
 */
export const getVoucherSaveRequestErrors = <TData>(
  result: MutationOutcome<TData>,
  getPayloadErrors: (data: TData) => VoucherSaveError[] | null | undefined,
): VoucherSaveError[] => {
  const payloadErrors = result.data ? getPayloadErrors(result.data) : null;
  // An ApolloError always means a failed request; an errors array only when it isn't empty.
  const hasRequestErrors =
    !!result.errors && ("graphQLErrors" in result.errors || result.errors.length > 0);

  if (!hasRequestErrors && payloadErrors) {
    return payloadErrors;
  }

  const outcomeUnknown = isOutcomeUnknown(result.errors);

  return getRequestErrorMessages(result.errors).map(message => ({
    field: null,
    code: CommonErrorCode.GRAPHQL_ERROR,
    message,
    ...(outcomeUnknown && { outcomeUnknown }),
  }));
};
