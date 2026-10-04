import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import {
  advanceSession,
  getSessionVersion,
  isRefreshTokenRejected,
  retryRefresh,
} from "./sessionRefresh";

describe("refresh retry policy", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([429, 500, 502, 503])(
    "retries a temporary HTTP %s without an unbounded loop",
    async statusCode => {
      // Arrange
      const run = jest.fn().mockRejectedValue(
        new ApolloError({
          networkError: Object.assign(new Error("unavailable"), { statusCode }),
        }),
      );
      const flight = retryRefresh({ run, version: getSessionVersion() });
      const rejection = expect(flight).rejects.toThrow("unavailable");

      // Act
      for (let attempt = 0; attempt < 3; attempt += 1) {
        for (let tick = 0; tick < 10; tick += 1) {
          await Promise.resolve();
        }
        jest.runOnlyPendingTimers();
        for (let tick = 0; tick < 10; tick += 1) {
          await Promise.resolve();
        }
      }
      await rejection;

      // Assert
      expect(run).toHaveBeenCalledTimes(3);
    },
  );

  it.each([400, 401, 403])("does not retry HTTP %s", async statusCode => {
    // Arrange
    const run = jest
      .fn()
      .mockRejectedValue(
        new ApolloError({ networkError: Object.assign(new Error("rejected"), { statusCode }) }),
      );

    // Act
    await expect(retryRefresh({ run, version: getSessionVersion() })).rejects.toThrow("rejected");

    // Assert
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not retry GraphQL validation errors", async () => {
    // Arrange
    const run = jest
      .fn()
      .mockRejectedValue(
        new ApolloError({ graphQLErrors: [new GraphQLError("invalid operation")] }),
      );

    // Act
    await expect(retryRefresh({ run, version: getSessionVersion() })).rejects.toThrow(
      "invalid operation",
    );

    // Assert
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("cancels a pending retry when the session changes", async () => {
    // Arrange
    const run = jest.fn().mockRejectedValue(new TypeError("offline"));
    const flight = retryRefresh({ run, version: getSessionVersion() });
    const rejection = expect(flight).rejects.toThrow("session changed");

    await Promise.resolve();

    // Act
    advanceSession();
    jest.runOnlyPendingTimers();
    await rejection;

    // Assert
    expect(run).toHaveBeenCalledTimes(1);
  });

  it.each([
    "JWT_INVALID_TOKEN",
    "JWT_SIGNATURE_EXPIRED",
    "JWT_DECODE_ERROR",
    "INACTIVE",
    "INVALID_CREDENTIALS",
  ])("recognizes the explicit refusal %s", code => {
    // Arrange
    const errors = [{ code, field: "refreshToken" }];
    // Act
    const rejected = isRefreshTokenRejected(errors);

    // Assert
    expect(rejected).toBe(true);
  });

  it.each(["GRAPHQL_ERROR", "DISABLED_AUTHENTICATION_METHOD", "UNKNOWN_IP_ADDRESS"])(
    "does not mistake %s for token revocation",
    code => {
      // Arrange
      const errors = [{ code }];
      // Act
      const rejected = isRefreshTokenRejected(errors);

      // Assert
      expect(rejected).toBe(false);
    },
  );
});
