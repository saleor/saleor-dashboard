// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import {
  ProductErrorCode,
  ProductVariantBulkCreateMutation,
  ProductVariantBulkErrorCode,
  ProductVariantBulkErrorFragment,
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
  return result.data.productVariantBulkCreate.errors.map<ProductVariantListError>(error => ({
    __typename: "DatagridError",
    type: "create",
    index: error.index,
    error: error.code,
  }));
}

export function getVariantUpdateMutationErrors(
  mutationResult: FetchResult<ProductVariantBulkUpdateMutation>,
  varaintsIds: string[],
): ProductVariantListError[] {
  const { productVariantBulkUpdate } = mutationResult.data;
  const generalErrors = productVariantBulkUpdate.errors;
  const variantsErrors = productVariantBulkUpdate.results.flatMap(res => res.errors);
  const allErrors = [...generalErrors, ...variantsErrors];

  return [
    ...getChannelErrors(allErrors, varaintsIds),
    ...getStockErrors(allErrors, varaintsIds),
    ...getRestOfErrors(allErrors, varaintsIds),
  ];
}

function getChannelErrors(errors: ProductVariantBulkErrorFragment[], varaintsIds: string[]) {
  return errors.reduce<ProductVariantListError[]>((acc, error, index) => {
    if (error.channels?.length) {
      const variantId = varaintsIds[index];

      acc.push({
        __typename: "DatagridError",
        type: "channel",
        error: error.code,
        variantId,
        channelIds: error.channels,
      });
    }

    return acc;
  }, []);
}

function getStockErrors(errors: ProductVariantBulkErrorFragment[], varaintsIds: string[]) {
  return errors.reduce<ProductVariantListError[]>((acc, error, index) => {
    if (error.warehouses?.length) {
      const variantId = varaintsIds[index];

      acc.push(
        ...error.warehouses.map(
          warehouse =>
            ({
              __typename: "DatagridError",
              variantId,
              warehouseId: warehouse,
              type: "stock",
            }) as const,
        ),
      );
    }

    return acc;
  }, []);
}

function getRestOfErrors(errors: ProductVariantBulkErrorFragment[], varaintsIds: string[]) {
  return errors.reduce<ProductVariantListError[]>((acc, error, index) => {
    if (!error.warehouses?.length && !error.channels?.length) {
      const variantId = varaintsIds[index];

      acc.push({
        __typename: "DatagridError",
        type: "variantData",
        variantId,
        error: error.code,
        attributes: error.attributes,
        field: error.field,
      });
    }

    return acc;
  }, []);
}
