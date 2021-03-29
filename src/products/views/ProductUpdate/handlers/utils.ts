import { ChannelData } from "@saleor/channels/utils";
import { weight } from "@saleor/misc";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ProductUpdateVariables } from "@saleor/products/types/ProductUpdate";
import { SimpleProductUpdate } from "@saleor/products/types/SimpleProductUpdate";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { ProductChannelListingAddInput } from "@saleor/types/globalTypes";

import { ChannelsWithVariantsData, ChannelWithVariantData } from "../types";

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
  addVariants: variantsIdsToAdd,
  removeVariants: variantsIdsToRemove
});

const getParsedChannelsData = (
  channelsWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[]
): ProductChannelListingAddInput[] =>
  channelsData.map(({ id, ...rest }) =>
    getChannelListingAddInputFromData(channelsWithVariants[id], { id, ...rest })
  );

export const getParsedChannelsToBeAdded = (
  channelsWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[]
) =>
  getParsedChannelsData(channelsWithVariants, channelsData).filter(
    ({ addVariants }) => !!addVariants.length
  );

const getChannelsIdsToBeRemoved = (
  channelsWithVariants: ChannelsWithVariantsData,
  channelsData: ChannelData[]
) =>
  getParsedChannelsData(channelsWithVariants, channelsData)
    .filter(({ removeVariants }) => !!removeVariants.length)
    .map(({ channelId }) => channelId);

export const getChannelsVariables = (
  product: ProductDetails_product,
  { channelsWithVariants, channelsData }: ProductUpdateSubmitData
) => {
  const channelsToBeAdded = getParsedChannelsToBeAdded(
    channelsWithVariants,
    channelsData
  );
  const channelsToBeRemoved = getChannelsIdsToBeRemoved(
    channelsWithVariants,
    channelsData
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
  channelsData
}: ProductUpdatePageSubmitData) =>
  channelsData.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price
  }));
