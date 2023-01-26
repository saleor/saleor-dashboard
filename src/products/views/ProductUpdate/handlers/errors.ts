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
): ProductVariantListError[] {
  const variables = mutationResult.extensions.variables;
  return mutationResult.data.productVariantBulkUpdate.errors.reduce<
    ProductVariantListError[]
  >((acc, error) => {
    if (error.channels.length) {
      acc.push({
        __typename: "DatagridError",
        type: "channel",
        error: error.code,
        variantId: variables.id,
        channelIds: error.channels,
      });
    }

    if (error.warehouses.length) {
      acc.push(
        ...error.warehouses.map(
          warehouse =>
            ({
              __typename: "DatagridError",
              variantId: variables.id,
              warehouseId: warehouse,
              type: "stock",
            } as const),
        ),
      );
    }

    acc.push({
      __typename: "DatagridError",
      type: "variantData",
      variantId: variables.id,
      error: error.code,
      attributes: error.attributes,
    });

    return acc;
  }, []);
}
