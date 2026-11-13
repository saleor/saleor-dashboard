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

/** A request that got no answer in time. The API may still answer it later. */
export class RequestTimeoutError extends Error {
  constructor() {
    super("The request got no answer in time");
    this.name = "RequestTimeoutError";
  }
}

const getStatusCode = (networkError: unknown): number | undefined => {
  const statusCode = (networkError as { statusCode?: unknown } | null)?.statusCode;

  return typeof statusCode === "number" ? statusCode : undefined;
};

/** A client error the API, or a gateway in front of it, gave as its answer. Trying again won't change it. */
const isFinalClientError = (statusCode: number | undefined): boolean =>
  statusCode !== undefined &&
  statusCode >= 400 &&
  statusCode < 500 &&
  statusCode !== 408 &&
  statusCode !== 429;

/**
 * A request that failed before the API answered it: no connection, a timeout, or an error status
 * such as 500, 502 or 503. Unlike a refused token, it says nothing about whether the session is
 * valid. A 4xx status (other than a timeout or rate limit) is an answer, so it doesn't count.
 */
export function isTransientRequestError(error: unknown): boolean {
  if (error instanceof ApolloError) {
    return !!error.networkError && !isFinalClientError(getStatusCode(error.networkError));
  }

  // `fetch` rejects with a TypeError when the network is unreachable.
  return error instanceof TypeError || error instanceof RequestTimeoutError;
}

/**
 * The network error behind a failed request, for reporting it as the request's own failure. The
 * body it may carry is the refresh's, not the request's, so it's left out: Apollo would otherwise
 * hand it on as the request's own result.
 */
export function getTransientRequestError(error: unknown): unknown {
  const networkError =
    error instanceof ApolloError && error.networkError ? error.networkError : error;

  if (typeof networkError !== "object" || networkError === null || !("result" in networkError)) {
    return networkError;
  }

  const copy = Object.create(Object.getPrototypeOf(networkError));

  Object.defineProperties(copy, Object.getOwnPropertyDescriptors(networkError));
  delete copy.result;

  return copy;
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

/**
 * The API refused the session's refresh token while a request waited to renew it, and the SDK
 * logged out. Reported as an expired session, like the expired-token response a request gets when
 * its own refresh is refused.
 */
export class SessionExpiredError extends Error {
  constructor() {
    super("The session expired while the request was waiting for a token refresh");
    this.name = "SessionExpiredError";
  }
}

export function isSessionExpiredError(error: unknown): boolean {
  const cause = error instanceof ApolloError ? error.networkError : error;

  return cause instanceof Error && cause.name === "SessionExpiredError";
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
