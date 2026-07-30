import { type FetchResult } from "@apollo/client";
import { ProductErrorCode, type ProductVariantBulkCreateMutation } from "@dashboard/graphql";

import { type BulkCreateInputSource, getCreateVariantMutationError } from "./errors";

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
  it("keeps the API index when no input sources are provided", () => {
    // Arrange
    const result = buildCreateResult([2]);

    // Act
    const errors = getCreateVariantMutationError(result);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "DatagridError",
        type: "create",
        index: 2,
        stagedIndex: undefined,
        error: ProductErrorCode.INVALID,
      },
    ]);
  });

  it("maps API indexes back to grid-add positions and staged-create positions", () => {
    // Arrange - submitted inputs: [gridAdd#0, gridAdd#1, staged#0, staged#1]
    const sources: BulkCreateInputSource[] = [
      { gridIndex: 0 },
      { gridIndex: 1 },
      { stagedIndex: 0 },
      { stagedIndex: 1 },
    ];
    // API rejected the second grid row and the second staged row
    const result = buildCreateResult([1, 3]);

    // Act
    const errors = getCreateVariantMutationError(result, sources);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "DatagridError",
        type: "create",
        index: 1,
        stagedIndex: undefined,
        error: ProductErrorCode.INVALID,
      },
      {
        __typename: "DatagridError",
        type: "create",
        index: -1,
        stagedIndex: 1,
        error: ProductErrorCode.INVALID,
      },
    ]);
  });

  it("accounts for deduped inputs shifting API indexes", () => {
    // Arrange - a staged duplicate of a grid row was removed before submission,
    // so API index 1 is the first staged row that survived dedupe
    const sources: BulkCreateInputSource[] = [{ gridIndex: 0 }, { stagedIndex: 1 }];
    const result = buildCreateResult([1]);

    // Act
    const errors = getCreateVariantMutationError(result, sources);

    // Assert
    expect(errors).toEqual([
      {
        __typename: "DatagridError",
        type: "create",
        index: -1,
        stagedIndex: 1,
        error: ProductErrorCode.INVALID,
      },
    ]);
  });
});
