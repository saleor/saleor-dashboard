import { type ApolloClient } from "@apollo/client";

import {
  readCategoryChildrenPageFromCache,
  SUBCATEGORIES_PAGE_SIZE,
} from "./categoryChildrenQueries";

const createClientMock = () =>
  ({
    readQuery: jest.fn(),
  }) as unknown as ApolloClient<object> & {
    readQuery: jest.Mock;
  };

describe("categoryChildrenQueries", () => {
  it("should read cached children page with pagination cursor", () => {
    // Arrange
    const client = createClientMock();
    const parentId = "cat-1";
    const after = "cursor-1";

    client.readQuery.mockReturnValue({
      category: {
        children: {
          edges: [{ node: { id: "child-1", __typename: "Category" } }],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    });

    // Act
    const result = readCategoryChildrenPageFromCache(client, parentId, after);

    // Assert
    expect(client.readQuery).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: {
        id: parentId,
        first: SUBCATEGORIES_PAGE_SIZE,
        after,
      },
    });
    expect(result).toMatchObject({
      children: [{ id: "child-1" }],
      hasNextPage: false,
      endCursor: null,
    });
  });

  it("should return null when cache read fails", () => {
    // Arrange
    const client = createClientMock();

    client.readQuery.mockImplementation(() => {
      throw new Error("cache miss");
    });

    // Act
    const result = readCategoryChildrenPageFromCache(client, "cat-1");

    // Assert
    expect(result).toBeNull();
  });
});
