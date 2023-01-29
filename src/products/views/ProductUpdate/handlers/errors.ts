import { FetchResult } from "@apollo/client";
import {
  ProductErrorCode,
  ProductVariantBulkCreateMutation,
  ProductVariantBulkErrorCode,
  ProductVariantBulkUpdateMutation,
} from "@dashboard/graphql";

export type ProductVariantListError =
  | {
      __typename: "DatagridError";
      attributes: string[] | null;
      error: ProductVariantBulkErrorCode;
      variantId: string;
      field?: string;
      type: "variantData";
    }
  | {
      __typename: "DatagridError";
      variantId: string;
      warehouseId: string;
      type: "stock";
    }
  | {
      __typename: "DatagridError";
      error: ProductVariantBulkErrorCode;
      variantId: string;
      channelIds: string[];
      type: "channel";
    }
  | {
      __typename: "DatagridError";
      error: ProductErrorCode;
      index: number;
      type: "create";
    };

export function getCreateVariantMutationError(
  result: FetchResult<ProductVariantBulkCreateMutation>,
): ProductVariantListError[] {
  return result.data.productVariantBulkCreate.errors.map<ProductVariantListError>(
    error => ({
      __typename: "DatagridError",
      type: "create",
      index: error.index,
      error: error.code,
    }),
  );
}

export function getVariantUpdateMutationErrors(
  mutationResult: FetchResult<ProductVariantBulkUpdateMutation>,
  varaintsIds: string[],
): ProductVariantListError[] {
  const { productVariantBulkUpdate } = mutationResult.data;
  const generalErrors = productVariantBulkUpdate.errors;
  const variantsErrors = productVariantBulkUpdate.results.flatMap(
    res => res.errors,
  );

  return [...generalErrors, ...variantsErrors].reduce<
    ProductVariantListError[]
  >((acc, error, index) => {
    const variantId = varaintsIds[index];

    if (error.channels?.length) {
      acc.push({
        __typename: "DatagridError",
        type: "channel",
        error: error.code,
        variantId,
        channelIds: error.channels,
      });
    }

    if (error.warehouses?.length) {
      acc.push(
        ...error.warehouses.map(
          warehouse =>
            ({
              __typename: "DatagridError",
              variantId,
              warehouseId: warehouse,
              type: "stock",
            } as const),
        ),
      );
    }

    acc.push({
      __typename: "DatagridError",
      type: "variantData",
      variantId,
      error: error.code,
      attributes: error.attributes,
      field: error.field,
    });
    return acc;
  }, []);
}
