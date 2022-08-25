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
  BulkStockErrorFragment,
  FileUploadMutation,
  FileUploadMutationVariables,
  ProductChannelListingUpdateMutation,
  ProductChannelListingUpdateMutationVariables,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  ProductUpdateMutationFn,
  ProductVariantChannelListingUpdateMutation,
  ProductVariantChannelListingUpdateMutationVariables,
  StockErrorFragment,
  UploadErrorFragment,
  VariantCreateMutation,
  VariantCreateMutationVariables,
} from "@saleor/graphql";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";

import {
  getChannelsVariables,
  getProductUpdateVariables,
  getSimpleChannelsVariables,
  getVariantChannelsInput,
} from "./utils";

export type SimpleProductUpdateError =
  | ProductErrorWithAttributesFragment
  | StockErrorFragment
  | BulkStockErrorFragment
  | AttributeErrorFragment
  | UploadErrorFragment;

export function createSimpleProductUpdateHandler(
  product: ProductFragment,
  allChannels: ChannelData[],
  uploadFile: (
    variables: FileUploadMutationVariables,
  ) => Promise<FetchResult<FileUploadMutation>>,
  updateProduct: ProductUpdateMutationFn,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductChannelListingUpdateMutation>>,
  updateVariantChannels: (options: {
    variables: ProductVariantChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductVariantChannelListingUpdateMutation>>,
  productVariantCreate: (options: {
    variables: VariantCreateMutationVariables;
  }) => Promise<FetchResult<VariantCreateMutation>>,
  deleteAttributeValue: (
    variables: AttributeValueDeleteMutationVariables,
  ) => Promise<FetchResult<AttributeValueDeleteMutation>>,
) {
  return async (
    data: ProductUpdateSubmitData,
  ): Promise<SimpleProductUpdateError[]> => {
    let errors: SimpleProductUpdateError[] = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      uploadFile,
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

    if (product.variants.length) {
      const result = await updateProduct({
        variables: getProductUpdateVariables(product, data, uploadFilesResult),
      });
      errors = [...errors, ...result.data.productUpdate.errors];

      await updateChannels({
        variables: getSimpleChannelsVariables(data, product),
      });

      updateVariantChannels({
        variables: {
          id: product.variants[0].id,
          input: getVariantChannelsInput(data),
        },
      });
      // Failsafe if somehow product did not have any variant created before
    } else {
      const productVariantResult = await productVariantCreate({
        variables: {
          input: {
            attributes:
              product.productType.variantAttributes?.map(attribute => ({
                id: attribute.id,
                values: attribute.choices.edges.map(value => value.node.slug),
              })) || [],
            product: product.id,
            sku: data.sku,
          },
        },
      });
      errors = [
        ...errors,
        ...productVariantResult.data.productVariantCreate.errors,
      ];

      const variantId =
        productVariantResult.data.productVariantCreate?.productVariant?.id;

      if (variantId) {
        updateVariantChannels({
          variables: {
            id: variantId,
            input: getVariantChannelsInput(data),
          },
        });

        await updateChannels({
          variables: getChannelsVariables(product, allChannels, data),
        });

        const result = await updateProduct({
          variables: getProductUpdateVariables(
            product,
            data,
            uploadFilesResult,
          ),
        });
        errors = [...errors, ...result.data.productUpdate.errors];
      }
    }

    return errors;
  };
}
