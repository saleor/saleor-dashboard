import { ApolloError } from "@apollo/client";
import { findValueInEnum } from "@dashboard/misc";
import { GraphQLError } from "graphql";

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
    jwtError = !!findValueInEnum((error.extensions?.exception as ExceptionWithCode).code, JWTError);
  } catch (e) {
    jwtError = false;
  }

  return jwtError;
}

export function isTokenExpired(error: GraphQLError): boolean {
  try {
    return (error.extensions?.exception as ExceptionWithCode).code === JWTError.expired;
  } catch (e) {
    return false;
  }
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
