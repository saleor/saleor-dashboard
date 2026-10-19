import { GraphQLError } from "graphql";

import { isJwtError, isTokenExpired } from "./errors";

const cases: Array<{
  name: string;
  extensions: GraphQLError["extensions"];
  jwtError: boolean;
  expired: boolean;
}> = [
  { name: "missing exception", extensions: {}, jwtError: false, expired: false },
  {
    name: "null exception",
    extensions: { exception: null },
    jwtError: false,
    expired: false,
  },
  {
    name: "missing code",
    extensions: { exception: {} },
    jwtError: false,
    expired: false,
  },
  {
    name: "unrelated error",
    extensions: { exception: { code: "PermissionDenied" } },
    jwtError: false,
    expired: false,
  },
  {
    name: "invalid token",
    extensions: { exception: { code: "InvalidTokenError" } },
    jwtError: true,
    expired: false,
  },
  {
    name: "invalid signature",
    extensions: { exception: { code: "InvalidSignatureError" } },
    jwtError: true,
    expired: false,
  },
  {
    name: "expired token",
    extensions: { exception: { code: "ExpiredSignatureError" } },
    jwtError: true,
    expired: true,
  },
];

describe("JWT error classification", () => {
  it.each(cases)("handles $name", ({ extensions, jwtError, expired }) => {
    // Arrange
    const error = new GraphQLError("Authentication failed", { extensions });

    // Act
    const actualJwtError = isJwtError(error);
    const actualExpired = isTokenExpired(error);

    // Assert
    expect(actualJwtError).toBe(jwtError);
    expect(actualExpired).toBe(expired);
  });
});
