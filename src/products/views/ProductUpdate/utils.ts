import {
  getUpdatedIdsWithNewId,
  getUpdatedIdsWithoutNewId
} from "@saleor/channels/pages/ChannelDetailsPage/utils";
import { ChannelData } from "@saleor/channels/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import every from "lodash/every";
import reduce from "lodash/reduce";

import {
  ChannelsWithVariantsData,
  ChannelWithVariantData,
  initialChannelWithVariantData
} from "./types";

export const getParsedChannelsWithVariantsDataFromChannels = (
  channels: ChannelData[]
): ChannelsWithVariantsData =>
  channels?.reduce(
    (result: ChannelsWithVariantsData, { id, variantsIds }) => ({
      ...result,
      [id]: {
        ...initialChannelWithVariantData,
        selectedVariantsIds: variantsIds
      } as ChannelWithVariantData
    }),
    {}
  );

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
        selectedVariantsIds: [],
        variantsIdsToAdd: [],
        variantsIdsToRemove: allProductVariantsIds
      }
    : {
        selectedVariantsIds: allProductVariantsIds,
        variantsIdsToAdd: allProductVariantsIds,
        variantsIdsToRemove: []
      };
};

export const extractAllProductVariantsIds = (
  productVariants: ProductDetails_product_variants[] = []
) => productVariants.map(({ id }) => id);

export const areAllVariantsAtAllChannelsSelected = (
  variants: ProductDetails_product_variants[] = [],
  channelsWithVariants: ChannelsWithVariantsData = {}
) =>
  every(channelsWithVariants, channelWithVariantsData =>
    areAllChannelVariantsSelected(variants, channelWithVariantsData)
  );

export const areAllChannelVariantsSelected = (
  variants: ProductDetails_product_variants[] = [],
  { selectedVariantsIds }: Pick<ChannelWithVariantData, "selectedVariantsIds">
) => selectedVariantsIds.length === variants.length;

export const areAnyChannelVariantsSelected = (
  channelsWithVariantsData: ChannelWithVariantData
) => channelsWithVariantsData?.selectedVariantsIds.length > 0;

export const getTotalSelectedChannelsCount = (
  channelsWithVariantsData: ChannelsWithVariantsData
) =>
  reduce(
    channelsWithVariantsData,
    (result, { selectedVariantsIds }) =>
      selectedVariantsIds.length ? result + 1 : result,
    0
  );
