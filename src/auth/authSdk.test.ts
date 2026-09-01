import {
  ExternalAuthenticationUrlDocument as EXTERNAL_AUTHENTICATION_URL,
  ExternalLogoutDocument as EXTERNAL_LOGOUT,
  ExternalObtainAccessTokensDocument as OBTAIN_EXTERNAL_ACCESS_TOKEN,
  ExternalRefreshDocument as EXTERNAL_REFRESH,
  ExternalRefreshWithUserDocument as EXTERNAL_REFRESH_WITH_USER,
  LoginDocument as LOGIN,
  RefreshTokenDocument as REFRESH_TOKEN,
  RefreshTokenWithUserDocument as REFRESH_TOKEN_WITH_USER,
  SetPasswordDocument as SET_PASSWORD,
} from "@dashboard/graphql";

import { auth, type AuthSDK } from "./authSdk";
import { authStateVar, resetAuthState } from "./authState";
import { storage } from "./tokenStorage";

jest.mock("./tokenStorage", () => ({
  storage: {
    setTokens: jest.fn(),
    setAccessToken: jest.fn(),
    setAuthPluginId: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    getAuthPluginId: jest.fn(),
    clear: jest.fn(),
  },
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

const createMockClient = () => ({
  mutate: jest.fn(),
  clearStore: jest.fn(),
});

// `update` callbacks seed `ROOT_QUERY.me`; only `writeQuery` is exercised.
const mockCache: any = { writeQuery: jest.fn() };

type MockClient = ReturnType<typeof createMockClient>;

describe("auth", () => {
  let client: MockClient;
  let sdk: AuthSDK;

  beforeEach(() => {
    jest.clearAllMocks();
    resetAuthState();
    client = createMockClient();
    sdk = auth({ apolloClient: client as any });
  });

  describe("login", () => {
    it("should mark the session as authenticating and call the LOGIN mutation", async () => {
      // Arrange
      const mutationResult = {
        data: {
          tokenCreate: {
            token: "access-token",
            refreshToken: "refresh-token",
            user: { id: "1", isStaff: true },
            errors: [],
          },
        },
      };

      client.mutate.mockResolvedValue(mutationResult);

      // Act
      await sdk.login({ email: "test@example.com", password: "password123" });

      // Assert
      expect(authStateVar().authenticating).toBe(true);
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: LOGIN,
          variables: { email: "test@example.com", password: "password123" },
        }),
      );
    });

    it("should store tokens via update callback when login succeeds", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          tokenCreate: {
            token: "access-token",
            refreshToken: "refresh-token",
            user: { id: "1", isStaff: true },
            errors: [],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.login({ email: "test@example.com", password: "password123" });

      // Assert
      expect(mockedStorage.setTokens).toHaveBeenCalledWith({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      expect(authStateVar()).toEqual({
        authenticated: true,
        authenticating: false,
        isStaff: true,
      });
    });

    it("should stop authenticating via update callback when login fails (no token)", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          tokenCreate: {
            token: null,
            refreshToken: null,
            errors: [{ field: "email", message: "Invalid credentials" }],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.login({ email: "test@example.com", password: "wrong" });

      // Assert
      expect(mockedStorage.setTokens).not.toHaveBeenCalled();
      expect(authStateVar()).toEqual({
        authenticated: false,
        authenticating: false,
        isStaff: false,
      });
    });
  });

  describe("logout", () => {
    it("should clear storage, reset the session state, and clear the store", async () => {
      // Arrange
      mockedStorage.getAuthPluginId.mockReturnValue(null);

      // Act
      const result = await sdk.logout();

      // Assert
      expect(mockedStorage.clear).toHaveBeenCalled();
      expect(authStateVar()).toEqual({
        authenticated: false,
        authenticating: false,
        isStaff: false,
      });
      expect(client.clearStore).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should call EXTERNAL_LOGOUT mutation when authPluginId exists and input is provided", async () => {
      // Arrange
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");

      const externalLogoutResult = {
        data: {
          externalLogout: { logoutData: "https://logout-url.com", errors: [] },
        },
      };

      client.mutate.mockResolvedValue(externalLogoutResult);

      // Act
      const result = await sdk.logout({
        input: JSON.stringify({ returnTo: "https://example.com" }),
      });

      // Assert
      expect(client.mutate).toHaveBeenCalledWith({
        mutation: EXTERNAL_LOGOUT,
        variables: {
          input: JSON.stringify({ returnTo: "https://example.com" }),
          pluginId: "my-plugin",
        },
      });
      expect(result).toEqual(externalLogoutResult);
    });

    it("should return null when authPluginId exists but no input is provided", async () => {
      // Arrange
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");

      // Act
      const result = await sdk.logout();

      // Assert
      expect(client.mutate).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("refreshToken", () => {
    it("should throw if no refresh token is present in storage", () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue(null);

      // Act & Assert
      expect(() => sdk.refreshToken()).toThrow("refreshToken not present");
    });

    it("should call REFRESH_TOKEN mutation by default (includeUser=false)", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("my-refresh-token");
      client.mutate.mockResolvedValue({
        data: { tokenRefresh: { token: "new-access-token", errors: [] } },
      });

      // Act
      await sdk.refreshToken();

      // Assert
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: REFRESH_TOKEN,
          variables: { refreshToken: "my-refresh-token" },
        }),
      );
    });

    it("should call REFRESH_TOKEN_WITH_USER mutation when includeUser=true", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("my-refresh-token");
      client.mutate.mockResolvedValue({
        data: { tokenRefresh: { token: "new-access-token", errors: [] } },
      });

      // Act
      await sdk.refreshToken(true);

      // Assert
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: REFRESH_TOKEN_WITH_USER,
          variables: { refreshToken: "my-refresh-token" },
        }),
      );
    });

    it("should set access token via update callback on success", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("my-refresh-token");
      client.mutate.mockImplementation(async (opts: any) => {
        const data = { tokenRefresh: { token: "new-access-token", errors: [] } };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshToken();

      // Assert
      expect(mockedStorage.setAccessToken).toHaveBeenCalledWith("new-access-token");
    });

    it("should call logout via update callback when token refresh fails", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("my-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue(null);
      client.mutate.mockImplementation(async (opts: any) => {
        const data = { tokenRefresh: { token: null, errors: [{ message: "expired" }] } };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshToken();

      // Assert
      // logout clears storage and resets store
      expect(mockedStorage.clear).toHaveBeenCalled();
      expect(client.clearStore).toHaveBeenCalled();
    });

    it("should set access token via update callback on success with includeUser=true", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("my-refresh-token");
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          tokenRefresh: { token: "new-token-with-user", user: { id: "1" }, errors: [] },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshToken(true);

      // Assert
      expect(mockedStorage.setAccessToken).toHaveBeenCalledWith("new-token-with-user");
    });
  });

  describe("setPassword", () => {
    it("should call SET_PASSWORD mutation with correct variables", async () => {
      // Arrange
      client.mutate.mockResolvedValue({
        data: { setPassword: { token: "tok", refreshToken: "ref", errors: [] } },
      });

      // Act
      await sdk.setPassword({
        token: "reset-token",
        email: "test@example.com",
        password: "newPass",
      });

      // Assert
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: SET_PASSWORD,
          variables: {
            token: "reset-token",
            email: "test@example.com",
            password: "newPass",
          },
        }),
      );
    });

    it("should store tokens via update callback on success", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          setPassword: {
            token: "new-access",
            refreshToken: "new-refresh",
            user: { id: "1" },
            errors: [],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.setPassword({
        token: "reset-token",
        email: "test@example.com",
        password: "newPass",
      });

      // Assert
      expect(mockedStorage.setTokens).toHaveBeenCalledWith({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });
    });

    it("should not store tokens via update callback when setPassword has no token", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          setPassword: {
            token: null,
            refreshToken: null,
            errors: [{ message: "Invalid token" }],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.setPassword({
        token: "bad-token",
        email: "test@example.com",
        password: "newPass",
      });

      // Assert
      expect(mockedStorage.setTokens).not.toHaveBeenCalled();
    });
  });

  describe("getExternalAuthUrl", () => {
    it("should call EXTERNAL_AUTHENTICATION_URL mutation with correct variables", async () => {
      // Arrange
      const mutationResult = {
        data: {
          externalAuthenticationUrl: {
            authenticationData: '{"url":"https://provider.com/auth"}',
            errors: [],
          },
        },
      };

      client.mutate.mockResolvedValue(mutationResult);

      // Act
      const result = await sdk.getExternalAuthUrl({
        pluginId: "my-plugin",
        input: JSON.stringify({ redirectUrl: "https://example.com/callback" }),
      });

      // Assert
      expect(client.mutate).toHaveBeenCalledWith({
        mutation: EXTERNAL_AUTHENTICATION_URL,
        variables: {
          pluginId: "my-plugin",
          input: JSON.stringify({ redirectUrl: "https://example.com/callback" }),
        },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("getExternalAccessToken", () => {
    it("should mark the session as authenticating and call OBTAIN_EXTERNAL_ACCESS_TOKEN", async () => {
      // Arrange
      client.mutate.mockResolvedValue({
        data: { externalObtainAccessTokens: { token: "tok", errors: [] } },
      });

      // Act
      await sdk.getExternalAccessToken({
        pluginId: "my-plugin",
        input: JSON.stringify({ code: "auth-code", state: "state-val" }),
      });

      // Assert
      expect(authStateVar().authenticating).toBe(true);
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: OBTAIN_EXTERNAL_ACCESS_TOKEN,
          variables: {
            pluginId: "my-plugin",
            input: JSON.stringify({ code: "auth-code", state: "state-val" }),
          },
        }),
      );
    });

    it("should store auth plugin ID and tokens via update callback when user has permissions", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          externalObtainAccessTokens: {
            token: "ext-access",
            refreshToken: "ext-refresh",
            user: {
              userPermissions: [{ code: "MANAGE_PRODUCTS", name: "Manage products" }],
            },
            errors: [],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.getExternalAccessToken({
        pluginId: "my-plugin",
        input: JSON.stringify({ code: "code" }),
      });

      // Assert
      expect(mockedStorage.setAuthPluginId).toHaveBeenCalledWith("my-plugin");
      expect(mockedStorage.setTokens).toHaveBeenCalledWith({
        accessToken: "ext-access",
        refreshToken: "ext-refresh",
      });
    });

    it("should stop authenticating via update callback when user has no permissions", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          externalObtainAccessTokens: {
            token: "ext-access",
            refreshToken: "ext-refresh",
            user: { userPermissions: [] },
            errors: [],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.getExternalAccessToken({
        pluginId: "my-plugin",
        input: JSON.stringify({ code: "code" }),
      });

      // Assert
      expect(mockedStorage.setAuthPluginId).toHaveBeenCalledWith("my-plugin");
      expect(mockedStorage.setTokens).not.toHaveBeenCalled();
      expect(authStateVar().authenticating).toBe(false);
      expect(authStateVar().authenticated).toBe(false);
    });

    it("should stop authenticating via update callback when no token returned", async () => {
      // Arrange
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          externalObtainAccessTokens: {
            token: null,
            refreshToken: null,
            user: null,
            errors: [{ message: "Invalid code" }],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.getExternalAccessToken({
        pluginId: "my-plugin",
        input: JSON.stringify({ code: "bad-code" }),
      });

      // Assert
      expect(mockedStorage.setTokens).not.toHaveBeenCalled();
      expect(authStateVar().authenticating).toBe(false);
      expect(authStateVar().authenticated).toBe(false);
    });
  });

  describe("refreshExternalToken", () => {
    it("should throw if no refresh token is present in storage", () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue(null);

      // Act & Assert
      expect(() => sdk.refreshExternalToken()).toThrow("refreshToken not present");
    });

    it("should call EXTERNAL_REFRESH mutation by default (includeUser=false)", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("ext-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");
      client.mutate.mockResolvedValue({
        data: { externalRefresh: { token: "new-tok", refreshToken: "new-ref", errors: [] } },
      });

      // Act
      await sdk.refreshExternalToken();

      // Assert
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: EXTERNAL_REFRESH,
          variables: {
            pluginId: "my-plugin",
            input: JSON.stringify({ refreshToken: "ext-refresh-token" }),
          },
        }),
      );
    });

    it("should call EXTERNAL_REFRESH_WITH_USER mutation when includeUser=true", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("ext-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");
      client.mutate.mockResolvedValue({
        data: { externalRefresh: { token: "new-tok", refreshToken: "new-ref", errors: [] } },
      });

      // Act
      await sdk.refreshExternalToken(true);

      // Assert
      expect(client.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: EXTERNAL_REFRESH_WITH_USER,
          variables: {
            pluginId: "my-plugin",
            input: JSON.stringify({ refreshToken: "ext-refresh-token" }),
          },
        }),
      );
    });

    it("should store tokens via update callback on success", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("ext-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          externalRefresh: { token: "new-ext-access", refreshToken: "new-ext-refresh", errors: [] },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshExternalToken();

      // Assert
      expect(mockedStorage.setTokens).toHaveBeenCalledWith({
        accessToken: "new-ext-access",
        refreshToken: "new-ext-refresh",
      });
    });

    it("should call logout via update callback when refresh fails", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("ext-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue(null);
      client.mutate.mockImplementation(async (opts: any) => {
        const data = { externalRefresh: { token: null, refreshToken: null, errors: [] } };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshExternalToken();

      // Assert
      expect(mockedStorage.clear).toHaveBeenCalled();
      expect(client.clearStore).toHaveBeenCalled();
    });

    it("should store tokens via update callback on success with includeUser=true", async () => {
      // Arrange
      mockedStorage.getRefreshToken.mockReturnValue("ext-refresh-token");
      mockedStorage.getAuthPluginId.mockReturnValue("my-plugin");
      client.mutate.mockImplementation(async (opts: any) => {
        const data = {
          externalRefresh: {
            token: "new-access-with-user",
            refreshToken: "new-refresh-with-user",
            user: { id: "1" },
            errors: [],
          },
        };

        opts.update(mockCache, { data });

        return { data };
      });

      // Act
      await sdk.refreshExternalToken(true);

      // Assert
      expect(mockedStorage.setTokens).toHaveBeenCalledWith({
        accessToken: "new-access-with-user",
        refreshToken: "new-refresh-with-user",
      });
    });
  });
});
