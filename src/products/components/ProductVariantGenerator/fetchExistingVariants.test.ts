import { type ApolloClient } from "@apollo/client";
import { GraphQLError } from "graphql";

import {
  ExistingVariantsFetchError,
  fetchAllExistingVariantsForGenerator,
  MAX_EXISTING_VARIANT_PAGES,
} from "./fetchExistingVariants";

function createClient(pages: Array<{ nodes: unknown[]; hasNextPage: boolean; endCursor: string }>) {
  let call = 0;

  return {
    query: jest.fn().mockImplementation(async () => {
      const page = pages[call] ?? pages[pages.length - 1];

      call += 1;

      return {
        data: {
          product: {
            id: "p1",
            productVariants: {
              pageInfo: {
                hasNextPage: page.hasNextPage,
                endCursor: page.endCursor,
              },
              edges: page.nodes.map((node, index) => ({
                node,
                cursor: `c${call}-${index}`,
              })),
            },
          },
        },
      };
    }),
  } as unknown as ApolloClient<object>;
}

describe("fetchAllExistingVariantsForGenerator", () => {
  it("walks pages and keeps only selection attributes", async () => {
    // Arrange
    const client = createClient([
      {
        nodes: [
          {
            id: "v1",
            sku: "A",
            attributes: [
              { attribute: { id: "size" }, values: [{ slug: "s" }] },
              { attribute: { id: "material" }, values: [{ slug: "cotton" }] },
            ],
          },
        ],
        hasNextPage: true,
        endCursor: "cursor-1",
      },
      {
        nodes: [
          {
            id: "v2",
            sku: "B",
            attributes: [
              { attribute: { id: "size" }, values: [{ slug: "m" }] },
              { attribute: { id: "material" }, values: [{ slug: "cotton" }] },
            ],
          },
        ],
        hasNextPage: false,
        endCursor: "cursor-2",
      },
    ]);

    // Act
    const result = await fetchAllExistingVariantsForGenerator(client, "p1", new Set(["size"]));

    // Assert
    expect(result).toEqual([
      { attributes: [{ attribute: { id: "size" }, values: [{ slug: "s" }] }] },
      { attributes: [{ attribute: { id: "size" }, values: [{ slug: "m" }] }] },
    ]);
    expect(client.query).toHaveBeenCalledTimes(2);
  });

  it("fails closed when the product is missing", async () => {
    // Arrange
    const client = {
      query: jest.fn().mockResolvedValue({ data: { product: null } }),
    } as unknown as ApolloClient<object>;

    // Act / Assert
    await expect(
      fetchAllExistingVariantsForGenerator(client, "missing", new Set(["size"])),
    ).rejects.toBeInstanceOf(ExistingVariantsFetchError);
  });

  it("fails closed when the pagination cursor does not advance", async () => {
    // Arrange
    const client = createClient([
      {
        nodes: [
          {
            id: "v1",
            sku: null,
            attributes: [{ attribute: { id: "size" }, values: [{ slug: "s" }] }],
          },
        ],
        hasNextPage: true,
        endCursor: "stuck",
      },
      {
        nodes: [
          {
            id: "v2",
            sku: null,
            attributes: [{ attribute: { id: "size" }, values: [{ slug: "m" }] }],
          },
        ],
        hasNextPage: true,
        endCursor: "stuck",
      },
    ]);

    // Act / Assert
    await expect(
      fetchAllExistingVariantsForGenerator(client, "p1", new Set(["size"])),
    ).rejects.toThrow(/cursor did not advance/);
  });

  it("fails closed when the page cap is exceeded", async () => {
    // Arrange — every page claims another page with a new cursor
    let page = 0;
    const client = {
      query: jest.fn().mockImplementation(async () => {
        page += 1;

        return {
          data: {
            product: {
              id: "p1",
              productVariants: {
                pageInfo: {
                  hasNextPage: true,
                  endCursor: `cursor-${page}`,
                },
                edges: [
                  {
                    cursor: `c-${page}`,
                    node: {
                      id: `v-${page}`,
                      sku: null,
                      attributes: [{ attribute: { id: "size" }, values: [{ slug: `s${page}` }] }],
                    },
                  },
                ],
              },
            },
          },
        };
      }),
    } as unknown as ApolloClient<object>;

    // Act / Assert
    await expect(
      fetchAllExistingVariantsForGenerator(client, "p1", new Set(["size"])),
    ).rejects.toThrow(new RegExp(`Exceeded ${MAX_EXISTING_VARIANT_PAGES}`));
    expect(client.query).toHaveBeenCalledTimes(MAX_EXISTING_VARIANT_PAGES);
  });

  it("fails closed on GraphQL errors", async () => {
    // Arrange
    const client = {
      query: jest.fn().mockResolvedValue({
        data: undefined,
        error: { message: "boom", graphQLErrors: [new GraphQLError("boom")] },
      }),
    } as unknown as ApolloClient<object>;

    // Act / Assert
    await expect(
      fetchAllExistingVariantsForGenerator(client, "p1", new Set(["size"])),
    ).rejects.toBeInstanceOf(ExistingVariantsFetchError);
  });
});
