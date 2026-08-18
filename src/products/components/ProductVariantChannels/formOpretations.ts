// @ts-strict-ignore
import { type VariantChannelPriceData } from "@dashboard/channels/utils";
import { type ProductVariantCreateDataQuery } from "@dashboard/graphql";
import { type UseFormsetOutput } from "@dashboard/hooks/useFormset";
import { getChannelsInput } from "@dashboard/products/utils/handlers";

import { type VariantChannelListing } from "./types";

type FormChannels = UseFormsetOutput<VariantChannelPriceData>;

export const createVariantChannelsFromProduct = (
  product: ProductVariantCreateDataQuery["product"],
) =>
  product
    ? product.channelListings.map(listing => ({
        ...listing.channel,
        currency: listing.channel.currencyCode,
        isActive: listing.channel.isActive ?? true,
        isPublished: listing.isPublished,
        price: "",
      }))
    : [];

export const concatChannelsBySelection = (
  selectedIds: string[],
  formChannels: FormChannels,
  allChannels: VariantChannelPriceData[],
) => {
  const includedAndSelected = formChannels.data.filter(ch => selectedIds.includes(ch.id));
  const includedAndSelectedIds = includedAndSelected.map(ch => ch.id);
  const restSelectedIds = selectedIds.filter(id => !includedAndSelectedIds.includes(id));
  const newlySelected = allChannels.filter(ch => restSelectedIds.includes(ch.id));

  return getChannelsInput(newlySelected).concat(includedAndSelected);
};

export const extractChannelPricesFromVariantChannel = (
  variantChannel: VariantChannelListing[number],
) => {
  const { costPrice, price } = variantChannel;

  return {
    costPrice: costPrice ? costPrice.amount.toString() : null,
    price: price ? price.amount.toString() : null,
  };
};
