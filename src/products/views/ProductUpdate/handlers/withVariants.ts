import { FetchResult } from "@apollo/client";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { ChannelData } from "@saleor/channels/utils";
import { VALUES_PAGINATE_BY } from "@saleor/config";
import {
  AttributeErrorFragment,
  AttributeValueDeleteMutation,
  AttributeValueDeleteMutationVariables,
  FileUploadMutationFn,
  ProductChannelListingUpdateMutation,
  ProductChannelListingUpdateMutationVariables,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  ProductUpdateMutation,
  ProductUpdateMutationVariables,
  UploadErrorFragment
} from "@saleor/graphql";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import { getAttributeInputFromProduct } from "@saleor/products/utils/data";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";

import { getChannelsVariables } from "./utils";

export type ProductWithVariantsUpdateError =
  | ProductErrorWithAttributesFragment
  | AttributeErrorFragment
  | UploadErrorFragment;

export function createProductWithVariantsUpdateHandler(
  product: ProductFragment,
  allChannels: ChannelData[],
  uploadFile: FileUploadMutationFn,
  updateProduct: (
    variables: ProductUpdateMutationVariables
  ) => Promise<FetchResult<ProductUpdateMutation>>,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductChannelListingUpdateMutation>>,
  deleteAttributeValue: (
    variables: AttributeValueDeleteMutationVariables
  ) => Promise<FetchResult<AttributeValueDeleteMutation>>
) {
  return async (
    data: ProductUpdatePageSubmitData
  ): Promise<ProductWithVariantsUpdateError[]> => {
    let errors: ProductWithVariantsUpdateError[] = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables })
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      deleteAttributeValue
    );

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult)
    ];
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult
    );

    const productVariables: ProductUpdateMutationVariables = {
      id: product.id,
      input: {
        attributes: prepareAttributesInput({
          attributes: data.attributes,
          prevAttributes: getAttributeInputFromProduct(product),
          updatedFileAttributes
        }),
        category: data.category,
        chargeTaxes: data.chargeTaxes,
        collections: data.collections,
        description: getParsedDataForJsonStringField(data.description),
        name: data.name,
        rating: data.rating,
        seo: {
          description: data.seoDescription,
          title: data.seoTitle
        },
        slug: data.slug,
        taxCode: data.changeTaxCode ? data.taxCode : null
      },
      firstValues: VALUES_PAGINATE_BY
    };

    const result = await updateProduct(productVariables);
    errors = [...errors, ...result.data.productUpdate.errors];

    await updateChannels(getChannelsVariables(product, allChannels, data));

    return errors;
  };
}
