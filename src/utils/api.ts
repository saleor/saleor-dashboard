import { ApolloError } from "apollo-client";

export function hasError(err: ApolloError, ...errorCodes: string[]): boolean {
  return err.graphQLErrors.some(gqlError =>
    errorCodes.includes(gqlError.extensions.exception.code)
  );
}
