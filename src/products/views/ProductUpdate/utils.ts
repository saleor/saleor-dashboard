import {
  getUpdatedIdsWithNewId,
  getUpdatedIdsWithoutNewId
} from "@saleor/channels/pages/ChannelDetailsPage/utils";
import {
  ProductDetails_product,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import every from "lodash-es/every";

import { ChannelsWithVariantsData, ChannelWithVariantData } from "./types";

export const extractVariantsIdsForChannel = (
  productVariants: ProductDetails_product_variants[],
  channelId: string
) =>
  productVariants
    ?.filter(({ channelListings }) =>
      channelListings.some(({ channel }) => channel.id === channelId)
    )
    .map(({ id }) => id) || [];

interface ChannelAddRemoveVariantCommonProps {
  channelWithVariantsData: ChannelWithVariantData;
  channelId: string;
  variantId: string;
}

export const getChannelWithAddedVariantData = ({
  channelWithVariantsData: {
    selectedVariantsIds,
    variantsIdsToAdd,
    variantsIdsToRemove
  },
  channelId,
  variantId
}: ChannelAddRemoveVariantCommonProps): ChannelsWithVariantsData => ({
  [channelId]: {
    hasChanged: true,
    selectedVariantsIds: getUpdatedIdsWithNewId(selectedVariantsIds, variantId),
    variantsIdsToAdd: getUpdatedIdsWithNewId(variantsIdsToAdd, variantId),
    variantsIdsToRemove: getUpdatedIdsWithoutNewId(
      variantsIdsToRemove,
      variantId
    )
  }
});

export const getChannelWithRemovedVariantData = ({
  channelWithVariantsData: {
    selectedVariantsIds,
    variantsIdsToAdd,
    variantsIdsToRemove
  },
  channelId,
  variantId
}: ChannelAddRemoveVariantCommonProps): ChannelsWithVariantsData => ({
  [channelId]: {
    hasChanged: true,
    selectedVariantsIds: getUpdatedIdsWithoutNewId(
      selectedVariantsIds,
      variantId
    ),
    variantsIdsToRemove: getUpdatedIdsWithNewId(variantsIdsToRemove, variantId),
    variantsIdsToAdd: getUpdatedIdsWithoutNewId(variantsIdsToAdd, variantId)
  }
});

export const getChannelVariantToggleData = (
  variants: ProductDetails_product_variants[],
  isSelected: boolean
): ChannelWithVariantData => {
  const allProductVariantsIds = extractAllProductVariantsIds(variants);

  return isSelected
    ? {
        hasChanged: true,
        selectedVariantsIds: allProductVariantsIds,
        variantsIdsToAdd: allProductVariantsIds,
        variantsIdsToRemove: []
      }
    : {
        hasChanged: true,
        selectedVariantsIds: [],
        variantsIdsToAdd: [],
        variantsIdsToRemove: allProductVariantsIds
      };
};

export const extractAllProductVariantsIds = (
  productVariants: ProductDetails_product_variants[] = []
) => productVariants.map(({ id }) => id);

export const areAllVariantsAtAllChannelsSelected = (
  variants: ProductDetails_product_variants[] = [],
  channelsWithVariants: ChannelsWithVariantsData
) =>
  every(channelsWithVariants, channelWithVariantsData =>
    areAllChannelVariantsSelected(variants, channelWithVariantsData)
  );

export const areAllChannelVariantsSelected = (
  variants: ProductDetails_product_variants[] = [],
  { variantsIdsToAdd }: ChannelWithVariantData
) => variantsIdsToAdd.length === variants.length;

export const areAnyChannelVariantsSelected = ({
  selectedVariantsIds
}: ChannelWithVariantData) => selectedVariantsIds.length > 0;
