import { useApolloClient } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";

import { useChannelCurrenciesWithCache } from "./useChannelCurrenciesWithCache";

jest.mock("@apollo/client", () => ({
  useApolloClient: jest.fn(),
}));

jest.mock("@dashboard/graphql", () => ({
  useChannelCurrenciesQuery: jest.fn(),
  ChannelCurrenciesDocument: {},
}));

const { useChannelCurrenciesQuery } = jest.requireMock("@dashboard/graphql");

describe("useChannelCurrenciesWithCache", () => {
  const mockClient = {
    readQuery: jest.fn(),
  };

  const mockQueryResult = {
    data: { shop: { channelCurrencies: ["USD", "EUR"] } },
    loading: false,
    error: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApolloClient as jest.Mock).mockReturnValue(mockClient);
    useChannelCurrenciesQuery.mockReturnValue(mockQueryResult);
  });

  it("should use cached data when available and skip query", () => {
    const cachedData = { shop: { channelCurrencies: ["USD", "EUR", "GBP"] } };

    mockClient.readQuery.mockReturnValue(cachedData);

    const { result } = renderHook(() => useChannelCurrenciesWithCache());

    expect(mockClient.readQuery).toHaveBeenCalledWith({
      query: {},
      variables: {},
    });

    expect(useChannelCurrenciesQuery).toHaveBeenCalledWith({
      skip: true,
    });

    expect(result.current.loadingChannelCurrencies).toBe(false);
    expect(result.current.channelCurrencies).toEqual(["USD", "EUR", "GBP"]);
  });

  it("should execute query when no cached data is available", () => {
    mockClient.readQuery.mockImplementation(() => {
      throw new Error("Cache miss");
    });

    renderHook(() => useChannelCurrenciesWithCache());

    expect(useChannelCurrenciesQuery).toHaveBeenCalledWith({
      skip: false,
    });
  });

  it("should handle loading state for gift card forms", () => {
    mockClient.readQuery.mockImplementation(() => {
      throw new Error("Cache miss");
    });

    useChannelCurrenciesQuery.mockReturnValue({
      ...mockQueryResult,
      loading: true,
      data: undefined,
    });

    const { result } = renderHook(() => useChannelCurrenciesWithCache());

    expect(result.current.loadingChannelCurrencies).toBe(true);
    expect(result.current.channelCurrencies).toEqual([]);
  });

  it("should handle error state appropriately", () => {
    mockClient.readQuery.mockImplementation(() => {
      throw new Error("Cache miss");
    });

    const errorResult = {
      ...mockQueryResult,
      loading: false,
      error: new Error("Network error"),
      data: undefined,
    };

    useChannelCurrenciesQuery.mockReturnValue(errorResult);

    const { result } = renderHook(() => useChannelCurrenciesWithCache());

    expect(result.current.loadingChannelCurrencies).toBe(false);
    expect(result.current.channelCurrencies).toEqual([]);
  });

  it("should return query data when cache miss occurs", () => {
    mockClient.readQuery.mockImplementation(() => {
      throw new Error("Cache miss");
    });

    const { result } = renderHook(() => useChannelCurrenciesWithCache());

    expect(result.current.loadingChannelCurrencies).toBe(false);
    expect(result.current.channelCurrencies).toEqual(["USD", "EUR"]);
  });
});
