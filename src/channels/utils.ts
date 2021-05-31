import { Channels_channels } from "@saleor/channels/types/Channels";
import { CollectionDetails_collection } from "@saleor/collections/types/CollectionDetails";
import { SaleDetails_sale } from "@saleor/discounts/types/SaleDetails";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import { RequireOnlyOne } from "@saleor/misc";
import {
  ProductDetails_product,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
import { ProductVariantDetails_productVariant } from "@saleor/products/types/ProductVariantDetails";
import {
  ShippingZone_shippingZone_channels,
  ShippingZone_shippingZone_shippingMethods_channelListings
} from "@saleor/shipping/types/ShippingZone";
import { mapNodeToChoice } from "@saleor/utils/maps";
import uniqBy from "lodash/uniqBy";

import { BaseChannels_channels } from "./types/BaseChannels";

export interface Channel {
  id: string;
  name: string;
}

export interface ChannelData {
  id: string;
  name: string;
  isPublished?: boolean;
  publicationDate?: string | null;
  currency?: string;
  variantsIds?: string[];
  price?: string;
  costPrice?: string;
  availableForPurchase?: string;
  isAvailableForPurchase?: boolean;
  visibleInListings?: boolean;
}

export interface ChannelPriceData {
  id: string;
  name: string;
  currency: string;
  price: string;
  costPrice?: string;
}

export interface IChannelPriceArgs {
  price: string;
  costPrice: string;
}
export type ChannelPriceArgs = RequireOnlyOne<
  IChannelPriceArgs,
  "price" | "costPrice"
>;

export interface ChannelVoucherData {
  id: string;
  name: string;
  discountValue: string;
  currency: string;
  minSpent: string;
}

export interface ChannelSaleData {
  id: string;
  name: string;
  discountValue: string;
  currency: string;
}

export interface ChannelCollectionData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
}

export const createCollectionChannels = (data?: BaseChannels_channels[]) =>
  data?.map(channel => ({
    id: channel.id,
    isPublished: false,
    name: channel.name,
    publicationDate: null
  }));

export const createVoucherChannels = (data?: BaseChannels_channels[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: "",
    id: channel.id,
    minSpent: "",
    name: channel.name
  }));

export const createSaleChannels = (data?: BaseChannels_channels[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: "",
    id: channel.id,
    name: channel.name
  }));

export const createVariantChannels = (
  data?: ProductVariantDetails_productVariant
): ChannelPriceData[] => {
  if (data) {
    return data?.channelListings.map(listing => ({
      costPrice: listing.costPrice?.amount.toString() || "",
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: listing.price?.amount?.toString()
    }));
  }
  return [];
};

