import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import { createFailedQueryRecovery } from "./failedQueryRecovery";

interface FakeQuery {
  result: { error?: unknown; loading: boolean };
  getCurrentResult: () => { error?: unknown; loading: boolean };
  getLastError: () => unknown;
  refetch: jest.Mock<Promise<unknown>, []>;
}

interface FakeClient {
  getObservableQueries: () => Map<string, FakeQuery>;
}

const unreachable = (): ApolloError =>
  new ApolloError({ networkError: new TypeError("Failed to fetch") });

const query = (result: FakeQuery["result"]): FakeQuery => {
  const fake: FakeQuery = {
    result,
    getCurrentResult: () => fake.result,
    getLastError: () => undefined,
    refetch: jest.fn(() => Promise.resolve({})),
  };

  return fake;
};

const clientWith = (...queries: FakeQuery[]): FakeClient => ({
  getObservableQueries: () => new Map(queries.map((item, index) => [String(index), item])),
});

describe("reloadFailedQueries", () => {
  it("reloads only the open queries that couldn't reach Saleor", () => {
    // Arrange
    const failed = query({ error: unreachable(), loading: false });
    const refused = query({
      error: new ApolloError({ graphQLErrors: [new GraphQLError("Not allowed")] }),
      loading: false,
    });
    const loaded = query({ loading: false });
    const { reloadFailedQueries } = createFailedQueryRecovery();

    // Act
    reloadFailedQueries(clientWith(failed, refused, loaded), { afterOutage: true });

    // Assert
    expect(failed.refetch).toHaveBeenCalledTimes(1);
    expect(refused.refetch).not.toHaveBeenCalled();
    expect(loaded.refetch).not.toHaveBeenCalled();
  });

  it("leaves a query alone while it loads, since the answer that ended the outage may be its own", () => {
    // Arrange
    const reloading = query({ error: unreachable(), loading: true });
    const { reloadFailedQueries } = createFailedQueryRecovery();

    // Act
    reloadFailedQueries(clientWith(reloading), { afterOutage: true });

    // Assert
    expect(reloading.refetch).not.toHaveBeenCalled();
  });

  it("retries a query once after a single failed request, then counts it as failing once", () => {
    // Arrange
    const slow = query({ error: unreachable(), loading: false });
    const client = clientWith(slow);
    const { reloadFailedQueries } = createFailedQueryRecovery();

    // Act
    const counts = [1, 2, 3].map(() => reloadFailedQueries(client, { afterOutage: false }));

    // Assert
    expect(slow.refetch).toHaveBeenCalledTimes(1);
    expect(counts).toEqual([0, 1, 0]);
  });

  it("retries such a query again once a real outage ends", () => {
    // Arrange
    const slow = query({ error: unreachable(), loading: false });
    const client = clientWith(slow);
    const { reloadFailedQueries } = createFailedQueryRecovery();

    reloadFailedQueries(client, { afterOutage: false });
    reloadFailedQueries(client, { afterOutage: false });

    // Act
    reloadFailedQueries(client, { afterOutage: true });

    // Assert
    expect(slow.refetch).toHaveBeenCalledTimes(2);
  });

  it("gives a query its retry back once it has loaded", () => {
    // Arrange
    const flaky = query({ error: unreachable(), loading: false });
    const client = clientWith(flaky);
    const { reloadFailedQueries } = createFailedQueryRecovery();

    reloadFailedQueries(client, { afterOutage: false });
    flaky.result = { loading: false };
    reloadFailedQueries(client, { afterOutage: false });

    // Act
    flaky.result = { error: unreachable(), loading: false };
    reloadFailedQueries(client, { afterOutage: false });

    // Assert
    expect(flaky.refetch).toHaveBeenCalledTimes(2);
  });
});
