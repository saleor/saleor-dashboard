import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
  mapLocalVariantsToSavedVariants,
} from "@dashboard/discounts/components/VoucherCreatePage/utils";
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
    const result = mapLocalVariantsToSavedVariants([]);

    expect(result).toEqual({
      __typename: "ProductVariantCountableConnection",
      edges: [],
    });
  });

  it("should correctly map single variant", () => {
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

    const result = mapLocalVariantsToSavedVariants(variants);

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

    const result = mapLocalVariantsToSavedVariants(variants);

    expect(result.edges).toHaveLength(2);
    expect(result.edges[0].node.id).toBe("variant-1");
    expect(result.edges[1].node.id).toBe("variant-2");
    expect(result.edges[0].node.product.name).toBe("T-Shirt");
    expect(result.edges[1].node.product.name).toBe("Pants");
  });
});
