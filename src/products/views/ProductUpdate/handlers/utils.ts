import { FetchResult } from "@apollo/client";
import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import { prepareAttributesInput } from "@saleor/attributes/utils/handlers";
import {
  ChannelData,
  createSortedChannelsDataFromProduct,
} from "@saleor/channels/utils";
import { VALUES_PAGINATE_BY } from "@saleor/config";
import {
  FileUploadMutation,
  ProductChannelListingAddInput,
  ProductChannelListingUpdateMutationVariables,
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductUpdateMutationVariables,
} from "@saleor/graphql";
import { weight } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { getAttributeInputFromProduct } from "@saleor/products/utils/data";
import { getAvailabilityVariables } from "@saleor/products/utils/handlers";
import { arrayDiff } from "@saleor/utils/arrays";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";

import { ChannelWithVariantData } from "../types";
import { getParsedChannelsWithVariantsDataFromChannels } from "../utils";

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

const shouldRemoveChannel = (allVariants: ProductDetailsVariantFragment[]) => ({
  removeVariants,
}: ProductChannelListingAddInput) =>
  isRemovingAllVariants(allVariants, removeVariants);

const isRemovingAllVariants = (
  allVariants: ProductDetailsVariantFragment[],
  removeVariants: string[],
) => !!removeVariants.length && removeVariants.length === allVariants.length;

const shouldUpdateChannel = (
  initialChannelWithVariantData: Record<string, ChannelWithVariantData>,
  allVariants: ProductDetailsVariantFragment[],
  allChannels: ChannelData[],
) => ({
  removeVariants,
  addVariants,
  channelId,
  ...rest
}: ProductChannelListingAddInput) => {
  const initialChannelData = allChannels.find(getById(channelId));
  const initialDataInput = {
    ...initialChannelData,
    channelId,
    addVariants: initialChannelWithVariantData[channelId].variantsIdsToAdd,
    removeVariants:
      initialChannelWithVariantData[channelId].variantsIdsToRemove,
  };

  const hasDataChanged = !isEqual(
    { removeVariants, addVariants, channelId, ...rest },
    initialDataInput,
  );

  const isRemovingChannel = isRemovingAllVariants(allVariants, removeVariants);

  return hasDataChanged && !isRemovingChannel;
};

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

export const getChannelsVariables = (
  { id, variants }: Pick<ProductFragment, "id" | "variants">,
  allChannels: ChannelData[],
  {
    channelsWithVariants,
    channelsData,
  }: Pick<ProductUpdateSubmitData, "channelsWithVariants" | "channelsData">,
): ProductChannelListingUpdateMutationVariables => {
  const initialChannelWithVariants = getParsedChannelsWithVariantsDataFromChannels(
    channelsData,
  );

  const listings = channelsData.map(
    ({ id, availableForPurchase, ...rest }) => ({
      ...rest,
      channelId: id,
      availableForPurchaseDate: availableForPurchase,
      addVariants: arrayDiff(
        initialChannelWithVariants[id].availableVariants,
        channelsWithVariants[id].variantsIdsToAdd,
      ).added,
      removeVariants: channelsWithVariants[id].variantsIdsToRemove,
    }),
  );

  const channelsToBeUpdated = listings
    .filter(
      shouldUpdateChannel(initialChannelWithVariants, variants, allChannels),
    )
    .map(input =>
      pick(input, [
        "availableForPurchaseDate",
        "isAvailableForPurchase",
        "isPublished",
        "publicationDate",
        "channelId",
        "visibleInListings",
        "addVariants",
        "removeVariants",
      ]),
    );

  const channelsIdsToBeRemoved = listings
    .filter(shouldRemoveChannel(variants))
    .map(({ channelId }) => channelId);

  return {
    id,
    input: {
      updateChannels: channelsToBeUpdated,
      removeChannels: channelsIdsToBeRemoved,
    },
  };
};

export const getSimpleChannelsVariables = (
  data: ProductUpdateSubmitData,
  product: ProductFragment,
): ProductChannelListingUpdateMutationVariables => {
  const productChannels = createSortedChannelsDataFromProduct(product);
  const existingChannelIDs = productChannels.map(channel => channel.id);
  const modifiedChannelIDs = data.channelListings.map(channel => channel.id);

  const removedChannelIDs = existingChannelIDs.filter(
    x => !modifiedChannelIDs.includes(x),
  );

  return {
    id: product.id,
    input: {
      updateChannels: getAvailabilityVariables(data.channelListings),
      removeChannels: removedChannelIDs,
    },
  };
};

export const getVariantChannelsInput = ({
  channelListings,
}: ProductUpdateSubmitData) =>
  channelListings.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price,
    preorderThreshold: listing.preorderThreshold,
  }));
