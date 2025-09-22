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

export function isJwtError(error: GraphQLError): boolean {
  let jwtError: boolean;

  try {
    jwtError = !!findValueInEnum(error.extensions?.exception.code, JWTError);
  } catch (e) {
    jwtError = false;
  }

  return jwtError;
}

export function isTokenExpired(error: GraphQLError): boolean {
  return error.extensions?.exception.code === JWTError.expired;
}

function getAuthErrorType(graphQLError: GraphQLError): UserContextError {
  switch (graphQLError.extensions?.exception?.code as AuthError) {
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
