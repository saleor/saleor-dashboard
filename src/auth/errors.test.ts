import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import {
  getTransientRequestError,
  isJwtError,
  isTokenExpired,
  isTransientRequestError,
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

/** What Apollo's HTTP link rejects with for an error status. */
const serverError = (statusCode: number): Error & { statusCode: number } =>
  Object.assign(new Error("Response not successful"), { name: "ServerError", statusCode });

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
    ["a 500", new ApolloError({ networkError: serverError(500) }), true],
    ["a 503 from a proxy", new ApolloError({ networkError: serverError(503) }), true],
    ["a timeout status (408)", new ApolloError({ networkError: serverError(408) }), true],
    ["a rate limit (429)", new ApolloError({ networkError: serverError(429) }), true],
    ["a rejected request (400)", new ApolloError({ networkError: serverError(400) }), false],
    ["a gateway refusing access (403)", new ApolloError({ networkError: serverError(403) }), false],
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

  it("reports a refresh's error status without the refresh's own body", () => {
    // Arrange
    const networkError = Object.assign(serverError(500), {
      result: { data: { tokenRefresh: null }, errors: [{ message: "Internal error" }] },
    });

    // Act
    const reported = getTransientRequestError(new ApolloError({ networkError }));

    // Assert
    expect(reported).toBeInstanceOf(Error);
    expect(reported).toMatchObject({ message: "Response not successful", statusCode: 500 });
    expect(reported).not.toHaveProperty("result");
    expect(networkError).toHaveProperty("result");
  });
});
