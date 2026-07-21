import { type ApolloClient } from "@apollo/client";

import {
  fetchProductDoctorVariants,
  MAX_PRODUCT_DOCTOR_VARIANT_PAGES,
  ProductDoctorVariantsFetchError,
} from "./fetchProductDoctorVariants";

function createClient(
  pages: Array<{
    nodes: Array<{
      id: string;
      name: string;
      channelListings: unknown[];
      stocks: unknown[];
    }>;
    hasNextPage: boolean;
    endCursor: string;
    totalCount?: number;
  }>,
) {
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
              totalCount: page.totalCount ?? 2,
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

describe("fetchProductDoctorVariants", () => {
  it("walks pages and returns the full slim catalog", async () => {
    // Arrange
    const client = createClient([
      {
        nodes: [
          {
            id: "v1",
            name: "Variant 1",
            channelListings: [{ channel: { id: "ch1" }, price: { amount: 10 } }],
            stocks: [{ warehouse: { id: "w1" }, quantity: 1 }],
          },
        ],
        hasNextPage: true,
        endCursor: "cursor-1",
        totalCount: 2,
      },
      {
        nodes: [
          {
            id: "v2",
            name: "Variant 2",
            channelListings: [],
            stocks: [],
          },
        ],
        hasNextPage: false,
        endCursor: "cursor-2",
        totalCount: 2,
      },
    ]);

    // Act
    const result = await fetchProductDoctorVariants(client, "p1");

    // Assert
    expect(result.totalCount).toBe(2);
    expect(result.variants.map(variant => variant.id)).toEqual(["v1", "v2"]);
    expect(client.query).toHaveBeenCalledTimes(2);
  });

  it("fails closed when the product is missing", async () => {
    // Arrange
    const client = {
      query: jest.fn().mockResolvedValue({ data: { product: null } }),
    } as unknown as ApolloClient<object>;

    // Act / Assert
    await expect(fetchProductDoctorVariants(client, "missing")).rejects.toBeInstanceOf(
      ProductDoctorVariantsFetchError,
    );
  });

  it("fails closed when the pagination cursor does not advance", async () => {
    // Arrange
    const client = createClient([
      {
        nodes: [
          {
            id: "v1",
            name: "Variant 1",
            channelListings: [],
            stocks: [],
          },
        ],
        hasNextPage: true,
        endCursor: "stuck",
      },
      {
        nodes: [
          {
            id: "v2",
            name: "Variant 2",
            channelListings: [],
            stocks: [],
          },
        ],
        hasNextPage: true,
        endCursor: "stuck",
      },
    ]);

    // Act / Assert
    await expect(fetchProductDoctorVariants(client, "p1")).rejects.toBeInstanceOf(
      ProductDoctorVariantsFetchError,
    );
  });

  it("fails closed when the page cap is exceeded", async () => {
    // Arrange
    const client = {
      query: jest.fn().mockImplementation(async () => ({
        data: {
          product: {
            id: "p1",
            productVariants: {
              totalCount: MAX_PRODUCT_DOCTOR_VARIANT_PAGES * 100 + 1,
              pageInfo: {
                hasNextPage: true,
                endCursor: `cursor-${Math.random()}`,
              },
              edges: [
                {
                  node: {
                    id: "v",
                    name: "Variant",
                    channelListings: [],
                    stocks: [],
                  },
                  cursor: "c",
                },
              ],
            },
          },
        },
      })),
    } as unknown as ApolloClient<object>;

    // Act / Assert
    await expect(fetchProductDoctorVariants(client, "p1")).rejects.toThrow(
      `Exceeded ${MAX_PRODUCT_DOCTOR_VARIANT_PAGES} pages`,
    );
  });
});
