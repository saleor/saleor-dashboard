import { type FetchResult } from "@apollo/client";
import { ProductErrorCode, type ProductVariantBulkCreateMutation } from "@dashboard/graphql";

import { getCreateVariantMutationError } from "./errors";

const buildCreateResult = (
  errorIndexes: number[],
): FetchResult<ProductVariantBulkCreateMutation> => ({
  data: {
    __typename: "Mutation",
    productVariantBulkCreate: {
      __typename: "ProductVariantBulkCreate",
      errors: errorIndexes.map(index => ({
        __typename: "BulkProductError" as const,
        field: null,
        code: ProductErrorCode.INVALID,
        index,
        channels: null,
        message: null,
      })),
      results: [],
      productVariants: [],
    },
  },
});

describe("getCreateVariantMutationError", () => {
  it("keeps the API index, which is the staged create position", () => {
    // Arrange
    const result = buildCreateResult([0, 2]);

    // Act
    const errors = getCreateVariantMutationError(result);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "DatagridError",
        type: "create",
        index: 0,
        error: ProductErrorCode.INVALID,
      },
      {
        __typename: "DatagridError",
        type: "create",
        index: 2,
        error: ProductErrorCode.INVALID,
      },
    ]);
  });
});
