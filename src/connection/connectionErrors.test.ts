import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import { getConnectionFailure, getResponseConnectionFailure } from "./connectionErrors";

interface FakeResponse {
  status: number;
  headers: { get: (name: string) => string | null };
}

const response = (status: number, headers: Record<string, string> = {}): FakeResponse => ({
  status,
  headers: { get: name => headers[name] ?? null },
});

/** What Apollo throws when the body isn't JSON, such as a proxy's HTML error page. */
const parseError = (status: number, headers: Record<string, string> = {}): Error =>
  Object.assign(new SyntaxError("Unexpected token '<'"), {
    name: "ServerParseError",
    statusCode: status,
    response: response(status, headers),
  });

describe("getConnectionFailure", () => {
  it("treats a request with no response as a connection failure, in each browser's words", () => {
    // Arrange
    const errors = [
      new ApolloError({ networkError: new TypeError("Failed to fetch") }),
      new TypeError("NetworkError when attempting to fetch resource."),
      new TypeError("Load failed"),
    ];

    // Act
    const failures = errors.map(getConnectionFailure);

    // Assert
    expect(failures).toEqual([
      { httpStatus: 0, retryAfterMs: null },
      { httpStatus: 0, retryAfterMs: null },
      { httpStatus: 0, retryAfterMs: null },
    ]);
  });

  it("treats a proxy's 502, 503 or 504 page as a connection failure, with its Retry-After", () => {
    // Arrange
    const errors = [parseError(502), parseError(503, { "Retry-After": "30" }), parseError(504)];

    // Act
    const failures = errors.map(getConnectionFailure);

    // Assert
    expect(failures).toEqual([
      { httpStatus: 502, retryAfterMs: null },
      { httpStatus: 503, retryAfterMs: 30_000 },
      { httpStatus: 504, retryAfterMs: null },
    ]);
  });

  it("doesn't treat answers from a running Saleor as connection failures", () => {
    // Arrange
    const errors = [
      new ApolloError({ networkError: parseError(500) }),
      new ApolloError({ graphQLErrors: [new GraphQLError("Permission denied")] }),
      new DOMException("The operation was aborted", "AbortError"),
      new Error("Something else"),
      new TypeError("Cannot read properties of undefined (reading 'token')"),
    ];

    // Act
    const failures = errors.map(getConnectionFailure);

    // Assert
    expect(failures).toEqual([null, null, null, null, null]);
  });
});

describe("getResponseConnectionFailure", () => {
  it("reads Retry-After given as a date", () => {
    // Arrange
    const now = Date.parse("2026-11-07T12:00:00Z");
    const answer = response(503, { "Retry-After": "Sat, 07 Nov 2026 12:01:30 GMT" });

    // Act
    const failure = getResponseConnectionFailure(answer, now);

    // Assert
    expect(failure).toEqual({ httpStatus: 503, retryAfterMs: 90_000 });
  });

  it("treats any other status as an answer", () => {
    // Arrange
    const answers = [200, 400, 401, 500].map(status => response(status));

    // Act
    const failures = answers.map(answer => getResponseConnectionFailure(answer));

    // Assert
    expect(failures).toEqual([null, null, null, null]);
  });
});
