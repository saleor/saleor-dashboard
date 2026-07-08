import { computePageTypeTabCounts } from "@dashboard/attributes/utils/computeTypeTabCounts";
import { type PageTypeListWithAssignedAttributeCountsQuery } from "@dashboard/graphql";

describe("computePageTypeTabCounts", () => {
  it("should build counts from page type attribute ids", () => {
    // Arrange
    const data: PageTypeListWithAssignedAttributeCountsQuery = {
      __typename: "Query",
      pageTypes: {
        __typename: "PageTypeCountableConnection",
        edges: [
          {
            __typename: "PageTypeCountableEdge",
            node: {
              __typename: "PageType",
              id: "pt-1",
              name: "Blog",
              hasPages: true,
              attributes: [{ __typename: "Attribute", id: "a-1" }],
            },
          },
        ],
        pageInfo: {
          __typename: "PageInfo",
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
      },
    };

    // Act
    const result = computePageTypeTabCounts(data);

    // Assert
    expect(result).toEqual({
      "pt-1": { value: 1, hasMore: false },
    });
  });
});
