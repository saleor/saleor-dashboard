import { FetchResult } from "@apollo/client";
import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import { prepareAttributesInput } from "@saleor/attributes/utils/handlers";
import { VALUES_PAGINATE_BY } from "@saleor/config";
import {
  FileUploadMutation,
  ProductChannelListingAddInput,
  ProductChannelListingUpdateMutationVariables,
  ProductFragment,
  ProductUpdateMutationVariables,
} from "@saleor/graphql";
import { weight } from "@saleor/misc";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { getAttributeInputFromProduct } from "@saleor/products/utils/data";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import pick from "lodash/pick";

export const getSimpleProductVariables = (
  productVariables: ProductUpdateMutationVariables,
  data: ProductUpdateSubmitData,
  productId: string,
) => ({
  ...productVariables,
  input: {
    ...productVariables.input,
    weight: weight(data.weight),
  },
  productVariantId: productId,
  productVariantInput: {
    sku: data.sku,
    trackInventory: data.trackInventory,
    preorder: data.isPreorder
      ? {
          globalThreshold: data.globalThreshold
            ? parseInt(data.globalThreshold, 10)
            : null,
          endDate: data.preorderEndDateTime,
        }
      : undefined,
  },
});

export function getProductUpdateVariables(
  product: ProductFragment,
  data: ProductUpdateSubmitData,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
) {
  const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
    data.attributesWithNewFileValue,
    uploadFilesResult,
  );

  return {
    id: product.id,
    input: {
      attributes: prepareAttributesInput({
        attributes: data.attributes,
        prevAttributes: getAttributeInputFromProduct(product),
        updatedFileAttributes,
      }),
      category: data.category,
      chargeTaxes: data.chargeTaxes,
      collections: data.collections,
      description: getParsedDataForJsonStringField(data.description),
      name: data.name,
      rating: data.rating,
      seo: {
        description: data.seoDescription,
        title: data.seoTitle,
      },
      slug: data.slug,
      taxCode: data.changeTaxCode ? data.taxCode : null,
    },
    firstValues: VALUES_PAGINATE_BY,
  };
}

export function getProductChannelsUpdateVariables(
  product: ProductFragment,
  data: ProductUpdateSubmitData,
): ProductChannelListingUpdateMutationVariables {
  return {
    id: product.id,
    input: {
      ...data.channels,
      updateChannels: data.channels.updateChannels.map(channel =>
        pick(
          {
            ...channel,
            addVariants: [],
            removeVariants: [],
          },
          // Filtering it here so we send only fields defined in input schema
          [
            "addVariants",
            "availableForPurchaseAt",
            "availableForPurchaseDate",
            "channelId",
            "isAvailableForPurchase",
            "isPublished",
            "publicationDate",
            "publishedAt",
            "removeVariants",
            "visibleInListings",
          ] as Array<keyof ProductChannelListingAddInput>,
        ),
      ),
    },
  };
}
