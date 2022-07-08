import { FetchResult } from "@apollo/client";
import {
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
} from "@saleor/attributes/utils/handlers";
import { ChannelData } from "@saleor/channels/utils";
import {
  AttributeErrorFragment,
  AttributeValueDeleteMutation,
  AttributeValueDeleteMutationVariables,
  FileUploadMutationFn,
  ProductChannelListingUpdateMutation,
  ProductChannelListingUpdateMutationVariables,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  ProductUpdateMutationFn,
  UploadErrorFragment,
  VariantDatagridStockUpdateMutationFn,
} from "@saleor/graphql";
import { getMutationErrors } from "@saleor/misc";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { getStocks } from "@saleor/products/components/ProductVariants/utils";

import { getChannelsVariables, getProductUpdateVariables } from "./utils";

export type ProductWithVariantsUpdateError =
  | ProductErrorWithAttributesFragment
  | AttributeErrorFragment
  | UploadErrorFragment;

export function createProductWithVariantsUpdateHandler(
  product: ProductFragment,
  allChannels: ChannelData[],
  uploadFile: FileUploadMutationFn,
  updateProduct: ProductUpdateMutationFn,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductChannelListingUpdateMutation>>,
  deleteAttributeValue: (
    variables: AttributeValueDeleteMutationVariables,
  ) => Promise<FetchResult<AttributeValueDeleteMutation>>,
  updateStocks: VariantDatagridStockUpdateMutationFn,
) {
  return async (
    data: ProductUpdateSubmitData,
  ): Promise<ProductWithVariantsUpdateError[]> => {
    let errors: ProductWithVariantsUpdateError[] = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      deleteAttributeValue,
    );

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
    ];

    const result = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });
    errors = [...errors, ...result.data.productUpdate.errors];

    const stockUpdateResult = await Promise.all(
      getStocks(product.variants, data.variants).map(variables =>
        updateStocks({
          variables,
        }),
      ),
    );
    errors = [...errors, ...stockUpdateResult.map(getMutationErrors).flat()];

    await updateChannels({
      variables: getChannelsVariables(product, allChannels, data),
    });

    return errors;
  };
}
