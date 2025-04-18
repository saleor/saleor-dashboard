import { getApiUrl } from "@dashboard/config";
import { createGraphiQLFetcher, FetcherOpts } from "@graphiql/toolkit";
import { createFetch } from "@saleor/sdk";

import { getFetcher } from "./utils";

jest.mock("@graphiql/toolkit", () => ({
  createGraphiQLFetcher: jest.fn(),
}));

jest.mock("@saleor/sdk", () => ({
  createFetch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("@dashboard/config", () => ({
  ENABLED_SERVICE_NAME_HEADER: true,
  getApiUrl: jest.fn(() => "http://test-api.com"),
}));

const mockCreateGraphiQLFetcher = createGraphiQLFetcher as jest.Mock;
const authorizedFetch = createFetch as jest.Mock;
const mockGetApiUrl = getApiUrl as jest.Mock;

describe("getFetcher", () => {
  const mockApiUrl = "http://test-api.com";
  let originalFetch: typeof fetch;

  beforeEach(() => {
    process.env.API_URL = mockApiUrl;
    originalFetch = global.fetch;
    // Ensure getApiUrl returns the expected value in each test
    mockGetApiUrl.mockReturnValue(mockApiUrl);
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  it("should return fetcher with authorizedFetch when no auth headers", () => {
    // Arrange
    const opts: FetcherOpts = { headers: {} };

    // Act
    getFetcher(opts);

    // Assert
    expect(authorizedFetch).toHaveBeenCalled();
    // 'toHaveBeenCalledWith' can't properly compare mock functions
    expect(mockCreateGraphiQLFetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: mockApiUrl,
      }),
    );
  });

  it("should return fetcher with fetch when Authorization header present", () => {
    // Arrange
    const opts: FetcherOpts = {
      headers: { Authorization: "Bearer token" },
    };

    // Act
    getFetcher(opts);

    // Assert
    expect(mockCreateGraphiQLFetcher).toHaveBeenCalledWith({
      url: mockApiUrl,
      fetch: fetch,
      headers: {
        "source-service-name": "saleor.dashboard.playground",
      },
    });
  });

  it("should return fetcher with fetch when Authorization-Bearer header present", () => {
    // Arrange
    const opts: FetcherOpts = {
      headers: {
        "Authorization-Bearer": "token",
      },
    };

    // Act
    getFetcher(opts);

    // Assert
    expect(mockCreateGraphiQLFetcher).toHaveBeenCalledWith({
      url: mockApiUrl,
      fetch: fetch,
      headers: {
        "source-service-name": "saleor.dashboard.playground",
      },
    });
  });

  it("should return fetcher with fetch when lowercase header present", () => {
    // Arrange
    const opts: FetcherOpts = {
      headers: {
        "authorization-bearer": "token",
      },
    };

    // Act
    getFetcher(opts);

    // Assert
    expect(mockCreateGraphiQLFetcher).toHaveBeenCalledWith({
      url: mockApiUrl,
      fetch: fetch,
      headers: {
        "source-service-name": "saleor.dashboard.playground",
      },
    });
  });
});
