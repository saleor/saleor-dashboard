import { GraphQLError } from "graphql";
import { findValueInEnum } from "@saleor/misc";

export enum JWTError {
  invalid = "JSONWebTokenError",
  expired = "JSONWebTokenExpired"
}

export function isJwtError(error: GraphQLError): boolean {
  return !!findValueInEnum(error.extensions.exception.code, JWTError);
}

export function isTokenExpired(error: GraphQLError): boolean {
  return error.extensions.exception.code === JWTError.expired;
}
