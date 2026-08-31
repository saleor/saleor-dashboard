import { type AuthSDK } from "@dashboard/auth/authSdk";
import { type OperationDefinitionNode } from "graphql";

import { createFetch, registerAuthClient } from "./authFetch";
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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { storage } = require("@dashboard/auth/tokenStorage");
// eslint-disable-next-line @typescript-eslint/no-require-imports
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
        // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  });
});
