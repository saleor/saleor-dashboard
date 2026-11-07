import { ApolloError } from "@apollo/client";
import { type AuthSDK } from "@dashboard/auth/authSdk";
import { SessionEndedError } from "@dashboard/auth/errors";
import { GraphQLError, type OperationDefinitionNode } from "graphql";

import { createFetch, refreshAccessToken, registerAuthClient } from "./authFetch";
import {
  ExternalRefreshDocument,
  ExternalRefreshWithUserDocument,
  RefreshTokenDocument,
  RefreshTokenWithUserDocument,
} from "./hooks.generated";

const mockRefreshToken = jest.fn().mockResolvedValue({
  data: { tokenRefresh: { token: "new-token" } },
});
const mockRefreshExternalToken = jest.fn().mockResolvedValue({
  data: { externalRefresh: { token: "new-token" } },
});
const mockLogout = jest.fn();

jest.mock("@dashboard/auth/tokenStorage", () => ({
  isInternalToken: (owner: string) => owner === "saleor",
  storage: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    getSessionId: jest.fn(() => 1),
    setAccessToken: jest.fn(),
    setTokens: jest.fn(),
    getAuthPluginId: jest.fn(),
    setAuthPluginId: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// oxlint-disable-next-line @typescript-eslint/no-require-imports
const { storage } = require("@dashboard/auth/tokenStorage");
// oxlint-disable-next-line @typescript-eslint/no-require-imports
const jwtDecode = require("jwt-decode").default;

const createMockResponse = (body: Record<string, unknown>) => {
  const json = JSON.stringify(body);

  return {
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(body),
    clone: jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue(body),
    }),
    text: jest.fn().mockResolvedValue(json),
  };
};

const mockFetch = jest.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  jest.clearAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe("createFetch", () => {
  it("throws when client is not initialized", async () => {
    // Arrange
    // Use jest.isolateModules to get a fresh module where no auth client is registered
    const { createFetch: isolatedCreateFetch } = await new Promise<{
      createFetch: typeof createFetch;
    }>(resolve => {
      jest.isolateModules(() => {
        // oxlint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require("./authFetch");

        resolve(mod);
      });
    });

    const fetchFn = isolatedCreateFetch();

    // Act & Assert
    await expect(fetchFn("http://localhost:8000/graphql/")).rejects.toThrow(
      "Could not find Saleor's auth client. Did you forget to call initAuth()?",
    );
  });

  describe("after client initialization", () => {
    beforeEach(() => {
      registerAuthClient({
        refreshToken: mockRefreshToken,
        refreshExternalToken: mockRefreshExternalToken,
        logout: mockLogout,
      } as unknown as AuthSDK);
    });

    it("passes through refreshToken operations without modification", async () => {
      // Arrange
      const fetchFn = createFetch();
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      const body = JSON.stringify({ operationName: "RefreshToken" });

      // Act
      const response = await fetchFn("http://localhost:8000/graphql/", {
        body,
      });

      // Assert
      expect(response).toBe(expectedResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/graphql/", {
        body,
      });
      // getAccessToken is called before the early return, but auth header is not added
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Guards the hardcoded operation-name list in createFetch against a rename in
    // src/auth/mutations.ts: a miss there makes a refresh request try to refresh itself.
    it.each(
      [
        RefreshTokenDocument,
        RefreshTokenWithUserDocument,
        ExternalRefreshDocument,
        ExternalRefreshWithUserDocument,
      ].map(document => (document.definitions[0] as OperationDefinitionNode).name!.value),
    )("passes through the %s operation without modification", async operationName => {
      // Arrange
      const fetchFn = createFetch();
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);
      storage.getAccessToken.mockReturnValue("some-token");

      const body = JSON.stringify({ operationName });

      // Act
      const response = await fetchFn("http://localhost:8000/graphql/", { body });

      // Assert — no auth header added, no refresh triggered, single passthrough call
      expect(response).toBe(expectedResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/graphql/", { body });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockRefreshToken).not.toHaveBeenCalled();
      expect(mockRefreshExternalToken).not.toHaveBeenCalled();
    });

    it("passes through externalRefresh operations without modification", async () => {
      // Arrange
      const fetchFn = createFetch();
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      const body = JSON.stringify({ operationName: "ExternalRefresh" });

      // Act
      const response = await fetchFn("http://localhost:8000/graphql/", {
        body,
      });

      // Assert
      expect(response).toBe(expectedResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/graphql/", {
        body,
      });
    });

    it("adds authorization-bearer header when token exists and autoTokenRefresh is disabled", async () => {
      // Arrange
      storage.getAccessToken.mockReturnValue("test-token");

      const fetchFn = createFetch({
        autoTokenRefresh: false,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/graphql/",
        expect.objectContaining({
          headers: expect.objectContaining({
            "authorization-bearer": "test-token",
          }),
        }),
      );
    });

    it("skips auth header when no token is present", async () => {
      // Arrange
      storage.getAccessToken.mockReturnValue(null);

      const fetchFn = createFetch({
        autoTokenRefresh: false,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/graphql/", {});
    });

    it("triggers auto token refresh when token is expired for saleor owner", async () => {
      // Arrange
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 300;

      storage.getAccessToken.mockReturnValue("expired-token");
      jwtDecode.mockReturnValue({
        exp: expiredTimestamp,
        owner: "saleor",
      });

      const fetchFn = createFetch({
        autoTokenRefresh: true,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockRefreshToken).toHaveBeenCalled();
      expect(mockRefreshExternalToken).not.toHaveBeenCalled();
    });

    it("uses refreshExternalToken for non-saleor owner", async () => {
      // Arrange
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 300;

      storage.getAccessToken.mockReturnValue("expired-external-token");
      jwtDecode.mockReturnValue({
        exp: expiredTimestamp,
        owner: "mirumee.authentication.openidconnect",
      });

      const fetchFn = createFetch({
        autoTokenRefresh: true,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockRefreshExternalToken).toHaveBeenCalled();
      expect(mockRefreshToken).not.toHaveBeenCalled();
    });

    it("does not refresh when token is still valid", async () => {
      // Arrange
      const futureTimestamp = Math.floor(Date.now() / 1000) + 600;

      storage.getAccessToken.mockReturnValue("valid-token");
      jwtDecode.mockReturnValue({
        exp: futureTimestamp,
        owner: "saleor",
      });

      const fetchFn = createFetch({
        autoTokenRefresh: true,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockRefreshToken).not.toHaveBeenCalled();
      expect(mockRefreshExternalToken).not.toHaveBeenCalled();
    });

    it("skips auto refresh when autoTokenRefresh is disabled", async () => {
      // Arrange
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 300;

      storage.getAccessToken.mockReturnValue("expired-token");
      jwtDecode.mockReturnValue({
        exp: expiredTimestamp,
        owner: "saleor",
      });

      const fetchFn = createFetch({
        autoTokenRefresh: false,
        refreshOnUnauthorized: false,
      });
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      // Act
      await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockRefreshToken).not.toHaveBeenCalled();
    });

    it("refreshes only once when concurrent requests find the token expired", async () => {
      // Arrange
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 300;

      storage.getAccessToken.mockReturnValue("expired-token");
      jwtDecode.mockReturnValue({
        exp: expiredTimestamp,
        owner: "saleor",
      });

      // Keep the refresh in flight so both requests overlap, mirroring the burst
      // of queries Apollo fires when a slept tab wakes up.
      let resolveRefresh: (value: unknown) => void = () => undefined;

      mockRefreshToken.mockReturnValueOnce(
        new Promise(resolve => {
          resolveRefresh = resolve;
        }),
      );

      const fetchFn = createFetch({
        autoTokenRefresh: true,
        refreshOnUnauthorized: false,
      });

      mockFetch.mockResolvedValue(createMockResponse({ data: {} }));

      // Act
      const requests = Promise.all([
        fetchFn("http://localhost:8000/graphql/", {}),
        fetchFn("http://localhost:8000/graphql/", {}),
      ]);

      await Promise.resolve();
      resolveRefresh({ data: { tokenRefresh: { token: "new-token" } } });
      await requests;

      // Assert
      expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    });

    it("retries request on ExpiredSignatureError when refreshOnUnauthorized is enabled", async () => {
      // Arrange
      const futureTimestamp = Math.floor(Date.now() / 1000) + 600;

      storage.getAccessToken.mockReturnValue("test-token");
      jwtDecode.mockReturnValue({
        exp: futureTimestamp,
        owner: "saleor",
      });

      const unauthorizedResponse = createMockResponse({
        errors: [
          {
            extensions: {
              exception: { code: "ExpiredSignatureError" },
            },
          },
        ],
      });
      const successResponse = createMockResponse({ data: { me: {} } });

      mockFetch.mockResolvedValueOnce(unauthorizedResponse).mockResolvedValueOnce(successResponse);

      mockRefreshToken.mockResolvedValueOnce({
        data: { tokenRefresh: { token: "refreshed-token" } },
      });

      const fetchFn = createFetch({
        autoTokenRefresh: true,
        refreshOnUnauthorized: true,
      });

      // Act
      const result = await fetchFn("http://localhost:8000/graphql/", {});

      // Assert
      expect(mockRefreshToken).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);
    });
    describe("when the token expired and the refresh does not succeed", () => {
      const expiredResponse = createMockResponse({
        errors: [{ extensions: { exception: { code: "ExpiredSignatureError" } } }],
      });
      const runRequest = (): Promise<Response> =>
        createFetch({ autoTokenRefresh: true, refreshOnUnauthorized: true })(
          "http://localhost:8000/graphql/",
          {},
        );

      beforeEach(() => {
        storage.getAccessToken.mockReturnValue("test-token");
        jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 600, owner: "saleor" });
        mockFetch.mockResolvedValue(expiredResponse);
      });

      it("keeps the session and reports the failure when the refresh request fails", async () => {
        // Arrange
        const networkError = new TypeError("Failed to fetch");

        mockRefreshToken.mockRejectedValueOnce(new ApolloError({ networkError }));

        // Act
        const request = runRequest();

        // Assert
        await expect(request).rejects.toBe(networkError);
        expect(mockLogout).not.toHaveBeenCalled();
      });

      it("logs out and returns the expired response when the API refuses the refresh token", async () => {
        // Arrange
        mockRefreshToken.mockResolvedValueOnce({ data: { tokenRefresh: { token: null } } });

        // Act
        const result = await runRequest();

        // Assert
        expect(result).toBe(expiredResponse);
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });

      it("returns the expired response when the refresh fails with an API error", async () => {
        // Arrange
        mockRefreshToken.mockRejectedValueOnce(
          new ApolloError({ graphQLErrors: [new GraphQLError("Invalid token")] }),
        );

        // Act
        const result = await runRequest();

        // Assert
        expect(result).toBe(expiredResponse);
      });
    });

    describe("when the session ends while the request waits for a refresh", () => {
      const expiredResponse = createMockResponse({
        errors: [{ extensions: { exception: { code: "ExpiredSignatureError" } } }],
      });
      const runRequest = (): Promise<Response> =>
        createFetch({ autoTokenRefresh: true, refreshOnUnauthorized: true })(
          "http://localhost:8000/graphql/",
          {},
        );
      // What a logout (no stored session) or another login (a new stored session) leaves behind.
      const endSession = (nextRefreshToken: string | null): void => {
        storage.getSessionId.mockReturnValue(2);
        storage.getRefreshToken.mockReturnValue(nextRefreshToken);
      };

      beforeEach(() => {
        storage.getAccessToken.mockReturnValue("test-token");
        storage.getRefreshToken.mockReturnValue("refresh-token");
        jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 600, owner: "saleor" });
        mockFetch.mockResolvedValue(expiredResponse);
      });

      afterEach(() => {
        storage.getSessionId.mockImplementation(() => 1);
        mockRefreshToken.mockReset();
        mockRefreshToken.mockResolvedValue({ data: { tokenRefresh: { token: "new-token" } } });
      });

      it("drops the request instead of retrying it for the next session", async () => {
        // Arrange
        mockRefreshToken.mockImplementationOnce(async () => {
          endSession("next-session-refresh-token");

          return { data: { tokenRefresh: { token: "old-session-token" } } };
        });

        // Act
        const request = runRequest();

        // Assert
        await expect(request).rejects.toBeInstanceOf(SessionEndedError);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockLogout).not.toHaveBeenCalled();
      });

      it("does not log out a newer session when an old refresh is refused", async () => {
        // Arrange
        mockRefreshToken.mockImplementationOnce(async () => {
          endSession("next-session-refresh-token");

          return { data: { tokenRefresh: { token: null } } };
        });

        // Act
        const request = runRequest();

        // Assert
        await expect(request).rejects.toBeInstanceOf(SessionEndedError);
        expect(mockLogout).not.toHaveBeenCalled();
      });

      it("returns the expired response when this session's own refusal logged out", async () => {
        // Arrange
        mockRefreshToken.mockImplementationOnce(async () => {
          endSession(null);

          return { data: { tokenRefresh: { token: null } } };
        });

        // Act
        const result = await runRequest();

        // Assert
        expect(result).toBe(expiredResponse);
        expect(mockLogout).not.toHaveBeenCalled();
      });

      it("leaves requests sent without a token alone", async () => {
        // Arrange
        const response = createMockResponse({ data: { shop: {} } });

        storage.getAccessToken.mockReturnValue(null);
        mockFetch.mockImplementationOnce(async () => {
          endSession("next-session-refresh-token");

          return response;
        });

        // Act
        const result = await runRequest();

        // Assert
        expect(result).toBe(response);
      });

      it("starts a new refresh for the next session instead of waiting on the old one", async () => {
        // Arrange
        let finishOldRefresh: (value: unknown) => void = () => undefined;

        mockRefreshToken
          .mockImplementationOnce(() => new Promise(resolve => (finishOldRefresh = resolve)))
          .mockResolvedValueOnce({ data: { tokenRefresh: { token: "next-session-token" } } });

        const oldRequest = runRequest().catch(() => undefined);

        for (let tick = 0; tick < 20 && mockRefreshToken.mock.calls.length === 0; tick++) {
          await Promise.resolve();
        }

        endSession("next-session-refresh-token");

        // Act
        await runRequest().catch(() => undefined);

        // Assert
        expect(mockRefreshToken).toHaveBeenCalledTimes(2);

        finishOldRefresh({ data: { tokenRefresh: { token: "old-session-token" } } });
        await oldRequest;
      });

      it("gives no token to a caller whose session ended during the refresh", async () => {
        // Arrange
        mockRefreshToken
          .mockImplementationOnce(async () => {
            endSession("next-session-refresh-token");

            return { data: { tokenRefresh: { token: "old-session-token" } } };
          })
          .mockResolvedValueOnce({ data: { tokenRefresh: { token: "fresh-token" } } });

        // Act
        const afterSessionEnded = await refreshAccessToken();

        storage.getSessionId.mockImplementation(() => 1);

        const sameSession = await refreshAccessToken();

        // Assert
        expect(afterSessionEnded).toBeNull();
        expect(sameSession).toBe("test-token");
      });
    });
  });
});
