import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import {
  getTransientRequestError,
  isJwtError,
  isSessionEndedError,
  isTokenExpired,
  isTransientRequestError,
  SessionEndedError,
} from "./errors";

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

describe("isTransientRequestError", () => {
  it.each<[string, unknown, boolean]>([
    [
      "a request that failed on the network",
      new ApolloError({ networkError: new TypeError("x") }),
      true,
    ],
    ["fetch failing while offline", new TypeError("Failed to fetch"), true],
    [
      "an API error",
      new ApolloError({ graphQLErrors: [new GraphQLError("Invalid token")] }),
      false,
    ],
    ["another error", new Error("Unexpected"), false],
  ])("treats %s as transient: %s", (_name, error, expected) => {
    // Arrange & Act
    const transient = isTransientRequestError(error);

    // Assert
    expect(transient).toBe(expected);
  });

  it("reports the network error behind a failed request", () => {
    // Arrange
    const networkError = new TypeError("Failed to fetch");

    // Act
    const reported = getTransientRequestError(new ApolloError({ networkError }));

    // Assert
    expect(reported).toBe(networkError);
  });
});

describe("isSessionEndedError", () => {
  it.each<[string, unknown, boolean]>([
    [
      "a dropped request as Apollo reports it",
      new ApolloError({ networkError: new SessionEndedError() }),
      true,
    ],
    ["the error itself", new SessionEndedError(), true],
    [
      "another network error",
      new ApolloError({ networkError: new TypeError("Failed to fetch") }),
      false,
    ],
  ])("recognises %s: %s", (_name, error, expected) => {
    // Arrange & Act
    const ended = isSessionEndedError(error);

    // Assert
    expect(ended).toBe(expected);
  });
});
