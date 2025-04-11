import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
  getFilteredProductVariants,
  mapLocalVariantsToSavedVariants,
} from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { SearchProductsOpts } from "@dashboard/discounts/types";
import { v4 as uuidv4 } from "uuid";

import { FormData } from "./types";

jest.mock("uuid");

describe("generateDraftVoucherCode", () => {
  it("should return draft voucher code", () => {
    // Act
    const draftVoucherCode = generateDraftVoucherCode("test1");

    // Assert
    expect(draftVoucherCode).toEqual({
      code: "test1",
      status: "Draft",
    });
  });
});

describe("generateMultipleVoucherCodes", () => {
  it("should return multiple voucher codes", () => {
    // Arrange
    (uuidv4 as jest.Mock).mockImplementation(() => "uuid");

    // Act
    const draftVoucherCodes = generateMultipleVoucherCodes("2", "test");

    // Assert
    expect(draftVoucherCodes).toEqual([
      { code: "test-uuid", status: "Draft" },
      { code: "test-uuid", status: "Draft" },
    ]);
  });
});

describe("mapLocalVariantsToSavedVariants", () => {
  it("should return empty edges array when no variants provided", () => {
    // Arrange & Act
    const result = mapLocalVariantsToSavedVariants([]);

    // Assert
    expect(result).toEqual({
      __typename: "ProductVariantCountableConnection",
      edges: [],
    });
  });

  it("should correctly map single variant", () => {
    // Arrange
    const variants: FormData["variants"] = [
      {
        __typename: "ProductVariant",
        channelListings: [],
        id: "variant-1",
        name: "Size M",
        sku: "sku-1",
        product: {
          __typename: "Product",
          id: "prod-1",
          name: "T-Shirt",
          thumbnail: {
            url: "thumb.jpg",
            __typename: "Image",
          },
          productType: {
            id: "type-1",
            name: "Clothing",
            __typename: "ProductType",
          },
        },
      },
    ];

    // Act
    const result = mapLocalVariantsToSavedVariants(variants);

    // Assert
    expect(result).toEqual({
      __typename: "ProductVariantCountableConnection",
      edges: [
        {
          node: {
            __typename: "ProductVariant",
            id: "variant-1",
            name: "Size M",
            product: {
              __typename: "Product",
              id: "prod-1",
              name: "T-Shirt",
              thumbnail: {
                __typename: "Image",
                url: "thumb.jpg",
              },
              productType: {
                __typename: "ProductType",
                id: "type-1",
                name: "Clothing",
              },
            },
          },
        },
      ],
    });
  });

  it("should correctly map multiple variants", () => {
    // Arrange
    const variants: FormData["variants"] = [
      {
        __typename: "ProductVariant",
        sku: "sku-1",
        channelListings: [],
        id: "variant-1",
        name: "Size M",
        product: {
          __typename: "Product",
          id: "prod-1",
          name: "T-Shirt",
          thumbnail: {
            url: "thumb1.jpg",
            __typename: "Image",
          },
          productType: {
            __typename: "ProductType",
            id: "type-1",
            name: "Clothing",
          },
        },
      },
      {
        __typename: "ProductVariant",
        sku: "sku-1",
        channelListings: [],
        id: "variant-2",
        name: "Size L",
        product: {
          __typename: "Product",
          id: "prod-2",
          name: "Pants",
          thumbnail: {
            url: "thumb2.jpg",
            __typename: "Image",
          },
          productType: {
            __typename: "ProductType",
            id: "type-2",
            name: "Bottoms",
          },
        },
      },
    ];

    // Act
    const result = mapLocalVariantsToSavedVariants(variants);

    // Assert
    expect(result.edges).toHaveLength(2);
    expect(result.edges[0].node.id).toBe("variant-1");
    expect(result.edges[1].node.id).toBe("variant-2");
    expect(result.edges[0].node.product.name).toBe("T-Shirt");
    expect(result.edges[1].node.product.name).toBe("Pants");
  });
});

describe("getFilteredProductVariants", () => {
  it("should return empty array when no products available", () => {
    // Arrange
    const data = {
      variants: [],
    } as unknown as FormData;

    const searchOpts = {
      data: {
        search: {
          edges: [],
        },
      },
    } as unknown as SearchProductsOpts;

    // Act
    const result = getFilteredProductVariants(data, searchOpts);

    // Assert
    expect(result).toEqual([]);
  });

  it("should filter out excluded variants from products", () => {
    // Arrange
    const data = {
      variants: [{ id: "variant-1" }, { id: "variant-3" }],
    } as FormData;

    const searchOpts = {
      data: {
        search: {
          edges: [
            {
              node: {
                id: "prod-1",
                variants: [{ id: "variant-1" }, { id: "variant-2" }, { id: "variant-3" }],
              },
            },
          ],
        },
      },
    } as SearchProductsOpts;

    // Act
    const result = getFilteredProductVariants(data, searchOpts);

    // Assert
    expect(result).toHaveLength(1);
    expect(result![0].variants).toHaveLength(1);
    expect(result![0].variants[0].id).toBe("variant-2");
  });

  it("should handle null variants in products", () => {
    // Arrange
    const data = {
      variants: [{ id: "variant-1" }],
    } as FormData;

    const searchOpts = {
      data: {
        search: {
          edges: [
            {
              node: {
                id: "prod-1",
                variants: null,
              },
            },
          ],
        },
      },
    } as SearchProductsOpts;

    // Act
    const result = getFilteredProductVariants(data, searchOpts);

    // Assert
    expect(result).toHaveLength(1);
    expect(result![0].variants).toEqual([]);
  });

  it("should maintain product structure while filtering variants", () => {
    // Arrange
    const data = {
      variants: [{ id: "variant-1" }],
    } as FormData;

    const searchOpts = {
      data: {
        search: {
          edges: [
            {
              node: {
                id: "prod-1",
                name: "Test Product",
                variants: [{ id: "variant-1" }, { id: "variant-2" }],
              },
            },
          ],
        },
      },
    } as SearchProductsOpts;

    // Act
    const result = getFilteredProductVariants(data, searchOpts);

    // Assert
    expect(result![0]).toMatchObject({
      id: "prod-1",
      name: "Test Product",
      variants: [{ id: "variant-2" }],
    });
  });
});
