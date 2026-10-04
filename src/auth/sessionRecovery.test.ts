import {
  ApolloClient,
  ApolloLink,
  type FetchResult,
  InMemoryCache,
  type NormalizedCacheObject,
  Observable,
} from "@apollo/client";

import { auth } from "./authSdk";
import { authStateVar } from "./authState";
import { initAuth } from "./initAuth";
import { advanceSession } from "./sessionRefresh";
import { createStorage, storage } from "./tokenStorage";

type PendingExchange = {
  name: string;
  resolve: (result: FetchResult) => void;
  reject: (error: Error) => void;
};

const user = {
  __typename: "User",
  id: "old-user",
  email: "staff@example.com",
  firstName: "Test",
  lastName: "Staff",
  isStaff: true,
  isActive: true,
  dateJoined: "2026-01-01",
  userPermissions: [],
  metadata: [],
  addresses: [],
  defaultShippingAddress: null,
  defaultBillingAddress: null,
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

describe("refresh session recovery with a real Apollo cache", () => {
  let pending: PendingExchange[];
  let client: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    // Arrange
    pending = [];
    createStorage(false);
    storage.setTokens({ accessToken: "old-access", refreshToken: "old-refresh" });
    client = new ApolloClient({
      cache: new InMemoryCache({ typePolicies: { User: { keyFields: [] } } }),
      link: new ApolloLink(
        operation =>
          new Observable(observer => {
            pending.push({
              name: operation.operationName,
              resolve: result => {
                observer.next(result);
                observer.complete();
              },
              reject: error => observer.error(error),
            });
          }),
      ),
    });
  });

  afterEach(() => {
    client.stop();
    jest.useRealTimers();
  });

  it.each([false, true])(
    "does not resurrect a logged-out session (external=%s)",
    async external => {
      // Arrange
      const sdk = auth({ apolloClient: client });
      const otherSdk = auth({ apolloClient: client });
      const flight = external ? sdk.refreshExternalToken(true) : sdk.refreshToken(true);
      const field = external ? "externalRefresh" : "tokenRefresh";

      // Act
      await otherSdk.logout();
      pending[0].resolve({
        data: {
          [field]: {
            __typename: external ? "ExternalRefresh" : "RefreshToken",
            token: "late-access",
            refreshToken: "late-refresh",
            user,
            errors: [],
          },
        },
      });
      await flight;

      // Assert
      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(JSON.stringify(client.cache.extract())).not.toContain("old-user");
    },
  );

  it.each([false, true])(
    "does not overwrite tokens or user after a new login (external=%s)",
    async external => {
      // Arrange
      const sdk = auth({ apolloClient: client });
      const flight = external ? sdk.refreshExternalToken(true) : sdk.refreshToken(true);
      const field = external ? "externalRefresh" : "tokenRefresh";

      // Act
      const login = auth({ apolloClient: client }).login({
        email: "new@example.com",
        password: "test-only",
      });

      pending[1].resolve({
        data: {
          tokenCreate: {
            __typename: "CreateToken",
            token: "new-access",
            refreshToken: "new-refresh",
            user: { ...user, id: "new-user" },
            errors: [],
          },
        },
      });
      await login;
      pending[0].resolve({
        data: {
          [field]: {
            __typename: external ? "ExternalRefresh" : "RefreshToken",
            token: "late-access",
            refreshToken: "late-refresh",
            user,
            errors: [],
          },
        },
      });
      await flight;

      // Assert
      expect(storage.getAccessToken()).toBe("new-access");
      expect(storage.getRefreshToken()).toBe("new-refresh");
      expect(JSON.stringify(client.cache.extract())).not.toContain("old-user");
      expect(JSON.stringify(client.cache.extract())).toContain("new-user");
    },
  );

  it.each([false, true])(
    "does not let an old refusal log out a new login (external=%s)",
    async external => {
      // Arrange
      const sdk = auth({ apolloClient: client });
      const flight = external ? sdk.refreshExternalToken() : sdk.refreshToken();
      const field = external ? "externalRefresh" : "tokenRefresh";

      // Act
      advanceSession();
      storage.setTokens({ accessToken: "new-access", refreshToken: "new-refresh" });
      pending[0].resolve({
        data: {
          [field]: {
            token: null,
            refreshToken: null,
            errors: [{ code: "JWT_INVALID_TOKEN", field: "refreshToken", message: "revoked" }],
          },
        },
      });
      await flight;

      // Assert
      expect(storage.getAccessToken()).toBe("new-access");
      expect(storage.getRefreshToken()).toBe("new-refresh");
    },
  );

  it.each([false, true])(
    "clears a session on an explicit token refusal (external=%s)",
    async external => {
      // Arrange
      const sdk = auth({ apolloClient: client });
      const flight = external ? sdk.refreshExternalToken() : sdk.refreshToken();
      const field = external ? "externalRefresh" : "tokenRefresh";

      // Act
      pending[0].resolve({
        data: {
          [field]: {
            token: null,
            refreshToken: null,
            errors: [{ code: "JWT_INVALID_TOKEN", field: "refreshToken", message: "revoked" }],
          },
        },
      });
      await flight;

      // Assert
      expect(storage.getRefreshToken()).toBeNull();
      expect(storage.getAccessToken()).toBeNull();
      expect(pending).toHaveLength(1);
    },
  );

  it("retries a network outage at most three times without clearing storage", async () => {
    // Arrange
    jest.useFakeTimers();

    const flight = auth({ apolloClient: client }).refreshToken();
    const rejection = expect(flight).rejects.toThrow("offline");

    // Act
    for (let attempt = 0; attempt < 3; attempt += 1) {
      pending[attempt].reject(new TypeError("offline"));
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
    expect(pending).toHaveLength(3);
    expect(storage.getRefreshToken()).toBe("old-refresh");
  });

  it("recovers after a temporary network outage", async () => {
    // Arrange
    jest.useFakeTimers();

    const flight = auth({ apolloClient: client }).refreshToken();

    // Act
    pending[0].reject(new TypeError("offline"));
    for (let tick = 0; tick < 10; tick += 1) {
      await Promise.resolve();
    }
    jest.runOnlyPendingTimers();
    for (let tick = 0; tick < 10; tick += 1) {
      await Promise.resolve();
    }
    pending[1].resolve({ data: { tokenRefresh: { token: "recovered-access", errors: [] } } });
    await flight;

    // Assert
    expect(storage.getAccessToken()).toBe("recovered-access");
    expect(storage.getRefreshToken()).toBe("old-refresh");
  });
  it("handles boot-time offline recovery and settles authenticating after three attempts", async () => {
    // Arrange
    jest.useFakeTimers();

    const refresh =
      "header." + btoa(JSON.stringify({ owner: "saleor", exp: 9999999999 })) + ".signature";

    storage.setRefreshToken(refresh);

    // Act
    initAuth(client);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      pending[attempt].reject(new TypeError("offline"));
      for (let tick = 0; tick < 20; tick += 1) {
        await Promise.resolve();
      }
      jest.runOnlyPendingTimers();
      for (let tick = 0; tick < 20; tick += 1) {
        await Promise.resolve();
      }
    }

    // Assert
    expect(pending).toHaveLength(3);
    expect(storage.getRefreshToken()).toBe(refresh);
    expect(authStateVar().authenticating).toBe(false);
  });
  it("does not finish boot recovery over a newer pending login", async () => {
    // Arrange
    storage.setRefreshToken("header." + btoa(JSON.stringify({ owner: "saleor" })) + ".signature");
    initAuth(client);

    // Act
    const login = auth({ apolloClient: client }).login({
      email: "new@example.com",
      password: "test-only",
    });

    pending[0].resolve({ data: { tokenRefresh: { token: "late-access", user, errors: [] } } });
    for (let tick = 0; tick < 30; tick += 1) {
      await Promise.resolve();
    }

    // Assert
    expect(authStateVar().authenticating).toBe(true);
    expect(storage.getAccessToken()).toBeNull();
    pending[1].resolve({
      data: {
        tokenCreate: {
          token: "new-access",
          refreshToken: "new-refresh",
          user: { ...user, id: "new-user" },
          errors: [],
        },
      },
    });
    await login;
    expect(storage.getAccessToken()).toBe("new-access");
  });

  it("discards a malformed stored refresh token without a network request", async () => {
    // Arrange
    storage.setRefreshToken("not-a-jwt");

    // Act
    initAuth(client);
    for (let tick = 0; tick < 30; tick += 1) {
      await Promise.resolve();
    }

    // Assert
    expect(pending).toHaveLength(0);
    expect(storage.getRefreshToken()).toBeNull();
  });
});
