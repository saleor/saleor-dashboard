import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchProductTypesOperandsQuery,
} from "@dashboard/graphql";

import { createInitialStateFromData } from "./helpers";

describe("ConditionalFilter / API / createInitialStateFromData", () => {
  it("should create initial state from queries", () => {
    // Arrange
    const channelQuery = {
      data: {
        channels: [
          { id: "1", name: "Channel 1", slug: "channel-1" },
          { id: "2", name: "Channel 2", slug: "channel-2" },
        ],
      },
    } as ApolloQueryResult<_GetChannelOperandsQuery>;
    const collectionQuery = {
      data: {
        collections: {
          edges: [
            { node: { id: "1", name: "Collection 1", slug: "collection-1" } },
            { node: { id: "2", name: "Collection 2", slug: "collection-2" } },
          ],
        },
      },
    } as ApolloQueryResult<_SearchCollectionsOperandsQuery>;
    const categoryQuery = {
      data: {
        categories: {
          edges: [
            { node: { id: "1", name: "Category 1", slug: "category-1" } },
            { node: { id: "2", name: "Category 2", slug: "category-2" } },
          ],
        },
      },
    } as ApolloQueryResult<_SearchCategoriesOperandsQuery>;
    const productTypeQuery = {
      data: {
        productTypes: {
          edges: [
            {
              node: { id: "1", name: "Product Type 1", slug: "product-type-1" },
            },
            {
              node: { id: "2", name: "Product Type 2", slug: "product-type-2" },
            },
          ],
        },
      },
    } as ApolloQueryResult<_SearchProductTypesOperandsQuery>;
    const attributeQuery = {
      data: {
        attributes: {
          edges: [
            {
              node: {
                id: "1",
                name: "Attribute 1",
                slug: "attribute-1",
                inputType: "MULTISELECT",
                choices: {
                  edges: [
                    {
                      node: {
                        id: "1",
                        name: "Choice 1",
                        slug: "choice-1",
                      },
                    },
                    {
                      node: {
                        id: "2",
                        name: "Choice 2",
                        slug: "choice-2",
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                id: "2",
                name: "Attribute 2",
                slug: "attribute-2",
                inputType: "BOOLEAN",
              },
            },
          ],
        },
      },
    } as ApolloQueryResult<_SearchAttributeOperandsQuery>;
    const data = [channelQuery, collectionQuery, categoryQuery, productTypeQuery, attributeQuery];
    const channel = ["channel-1"];
    // Act
    const result = createInitialStateFromData(data, channel);

    // Assert
    expect(result).toMatchSnapshot();
  });
});
