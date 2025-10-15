import { ApolloError } from "@apollo/client";

export enum GqlErrors {
  LimitReachedException = "LimitReachedException",
  ReadOnlyException = "ReadOnlyException",
}
// Graphql 16 doesn't type exception as record of "any" but unknown, so we need to cast it
type ExceptionWithCode = {
  code: string;
};

export function hasError(err: ApolloError, ...errorCodes: string[]): boolean {
  return err.graphQLErrors.some(gqlError =>
    errorCodes.includes((gqlError.extensions?.exception as ExceptionWithCode)?.code),
  );
}
