import {
  ChannelData,
  createSortedChannelsDataFromProduct
} from "@saleor/channels/utils";
import { weight } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import {
  ProductDetails_product,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import { ProductUpdateVariables } from "@saleor/products/types/ProductUpdate";
import { SimpleProductUpdate } from "@saleor/products/types/SimpleProductUpdate";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { getAvailabilityVariables } from "@saleor/products/utils/handlers";
import { ProductChannelListingAddInput } from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";
import isEqual from "lodash/isEqual";

import { ChannelsWithVariantsData, ChannelWithVariantData } from "../types";
import { getParsedChannelsWithVariantsDataFromChannels } from "../utils";

export const getSimpleProductVariables = (
  productVariables: ProductUpdateVariables,
  data: ProductUpdatePageSubmitData,
  productId: string
) => ({
  ...productVariables,
  addStocks: data.addStocks.map(mapFormsetStockToStockInput),
  deleteStocks: data.removeStocks,
  input: {
    ...productVariables.input,
    weight: weight(data.weight)
  },
  productVariantId: productId,
  productVariantInput: {
    sku: data.sku,
    trackInventory: data.trackInventory
  },
  updateStocks: data.updateStocks.map(mapFormsetStockToStockInput)
});

export const getSimpleProductErrors = (data: SimpleProductUpdate) => [
  ...data.productUpdate.errors,
  ...data.productVariantStocksCreate.errors,
  ...data.productVariantStocksDelete.errors,
  ...data.productVariantStocksUpdate.errors
];

export const getChannelListingBaseInputData = ({
  id: channelId,
  isPublished,
  publicationDate,
  isAvailableForPurchase,
  availableForPurchase,
  visibleInListings
}: ChannelData) => ({
  channelId,
  isPublished,
  publicationDate,
  visibleInListings,
  isAvailableForPurchase,
  availableForPurchaseDate: availableForPurchase
});

export const getChannelListingUpdateInputFromData = (
  { variantsIdsToAdd, variantsIdsToRemove }: ChannelWithVariantData,
  { selectedVariantsIds: initialSelectedVariantsIds }: ChannelWithVariantData,
  basicChannelData: ChannelData
) => ({
  ...getChannelListingBaseInputData(basicChannelData),
  addVariants: diff(initialSelectedVariantsIds, variantsIdsToAdd).added,
  removeVariants: variantsIdsToRemove
});

const getParsedChannelsData = (
  channelsWithVariants: ChannelsWithVariantsData,
  initialChannelWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[]
): ProductChannelListingAddInput[] =>
  channelsData.map(({ id, ...rest }) =>
    getChannelListingUpdateInputFromData(
      channelsWithVariants[id],
      initialChannelWithVariants[id],
      { id, ...rest }
    )
  );

const shouldRemoveChannel = (
  allVariants: ProductDetails_product_variants[]
) => ({ removeVariants }: ProductChannelListingAddInput) =>
  isRemovingAllVariants(allVariants, removeVariants);

const isRemovingAllVariants = (
  allVariants: ProductDetails_product_variants[],
  removeVariants: string[]
) => !!removeVariants.length && removeVariants.length === allVariants.length;

const shouldUpdateChannel = (
  initialChannelWithVariantData,
  allVariants: ProductDetails_product_variants[],
  allChannels: ChannelData[]
) => ({
  removeVariants,
  addVariants,
  channelId,
  ...rest
}: ProductChannelListingAddInput) => {
  const initialDataInput = getChannelListingUpdateInputFromData(
    initialChannelWithVariantData[channelId],
    initialChannelWithVariantData[channelId],
    allChannels.find(getById(channelId))
  );

  const hasDataChanged = !isEqual(
    { removeVariants, addVariants, channelId, ...rest },
    initialDataInput
  );

  const isRemovingChannel = isRemovingAllVariants(allVariants, removeVariants);

  return hasDataChanged && !isRemovingChannel;
};

export const getChannelsVariables = (
  { id, variants }: ProductDetails_product,
  allChannels: ChannelData[],
  { channelsWithVariants, channelsData }: ProductUpdateSubmitData
) => {
  const initialChannelWithVariants = getParsedChannelsWithVariantsDataFromChannels(
    channelsData
  );

  const channelsToBeUpdated = getParsedChannelsData(
    channelsWithVariants,
    initialChannelWithVariants,
    channelsData
  ).filter(
    shouldUpdateChannel(initialChannelWithVariants, variants, allChannels)
  );

  const channelsIdsToBeRemoved = getParsedChannelsData(
    channelsWithVariants,
    initialChannelWithVariants,
    channelsData
  )
    .filter(shouldRemoveChannel(variants))
    .map(({ channelId }) => channelId);

  return {
    variables: {
      id,
      input: {
        updateChannels: channelsToBeUpdated,
        removeChannels: channelsIdsToBeRemoved
      }
    }
  };
};

export const getSimpleChannelsVariables = (
  data: ProductUpdatePageSubmitData,
  product: ProductDetails_product
) => {
  const productChannels = createSortedChannelsDataFromProduct(product);
  const diffChannels = diff(
    productChannels,
    data.channelListings,
    (a, b) => a.id === b.id
  );

  return {
    variables: {
      id: product.id,
      input: {
        updateChannels: getAvailabilityVariables(data.channelListings),
        removeChannels: diffChannels.removed?.map(
          removedChannel => removedChannel.id
        )
      }
    }
  };
};

export const getVariantChannelsInput = ({
  channelListings
}: ProductUpdatePageSubmitData) =>
  channelListings.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price
  }));
