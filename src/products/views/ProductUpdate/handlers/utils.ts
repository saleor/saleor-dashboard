import { ChannelData } from "@saleor/channels/utils";
import { weight } from "@saleor/misc";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import {
  ProductDetails_product,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import { ProductUpdateVariables } from "@saleor/products/types/ProductUpdate";
import { SimpleProductUpdate } from "@saleor/products/types/SimpleProductUpdate";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { ProductChannelListingAddInput } from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";

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

export const getChannelListingAddInputFromData = (
  { variantsIdsToAdd, variantsIdsToRemove }: ChannelWithVariantData,
  { selectedVariantsIds: initialSelectedVariantsIds }: ChannelWithVariantData,
  {
    id: channelId,
    isPublished,
    publicationDate,
    isAvailableForPurchase,
    availableForPurchase,
    visibleInListings
  }: ChannelData
) => ({
  channelId,
  isPublished,
  publicationDate,
  visibleInListings,
  isAvailableForPurchase,
  availableForPurchaseDate: availableForPurchase,
  addVariants: diff(initialSelectedVariantsIds, variantsIdsToAdd).added,
  removeVariants: variantsIdsToRemove
});

const getParsedChannelsData = (
  channelsWithVariants: ChannelsWithVariantsData,
  initialChannelWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[]
): ProductChannelListingAddInput[] =>
  channelsData.map(({ id, ...rest }) =>
    getChannelListingAddInputFromData(
      channelsWithVariants[id],
      initialChannelWithVariants[id],
      { id, ...rest }
    )
  );

const shouldAddChannel = (allVariants: ProductDetails_product_variants[]) => ({
  removeVariants,
  addVariants
}: ProductChannelListingAddInput) =>
  !!addVariants.length ||
  (!!removeVariants.length && removeVariants.length !== allVariants.length);

const shouldRemoveChannel = (
  allVariants: ProductDetails_product_variants[]
) => ({ removeVariants }: ProductChannelListingAddInput) =>
  !!removeVariants.length && removeVariants.length === allVariants.length;

export const getParsedChannelsToBeAdded = (
  channelsWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[],
  allVariants: ProductDetails_product_variants[]
) => {
  const initialChannelWithVariantsData = getParsedChannelsWithVariantsDataFromChannels(
    channelsData
  );

  return getParsedChannelsData(
    channelsWithVariants,
    initialChannelWithVariantsData,
    channelsData
  ).filter(shouldAddChannel(allVariants));
};

const getChannelsIdsToBeRemoved = (
  channelsWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[],
  allVariants: ProductDetails_product_variants[]
) => {
  const initialChannelWithVariantsData = getParsedChannelsWithVariantsDataFromChannels(
    channelsData
  );

  return getParsedChannelsData(
    channelsWithVariants,
    initialChannelWithVariantsData,
    channelsData
  )
    .filter(shouldRemoveChannel(allVariants))
    .map(({ channelId }) => channelId);
};

export const getChannelsVariables = (
  product: ProductDetails_product,
  { channelsWithVariants, channelsData }: ProductUpdateSubmitData
) => {
  const channelsToBeAdded = getParsedChannelsToBeAdded(
    channelsWithVariants,
    channelsData,
    product.variants
  );
  const channelsToBeRemoved = getChannelsIdsToBeRemoved(
    channelsWithVariants,
    channelsData,
    product.variants
  );

  return {
    variables: {
      id: product.id,
      input: {
        updateChannels: channelsToBeAdded,
        removeChannels: channelsToBeRemoved
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
