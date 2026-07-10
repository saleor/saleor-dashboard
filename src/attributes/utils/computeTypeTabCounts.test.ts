import {
  computePageTypeTabCounts,
  computeProductTypeTabCounts,
} from "@dashboard/attributes/utils/computeTypeTabCounts";
import {
  type PageTypeListWithAssignedAttributeCountsQuery,
  ProductTypeKindEnum,
  type ProductTypeListWithAssignedAttributeCountsQuery,
} from "@dashboard/graphql";

type ProductTypesConnection = NonNullable<
  ProductTypeListWithAssignedAttributeCountsQuery["productTypes"]
>;
type ProductTypeNode = ProductTypesConnection["edges"][number]["node"];

const emptyPageInfo = {
  __typename: "PageInfo" as const,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
};

const createProductTypeTabCountsQuery = (
  productType: ProductTypeNode,
): ProductTypeListWithAssignedAttributeCountsQuery => ({
  __typename: "Query",
  productTypes: {
    __typename: "ProductTypeCountableConnection",
    edges: [
      {
        __typename: "ProductTypeCountableEdge",
        node: productType,
      },
    ],
    pageInfo: emptyPageInfo,
  },
});

const createProductTypeNode = (
  attributes: Pick<ProductTypeNode, "productAttributes" | "variantAttributes">,
): ProductTypeNode => ({
  __typename: "ProductType",
  id: "pt-1",
  name: "Default",
  slug: "default",
  kind: ProductTypeKindEnum.NORMAL,
  hasVariants: true,
  isShippingRequired: true,
  taxClass: null,
  ...attributes,
});

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
        pageInfo: emptyPageInfo,
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

describe("computeProductTypeTabCounts", () => {
  it("should build counts from product and variant attribute ids", () => {
    // Arrange
    const data = createProductTypeTabCountsQuery(
      createProductTypeNode({
        productAttributes: [
          { __typename: "Attribute", id: "a-1" },
          { __typename: "Attribute", id: "a-2" },
        ],
        variantAttributes: [{ __typename: "Attribute", id: "a-3" }],
      }),
    );

    // Act
    const result = computeProductTypeTabCounts(data);

    // Assert
    expect(result).toEqual({
      "pt-1": { value: 3, hasMore: false },
    });
  });

  it("should dedupe attribute ids shared between product and variant attributes", () => {
    // Arrange
    const data = createProductTypeTabCountsQuery(
      createProductTypeNode({
        productAttributes: [
          { __typename: "Attribute", id: "a-1" },
          { __typename: "Attribute", id: "a-2" },
        ],
        variantAttributes: [
          { __typename: "Attribute", id: "a-2" },
          { __typename: "Attribute", id: "a-3" },
        ],
      }),
    );

    // Act
    const result = computeProductTypeTabCounts(data);

    // Assert
    expect(result).toEqual({
      "pt-1": { value: 3, hasMore: false },
    });
  });
});
