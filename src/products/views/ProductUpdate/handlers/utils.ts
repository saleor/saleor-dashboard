import {
  ChannelData,
  createSortedChannelsDataFromProduct,
} from "@saleor/channels/utils";
import {
  ProductChannelListingAddInput,
  ProductChannelListingUpdateMutationVariables,
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductUpdateMutationVariables,
  SimpleProductUpdateMutation,
} from "@saleor/graphql";
import { weight } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { getAvailabilityVariables } from "@saleor/products/utils/handlers";
import { arrayDiff } from "@saleor/utils/arrays";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";

import { ChannelWithVariantData } from "../types";
import { getParsedChannelsWithVariantsDataFromChannels } from "../utils";

export const getSimpleProductVariables = (
  productVariables: ProductUpdateMutationVariables,
  data: ProductUpdatePageSubmitData,
  productId: string,
) => ({
  ...productVariables,
  addStocks: data.addStocks.map(mapFormsetStockToStockInput),
  deleteStocks: data.removeStocks,
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
  updateStocks: data.updateStocks.map(mapFormsetStockToStockInput),
});

export const getSimpleProductErrors = (data: SimpleProductUpdateMutation) => [
  ...data.productUpdate.errors,
  ...data.productVariantStocksCreate.errors,
  ...data.productVariantStocksDelete.errors,
  ...data.productVariantStocksUpdate.errors,
];

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
  data: ProductUpdatePageSubmitData,
  product: ProductFragment,
) => {
  const productChannels = createSortedChannelsDataFromProduct(product);
  const existingChannelIDs = productChannels.map(channel => channel.id);
  const modifiedChannelIDs = data.channelListings.map(channel => channel.id);

  const removedChannelIDs = existingChannelIDs.filter(
    x => !modifiedChannelIDs.includes(x),
  );

  return {
    variables: {
      id: product.id,
      input: {
        updateChannels: getAvailabilityVariables(data.channelListings),
        removeChannels: removedChannelIDs,
      },
    },
  };
};

export const getVariantChannelsInput = ({
  channelListings,
}: ProductUpdatePageSubmitData) =>
  channelListings.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price,
    preorderThreshold: listing.preorderThreshold,
  }));
