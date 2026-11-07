import { ApolloError } from "@apollo/client";
import { findValueInEnum } from "@dashboard/misc";
import { type GraphQLError } from "graphql";

import { UserContextError } from "./types";

enum JWTError {
  invalid = "InvalidTokenError",
  invalidSignature = "InvalidSignatureError",
  expired = "ExpiredSignatureError",
}

const AuthError = {
  PermissionDenied: "PermissionDenied",
  OAuthError: "OAuthError",
} as const;

type AuthError = (typeof AuthError)[keyof typeof AuthError];

/**
 * Exception body is not typed so we assert it. In previous graphql typings it was type "any", now its "unknown"
 */
type ExceptionWithCode = {
  code: string;
};

export function isJwtError(error: GraphQLError): boolean {
  let jwtError: boolean;

  try {
    jwtError = !!findValueInEnum(
      (error.extensions?.exception as ExceptionWithCode)?.code,
      JWTError,
    );
  } catch (e) {
    jwtError = false;
  }

  return jwtError;
}

export function isTokenExpired(error: GraphQLError): boolean {
  try {
    return (error.extensions?.exception as ExceptionWithCode)?.code === JWTError.expired;
  } catch (e) {
    return false;
  }
}

/**
 * A request that failed before the API answered it: no connection, a timeout, or an error status
 * such as 502 or 503. Unlike a refused token, it says nothing about whether the session is valid.
 */
export function isTransientRequestError(error: unknown): boolean {
  if (error instanceof ApolloError) {
    return !!error.networkError;
  }

  // `fetch` rejects with a TypeError when the network is unreachable.
  return error instanceof TypeError;
}

/** The network error behind a failed request, for reporting it as the request's own failure. */
export function getTransientRequestError(error: unknown): unknown {
  return error instanceof ApolloError && error.networkError ? error.networkError : error;
}

/**
 * A request dropped because the session it belonged to ended while it waited for a token refresh
 * (a logout, or another login). Nothing went wrong for the merchant, so it is not reported.
 */
export class SessionEndedError extends Error {
  constructor() {
    super("The session ended while the request was waiting for a token refresh");
    this.name = "SessionEndedError";
  }
}

export function isSessionEndedError(error: unknown): boolean {
  const cause = error instanceof ApolloError ? error.networkError : error;

  return cause instanceof Error && cause.name === "SessionEndedError";
}

function getAuthErrorType(graphQLError: GraphQLError): UserContextError {
  switch ((graphQLError.extensions?.exception as ExceptionWithCode)?.code as AuthError) {
    case AuthError.PermissionDenied:
      return UserContextError.noPermissionsError;
    case AuthError.OAuthError:
      return UserContextError.externalLoginError;
    default:
      return UserContextError.unknownLoginError;
  }
}

export function parseAuthError(authError: ApolloError): UserContextError[] {
  return authError?.graphQLErrors?.map(graphQLError => getAuthErrorType(graphQLError)) || [];
}
