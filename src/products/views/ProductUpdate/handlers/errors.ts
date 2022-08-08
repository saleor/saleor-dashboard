import { FetchResult } from "@apollo/client";
import {
  ProductChannelListingUpdateMutation,
  ProductErrorCode,
  ProductVariantChannelListingUpdateMutation,
  ProductVariantChannelListingUpdateMutationVariables,
  StockInput,
  VariantDatagridStockUpdateMutation,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutation,
  VariantDatagridUpdateMutationVariables,
} from "@saleor/graphql";
import { hasMutationErrors } from "@saleor/misc";

export type DatagridError =
  | {
      attributes: string[] | null;
      error: ProductErrorCode;
      variantId: string;
      type: "variantData";
    }
  | {
      variantId: string;
      warehouseId: string;
      type: "stock";
    }
  | {
      error: ProductErrorCode;
      variantId: string;
      channelIds: string[];
      type: "channel";
    };

export function getDatagridErrors(
  productChannelsUpdateResult: FetchResult<ProductChannelListingUpdateMutation>,
  variantUpdateResults: FetchResult[],
): DatagridError[] {
  return [productChannelsUpdateResult, ...variantUpdateResults]
    .filter(hasMutationErrors)
    .flatMap(result => {
      if (result.data.productVariantChannelListingUpdate) {
        const data = result.data as ProductVariantChannelListingUpdateMutation;
        return data.productVariantChannelListingUpdate.errors.map<
          DatagridError
        >(error => ({
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
          ...data.productVariantStocksUpdate.errors.map<DatagridError>(
            error => ({
              type: "stock",
              variantId: (variables as VariantDatagridStockUpdateMutationVariables)
                .id,
              warehouseId: (variables.stocks as StockInput[])[error.index]
                .warehouse,
            }),
          ),
          ...data.productVariantStocksDelete.errors.map<DatagridError>(() => ({
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
        return data.productVariantUpdate.errors.map<DatagridError>(error => ({
          type: "variantData",
          variantId: (variables as VariantDatagridUpdateMutationVariables).id,
          error: error.code,
          attributes: error.attributes,
        }));
      }
    });
}
