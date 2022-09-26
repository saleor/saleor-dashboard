import { ChannelPriceAndPreorderData } from "@saleor/channels/utils";
import { ProductVariantCreateDataQuery } from "@saleor/graphql";
import { UseFormsetOutput } from "@saleor/hooks/useFormset";
import { getChannelsInput } from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice,
} from "@saleor/products/utils/validation";

import { VariantChannelListing } from "./types";

type FormChannels = UseFormsetOutput<ChannelPriceAndPreorderData>;

export const validateChannels = (channels: FormChannels["data"]) =>
  channels.some(
    channelData =>
      validatePrice(channelData.value.price) ||
      validateCostPrice(channelData.value.costPrice),
  );

export const createChannelsWithPreorderInfo = (
  product: ProductVariantCreateDataQuery["product"],
) =>
  product
    ? product.channelListings.map(listing => ({
        ...listing.channel,
        currency: listing.channel.currencyCode,
        price: "",
      }))
    : [];

export const concatChannelsBySelection = (
  selectedIds: string[],
  formChannels: FormChannels,
  allChannels: ChannelPriceAndPreorderData[],
) => {
  const includedAndSelected = formChannels.data.filter(ch =>
    selectedIds.includes(ch.id),
  );
  const includedAndSelectedIds = includedAndSelected.map(ch => ch.id);
  const restSelectedIds = selectedIds.filter(
    id => !includedAndSelectedIds.includes(id),
  );
  const newlySelected = allChannels.filter(ch =>
    restSelectedIds.includes(ch.id),
  );

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
