import { FetchResult } from "@apollo/client";
import {
  ProductChannelListingUpdateMutation,
  ProductErrorCode,
  ProductVariantBulkCreateMutation,
  ProductVariantChannelListingUpdateMutation,
  ProductVariantChannelListingUpdateMutationVariables,
  StockInput,
  VariantDatagridStockUpdateMutation,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutation,
  VariantDatagridUpdateMutationVariables,
} from "@saleor/graphql";
import { hasMutationErrors } from "@saleor/misc";

export type ProductVariantListError =
  | {
      __typename: "DatagridError";
      attributes: string[] | null;
      error: ProductErrorCode;
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
      error: ProductErrorCode;
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

export function getProductVariantListErrors(
  productChannelsUpdateResult: FetchResult<ProductChannelListingUpdateMutation>,
  variantMutationResults: FetchResult[],
): ProductVariantListError[] {
  return [productChannelsUpdateResult, ...variantMutationResults]
    .filter(hasMutationErrors)
    .flatMap(result => {
      if (result.data.productVariantChannelListingUpdate) {
        const data = result.data as ProductVariantChannelListingUpdateMutation;
        return data.productVariantChannelListingUpdate.errors.map<
          ProductVariantListError
        >(error => ({
          __typename: "DatagridError",
          type: "channel",
          error: error.code,
          variantId: (result.extensions
            .variables as ProductVariantChannelListingUpdateMutationVariables)
            .id,
          channelIds: error.channels,
        }));
      }

      if (result.data.productVariantStocksUpdate) {
        const data = result.data as VariantDatagridStockUpdateMutation;
        const variables = result.extensions
          .variables as VariantDatagridStockUpdateMutationVariables;
        return [
          ...data.productVariantStocksUpdate.errors.map<
            ProductVariantListError
          >(error => ({
            __typename: "DatagridError",
            type: "stock",
            variantId: (variables as VariantDatagridStockUpdateMutationVariables)
              .id,
            warehouseId: (variables.stocks as StockInput[])[error.index]
              .warehouse,
          })),
          ...data.productVariantStocksDelete.errors.map<
            ProductVariantListError
          >(() => ({
            __typename: "DatagridError",
            type: "stock",
            variantId: (variables as VariantDatagridStockUpdateMutationVariables)
              .id,
            warehouseId: null,
          })),
        ];
      }

      if (result.data.productVariantUpdate) {
        const data = result.data as VariantDatagridUpdateMutation;
        const variables = result.extensions
          .variables as VariantDatagridUpdateMutationVariables;
        return data.productVariantUpdate.errors.map<ProductVariantListError>(
          error => ({
            __typename: "DatagridError",
            type: "variantData",
            variantId: (variables as VariantDatagridUpdateMutationVariables).id,
            error: error.code,
            attributes: error.attributes,
          }),
        );
      }

      if (result.data.productVariantBulkCreate) {
        const data = result.data as ProductVariantBulkCreateMutation;
        return data.productVariantBulkCreate.errors.map<
          ProductVariantListError
        >(error => ({
          __typename: "DatagridError",
          type: "create",
          index: error.index,
          error: error.code,
        }));
      }
    });
}
