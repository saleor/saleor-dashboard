import { FetchResult } from "@apollo/client";
import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import { prepareAttributesInput } from "@saleor/attributes/utils/handlers";
import { VALUES_PAGINATE_BY } from "@saleor/config";
import {
  FileUploadMutation,
  ProductChannelListingAddInput,
  ProductChannelListingUpdateMutationVariables,
  ProductFragment,
} from "@saleor/graphql";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/types";
import { getColumnChannelAvailability } from "@saleor/products/components/ProductVariants/utils";
import { getAttributeInputFromProduct } from "@saleor/products/utils/data";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import pick from "lodash/pick";
import uniq from "lodash/uniq";

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
  const channels = uniq([
    ...product.channelListings.map(listing => listing.channel.id),
    ...data.channels.updateChannels.map(listing => listing.channelId),
  ]);

  const dataUpdated = new Map<string, ProductChannelListingAddInput>();
  data.channels.updateChannels
    .map(listing =>
      pick(
        listing,
        // Filtering it here so we send only fields defined in input schema
        [
          "availableForPurchaseAt",
          "availableForPurchaseDate",
          "channelId",
          "isAvailableForPurchase",
          "isPublished",
          "publicationDate",
          "publishedAt",
          "visibleInListings",
        ] as Array<keyof ProductChannelListingAddInput>,
      ),
    )
    .forEach(listing => dataUpdated.set(listing.channelId, listing));

  const variantsUpdates = new Map<string, ProductChannelListingAddInput>();
  channels
    .map(channelId => ({
      channelId,
      addVariants: data.variants.updates
        .filter(
          change =>
            !data.variants.added.includes(change.row) &&
            channelId === getColumnChannelAvailability(change.column) &&
            change.data,
        )
        .map(change => product.variants[change.row].id),
      removeVariants: data.variants.updates
        .filter(
          change =>
            product.variants[change.row] &&
            channelId === getColumnChannelAvailability(change.column) &&
            !change.data,
        )
        .map(change => product.variants[change.row].id),
    }))
    .filter(
      listing =>
        listing.addVariants.length > 0 || listing.removeVariants.length > 0,
    )
    .forEach(listing => variantsUpdates.set(listing.channelId, listing));

  const updateChannels = channels
    .filter(
      channelId => dataUpdated.has(channelId) || variantsUpdates.has(channelId),
    )
    .map(channelId => ({
      ...dataUpdated.get(channelId),
      ...variantsUpdates.get(channelId),
    }));

  return {
    id: product.id,
    input: {
      ...data.channels,
      updateChannels,
    },
  };
}