export const createChannelsDataWithSaleDiscountPrice = (
  saleData?: SaleDetails_sale,
  data?: BaseChannels_channels[]
): ChannelSaleData[] => {
  if (data && saleData?.channelListings) {
    const dataArr = createSaleChannels(data);

    const saleDataArr = createChannelsDataFromSale(saleData);
    return uniqBy([...saleDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsDataWithDiscountPrice = (
  voucherData?: VoucherDetails_voucher,
  data?: BaseChannels_channels[]
): ChannelVoucherData[] => {
  if (data && voucherData?.channelListings) {
    const dataArr = createVoucherChannels(data);

    const voucherDataArr = createChannelsDataFromVoucher(voucherData);
    return uniqBy([...voucherDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsData = (
  data?: BaseChannels_channels[]
): ChannelData[] =>
  data?.map(channel => ({
    availableForPurchase: null,
    costPrice: "",
    currency: channel.currencyCode,
    id: channel.id,
    isAvailableForPurchase: false,
    variantsIds: [],
    isPublished: false,
    name: channel.name,
    price: "",
    publicationDate: null,
    visibleInListings: false
  })) || [];

export const createChannelsDataWithPrice = (
  productData?: ProductDetails_product,
  data?: BaseChannels_channels[]
): ChannelData[] => {
  if (data && productData?.channelListings) {
    const dataArr = createChannelsData(data);

    const productDataArr = createChannelsDataFromProduct(productData);
    return uniqBy([...productDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createShippingChannels = (
  data?: ShippingZone_shippingZone_channels[]
): ChannelShippingData[] =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    id: channel.id,
    maxValue: "",
    minValue: "",
    name: channel.name,
    price: ""
  })) || [];

export const createShippingChannelsFromRate = (
  data?: ShippingZone_shippingZone_shippingMethods_channelListings[]
): ChannelShippingData[] =>
  data?.map(channelData => ({
    currency: channelData.channel.currencyCode,
    id: channelData.channel.id,
    maxValue: channelData.maximumOrderPrice
      ? channelData.maximumOrderPrice.amount.toString()
      : "",
    minValue: channelData.minimumOrderPrice
      ? channelData.minimumOrderPrice.amount.toString()
      : "",
    name: channelData.channel.name,
    price: channelData.price ? channelData.price.amount.toString() : ""
  })) || [];

export const createCollectionChannelsData = (
  collectionData?: CollectionDetails_collection
) => {
  if (collectionData?.channelListings) {
    const collectionDataArr = collectionData?.channelListings.map(listing => ({
      id: listing.channel.id,
      isPublished: listing.isPublished,
      name: listing.channel.name,
      publicationDate: listing.publicationDate
    }));
    return collectionDataArr;
  }
};

export interface ChannelShippingData {
  currency: string;
  id: string;
  minValue: string;
  name: string;
  maxValue: string;
  price: string;
}

export const createChannelsDataFromVoucher = (
  voucherData?: VoucherDetails_voucher
) =>
  voucherData?.channelListings?.map(option => ({
    currency: option.channel.currencyCode || option?.minSpent?.currency || "",
    discountValue: option.discountValue.toString() || "",
    id: option.channel.id,
    minSpent: option?.minSpent?.amount.toString() || "",
    name: option.channel.name
  })) || [];

export const createChannelsDataFromSale = (saleData?: SaleDetails_sale) =>
  saleData?.channelListings?.map(option => ({
    currency: option.channel.currencyCode || "",
    discountValue: option.discountValue.toString() || "",
    id: option.channel.id,
    name: option.channel.name
  })) || [];

export const createChannelsDataFromProduct = (
  productData?: ProductDetails_product
) =>
  productData?.channelListings?.map(
    ({
      channel,
      availableForPurchase,
      isAvailableForPurchase,
      visibleInListings,
      publicationDate,
      isPublished
    }) => {
      const variantChannel = productData.variants[0]?.channelListings.find(
        listing => listing.channel.id === channel.id
      );
      const price = variantChannel?.price;
      const costPrice = variantChannel?.costPrice;
      const variantsIds = extractVariantsIdsForChannel(
        productData.variants,
        channel.id
      );

      return {
        availableForPurchase,
        isPublished,
        publicationDate,
        variantsIds,
        costPrice: costPrice?.amount.toString() ?? "",
        currency: price ? price.currency : "",
        id: channel.id,
        isAvailableForPurchase: !!isAvailableForPurchase,
        name: channel.name,
        price: price ? price.amount.toString() : "",
        visibleInListings: !!visibleInListings
      };
    }
  ) || [];

export const extractVariantsIdsForChannel = (
  productVariants: ProductDetails_product_variants[],
  channelId: string
) =>
  productVariants
    ?.filter(({ channelListings }) =>
      channelListings.some(({ channel }) => channel.id === channelId)
    )
    .map(({ id }) => id) || [];

export const createSortedChannelsDataFromProduct = (
  productData?: ProductDetails_product
): ChannelData[] =>
  createChannelsDataFromProduct(productData).sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedChannelsData = (data?: BaseChannels_channels[]) =>
  createChannelsData(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedShippingChannels = (
  data?: ShippingZone_shippingZone_channels[]
) =>
  createShippingChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedShippingChannelsFromRate = (
  data?: ShippingZone_shippingZone_shippingMethods_channelListings[]
) =>
  createShippingChannelsFromRate(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedVoucherData = (data?: BaseChannels_channels[]) =>
  createVoucherChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedSaleData = (data?: BaseChannels_channels[]) =>
  createSaleChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedChannelsDataFromVoucher = (
  data?: VoucherDetails_voucher
) =>
  createChannelsDataFromVoucher(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedChannelsDataFromSale = (data?: SaleDetails_sale) =>
  createChannelsDataFromSale(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const getChannelsCurrencyChoices = (
  id: string,
  selectedChannel: Channels_channels,
  channelsList: Channels_channels[]
) =>
  id
    ? mapNodeToChoice(
        channelsList?.filter(
          channel =>
            channel.id !== id &&
            channel.currencyCode === selectedChannel?.currencyCode
        )
      )
    : [];
