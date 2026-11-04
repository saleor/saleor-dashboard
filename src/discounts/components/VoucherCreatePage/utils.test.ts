import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
  getAssignedVariantIdsFromForm,
  getCreateCatalogueLists,
  mapLocalVariantsToSavedVariants,
} from "@dashboard/discounts/components/VoucherCreatePage/utils";
import {
  type CategoryWithTotalProductsFragment,
  type CollectionWithTotalProductsFragment,
  type SearchProductFragment,
} from "@dashboard/graphql";

import { type FormData, VoucherCreatePageTab, type VoucherCreateProductVariant } from "./types";

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
    jest.spyOn(crypto, "randomUUID").mockReturnValue("1-2-3-4-5");

    // Act
    const draftVoucherCodes = generateMultipleVoucherCodes("2", "test");

    // Assert
    expect(draftVoucherCodes).toEqual([
      { code: "test-1-2-3-4-5", status: "Draft" },
      { code: "test-1-2-3-4-5", status: "Draft" },
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

describe("getAssignedVariantIdsFromForm", () => {
  it("should return assigned variant ids from form state", () => {
    // Arrange
    const data = {
      variants: [{ id: "variant-1" }, { id: "variant-3" }],
    } as FormData;

    // Act
    const result = getAssignedVariantIdsFromForm(data);

    // Assert
    expect(result).toEqual(["variant-1", "variant-3"]);
  });

  it("should return an empty list when no variants are assigned", () => {
    // Arrange
    const data = {
      variants: [],
    } as unknown as FormData;

    // Act
    const result = getAssignedVariantIdsFromForm(data);

    // Assert
    expect(result).toEqual([]);
  });
});

describe("getCreateCatalogueLists", () => {
  const category: CategoryWithTotalProductsFragment = {
    __typename: "Category",
    id: "category-1",
    name: "Accessories",
    products: { __typename: "ProductCountableConnection", totalCount: 4 },
  };
  const collection: CollectionWithTotalProductsFragment = {
    __typename: "Collection",
    id: "collection-1",
    name: "Summer Picks",
    products: { __typename: "ProductCountableConnection", totalCount: 2 },
  };
  const product: SearchProductFragment = {
    __typename: "Product",
    id: "product-1",
    name: "Monospace Tee",
    productType: { __typename: "ProductType", id: "type-1", name: "Clothing" },
    thumbnail: null,
    channelListings: [],
    collections: [],
    category: null,
  };
  const variant: VoucherCreateProductVariant = {
    __typename: "ProductVariant",
    id: "variant-1",
    name: "Size M",
    sku: "sku-1",
    channelListings: [],
    product: {
      __typename: "Product",
      id: "product-1",
      name: "Monospace Tee",
      thumbnail: null,
      productType: { __typename: "ProductType", id: "type-1", name: "Clothing" },
    },
  };

  it.each([
    {
      activeTab: VoucherCreatePageTab.categories,
      expected: { categories: [category] },
      item: category,
    },
    {
      activeTab: VoucherCreatePageTab.collections,
      expected: { collections: [collection] },
      item: collection,
    },
    { activeTab: VoucherCreatePageTab.products, expected: { products: [product] }, item: product },
  ])(
    "gives $activeTab only to the $activeTab list, without reading them as variants",
    ({ activeTab, expected, item }) => {
      // Arrange
      const pageItems = [item];

      // Act
      const result = getCreateCatalogueLists({ activeTab, pageItems });

      // Assert
      expect(result).toEqual({
        categories: [],
        collections: [],
        products: [],
        variants: null,
        ...expected,
      });
    },
  );

  it("maps variants into a connection on the variants tab", () => {
    // Arrange
    const pageItems = [variant];

    // Act
    const result = getCreateCatalogueLists({ activeTab: VoucherCreatePageTab.variants, pageItems });

    // Assert
    expect(result).toEqual({
      categories: [],
      collections: [],
      products: [],
      variants: mapLocalVariantsToSavedVariants([variant]),
    });
  });
});
