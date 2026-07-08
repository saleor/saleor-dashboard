import { type PageTypeListWithAssignedAttributeCountsQuery } from "@dashboard/graphql";

import { getAssignedModelTypesForAttribute } from "./getAssignedModelTypesForAttribute";

describe("getAssignedModelTypesForAttribute", () => {
  it("should return model types that include the attribute", () => {
    // Arrange
    const attributeId = "attr-1";
    const data: PageTypeListWithAssignedAttributeCountsQuery = {
      __typename: "Query",
      pageTypes: {
        __typename: "PageTypeCountableConnection",
        edges: [
          {
            __typename: "PageTypeCountableEdge",
            node: {
              __typename: "PageType",
              id: "type-1",
              name: "Blog",
              hasPages: true,
              attributes: [
                { __typename: "Attribute", id: "attr-1" },
                { __typename: "Attribute", id: "attr-2" },
              ],
            },
          },
          {
            __typename: "PageTypeCountableEdge",
            node: {
              __typename: "PageType",
              id: "type-2",
              name: "Landing",
              hasPages: false,
              attributes: [{ __typename: "Attribute", id: "attr-3" }],
            },
          },
        ],
        pageInfo: {
          __typename: "PageInfo",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      },
    };

    // Act
    const result = getAssignedModelTypesForAttribute(data, attributeId);

    // Assert
    expect(result).toEqual({
      items: [{ id: "type-1", name: "Blog" }],
      typesListHasMore: true,
    });
  });
});
