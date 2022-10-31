import { ApolloError } from "@apollo/client";
import { findValueInEnum } from "@saleor/misc";
import { GraphQLError } from "graphql";

import { UserContextError } from "./types";

export enum JWTError {
  invalid = "InvalidTokenError",
  invalidSignature = "InvalidSignatureError",
  expired = "ExpiredSignatureError",
}

export function isJwtError(error: GraphQLError): boolean {
  let jwtError: boolean;
  try {
    jwtError = !!findValueInEnum(error.extensions.exception.code, JWTError);
  } catch (e) {
    jwtError = false;
  }

  return jwtError;
}

export function isTokenExpired(error: GraphQLError): boolean {
  return error.extensions.exception.code === JWTError.expired;
}

export function getAuthErrorType(graphQLError: GraphQLError): UserContextError {
  switch (graphQLError.extensions?.exception?.code) {
    case "PermissionDenied":
      return "noPermissionsError";
    case "OAuthError":
      return "externalLoginError";
    default:
      return "unknownLoginError";
  }
}

export function parseAuthError(authError: ApolloError): UserContextError[] {
  return (
    authError?.graphQLErrors?.map(graphQLError =>
      getAuthErrorType(graphQLError),
    ) || []
  );
}
