import { ApolloClient } from "@apollo/client";

import { createApolloClient, createFetch } from "./client";

const mockRefreshToken = jest.fn().mockResolvedValue({
  data: { tokenRefresh: { token: "new-token" } },
});
const mockRefreshExternalToken = jest.fn().mockResolvedValue({
  data: { externalRefresh: { token: "new-token" } },
});
const mockLogout = jest.fn();

jest.mock("../core/storage", () => ({
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

jest.mock("../core/auth", () => ({
  auth: jest.fn(() => ({
    refreshToken: mockRefreshToken,
    refreshExternalToken: mockRefreshExternalToken,
    logout: mockLogout,
  })),
}));

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { storage } = require("../core/storage");
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

describe("createApolloClient", () => {
  it("returns an ApolloClient instance", () => {
    // Arrange
    const apiUrl = "http://localhost:8000/graphql/";

    // Act
    const client = createApolloClient(apiUrl, false);

    // Assert
    expect(client).toBeInstanceOf(ApolloClient);
  });
});

describe("createFetch", () => {
  it("throws when client is not initialized", async () => {
    // Arrange
    // Use jest.isolateModules to get a fresh module where client is undefined
    const { createFetch: isolatedCreateFetch } = await new Promise<{
      createFetch: typeof createFetch;
    }>(resolve => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require("./client");

        resolve(mod);
      });
    });

    const fetchFn = isolatedCreateFetch();

    // Act & Assert
    await expect(fetchFn("http://localhost:8000/graphql/")).rejects.toThrow(
      "Could not find Saleor's client instance. Did you forget to call createSaleorClient()?",
    );
  });

  describe("after client initialization", () => {
    beforeEach(() => {
      createApolloClient("http://localhost:8000/graphql/", false);
    });

    it("passes through refreshToken operations without modification", async () => {
      // Arrange
      const fetchFn = createFetch();
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      const body = JSON.stringify({ operationName: "refreshToken" });

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

    it("passes through externalRefresh operations without modification", async () => {
      // Arrange
      const fetchFn = createFetch();
      const expectedResponse = createMockResponse({ data: {} });

      mockFetch.mockResolvedValue(expectedResponse);

      const body = JSON.stringify({ operationName: "externalRefresh" });

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
