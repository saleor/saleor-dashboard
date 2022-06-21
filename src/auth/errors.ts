import { findValueInEnum } from "@saleor/misc";
import { GraphQLError } from "graphql";

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
