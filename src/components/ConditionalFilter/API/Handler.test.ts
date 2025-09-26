import { ApolloClient, ApolloQueryResult } from "@apollo/client";
import {
  _GetWarehouseChoicesDocument,
  _GetWarehouseChoicesQuery,
  _GetWarehouseChoicesQueryVariables,
} from "@dashboard/graphql";

import { WarehouseHandler } from "./Handler";

describe("WarehouseHandler", () => {
  let mockClient: jest.Mocked<ApolloClient<unknown>>;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
    } as unknown as jest.Mocked<ApolloClient<unknown>>;
  });

  it("fetches warehouses with correct query and variables", async () => {
    // Arrange
    const searchQuery = "main";
    const handler = new WarehouseHandler(mockClient, searchQuery);

    const mockResponse: _GetWarehouseChoicesQuery = {
      __typename: "Query" as const,
      warehouses: {
        __typename: "WarehouseCountableConnection",
        edges: [
          {
            __typename: "WarehouseCountableEdge",
            node: {
              __typename: "Warehouse",
              id: "WRH123",
              name: "Main Warehouse",
              slug: "main-warehouse",
            },
          },
          {
            __typename: "WarehouseCountableEdge",
            node: {
              __typename: "Warehouse",
              id: "WRH456",
              name: "Main Distribution Center",
              slug: "main-distribution",
            },
          },
        ],
      },
    };

    mockClient.query.mockResolvedValueOnce({
      data: mockResponse,
    } as ApolloQueryResult<_GetWarehouseChoicesQuery>);

    // Act
    const result = await handler.fetch();

    // Assert
    expect(mockClient.query).toHaveBeenCalledWith({
      query: _GetWarehouseChoicesDocument,
      variables: {
        first: 5,
        query: searchQuery,
      } as _GetWarehouseChoicesQueryVariables,
    });

    expect(result).toEqual([
      {
        label: "Main Warehouse",
        value: "WRH123",
        slug: "main-warehouse",
        originalSlug: undefined,
      },
      {
        label: "Main Distribution Center",
        value: "WRH456",
        slug: "main-distribution",
        originalSlug: undefined,
      },
    ]);
  });

  it("handles empty search query", async () => {
    // Arrange
    const handler = new WarehouseHandler(mockClient, "");

    const mockResponse: _GetWarehouseChoicesQuery = {
      __typename: "Query" as const,
      warehouses: {
        __typename: "WarehouseCountableConnection",
        edges: [
          {
            __typename: "WarehouseCountableEdge",
            node: {
              __typename: "Warehouse",
              id: "WRH1",
              name: "Warehouse 1",
              slug: "warehouse-1",
            },
          },
        ],
      },
    };

    mockClient.query.mockResolvedValueOnce({
      data: mockResponse,
    } as ApolloQueryResult<_GetWarehouseChoicesQuery>);

    // Act
    const result = await handler.fetch();

    // Assert
    expect(mockClient.query).toHaveBeenCalledWith({
      query: _GetWarehouseChoicesDocument,
      variables: {
        first: 5,
        query: "",
      },
    });

    expect(result).toEqual([
      {
        label: "Warehouse 1",
        value: "WRH1",
        slug: "warehouse-1",
        originalSlug: undefined,
      },
    ]);
  });

  it("handles empty response with no warehouses", async () => {
    // Arrange
    const handler = new WarehouseHandler(mockClient, "nonexistent");

    const mockResponse: _GetWarehouseChoicesQuery = {
      __typename: "Query" as const,
      warehouses: {
        __typename: "WarehouseCountableConnection",
        edges: [],
      },
    };

    mockClient.query.mockResolvedValueOnce({
      data: mockResponse,
    } as ApolloQueryResult<_GetWarehouseChoicesQuery>);

    // Act
    const result = await handler.fetch();

    // Assert
    expect(result).toEqual([]);
  });

  it("handles null warehouses response", async () => {
    // Arrange
    const handler = new WarehouseHandler(mockClient as unknown as ApolloClient<unknown>, "test");

    const mockResponse: _GetWarehouseChoicesQuery = {
      __typename: "Query" as const,
      warehouses: null,
    };

    mockClient.query.mockResolvedValueOnce({
      data: mockResponse,
    } as ApolloQueryResult<_GetWarehouseChoicesQuery>);

    // Act
    const result = await handler.fetch();

    // Assert
    expect(result).toEqual([]);
  });

  it("propagates apollo client query errors", async () => {
    // Arrange
    const handler = new WarehouseHandler(mockClient as unknown as ApolloClient<unknown>, "test");
    const error = new Error("Network error");

    mockClient.query.mockRejectedValueOnce(error);

    // Act & Assert
    await expect(handler.fetch()).rejects.toThrow("Network error");
  });
});
