import {
  ApolloClient,
  ApolloLink,
  type FetchResult,
  InMemoryCache,
  type NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import { type UserFragment } from "@dashboard/graphql";

import { auth } from "./authSdk";
import { authStateVar, resetAuthState, setAuthState } from "./authState";
import { createStorage, storage } from "./tokenStorage";

type PendingExchange = {
  name: string;
  resolve: (result: FetchResult) => void;
};

const user: UserFragment = {
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
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

describe("refresh session boundaries with a real Apollo cache", () => {
  let pending: PendingExchange[];
  let client: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    // Arrange
    pending = [];
    resetAuthState();
    setAuthState({ authenticated: true, isStaff: true });
    createStorage(false);
    storage.setTokens({ accessToken: "old-access", refreshToken: "old-refresh" });
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new ApolloLink(
        operation =>
          new Observable(observer => {
            pending.push({
              name: operation.operationName,
              resolve: result => {
                observer.next(result);
                observer.complete();
              },
            });
          }),
      ),
    });
  });

  afterEach(() => {
    client.stop();
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
      expect(authStateVar().authenticated).toBe(false);
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
      expect(authStateVar().authenticated).toBe(false);
    },
  );
});
