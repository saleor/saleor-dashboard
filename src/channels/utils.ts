import { Channels_channels } from "@saleor/channels/types/Channels";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ShippingZone_shippingZone_shippingMethods_channelListing } from "@saleor/shipping/types/ShippingZone";
import { uniqBy } from "lodash";
export interface ChannelData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
  currency: string;
  price: number;
}

export interface ChannelPriceData {
  id: string;
  name: string;
  currency: string;
  price: number | null;
}

export interface ChannelVoucherData {
  id: string;
  name: string;
  discountValue: number | null;
  currency: string;
  minSpent: number | null;
}

export const createChannelsDataWithDiscountPrice = (
  voucherData?: VoucherDetails_voucher,
  data?: Channels_channels[]
): ChannelVoucherData[] => {
  if (data && voucherData?.channelListing) {
    const dataArr = data.map(channel => ({
      currency: channel.currencyCode,
      discountValue: null,
      id: channel.id,
      minSpent: null,
      name: channel.name
    }));

    const voucherDataArr = createChannelsDataFromVoucher(voucherData);
    return uniqBy([...voucherDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsData = (data?: Channels_channels[]): ChannelData[] =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    id: channel.id,
    isPublished: false,
    name: channel.name,
    price: null,
    publicationDate: null
  })) || [];

export const createChannelsDataWithPrice = (
  productData?: ProductDetails_product,
  data?: Channels_channels[]
): ChannelData[] => {
  if (data && productData?.channelListing) {
    const dataArr = data.map(channel => ({
      currency: channel.currencyCode,
      id: channel.id,
      isPublished: false,
      name: channel.name,
      price: null,
      publicationDate: null
    }));

    const productDataArr = createChannelsDataFromProduct(productData);
    return uniqBy([...productDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createShippingChannels = (
  data?: Channels_channels[]
): ChannelShippingData[] =>
  data?.map(channel => ({
    id: channel.id,
    maxValue: "",
    minValue: "",
    name: channel.name,
    price: ""
  })) || [];

export const createShippingChannelsFromRate = (
  data?: ShippingZone_shippingZone_shippingMethods_channelListing[]
): ChannelShippingData[] =>
  data?.map(channelData => ({
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
export interface ChannelShippingData {
  id: string;
  minValue: string;
  name: string;
  maxValue: string;
  price: string;
}

export const createChannelsDataFromVoucher = (
  voucherData?: VoucherDetails_voucher
) =>
  voucherData?.channelListing?.map(option => ({
    currency: option.channel.currencyCode || option?.minSpent?.currency || "",
    discountValue: option.discountValue,
    id: option.channel.id,
    minSpent: option?.minSpent?.amount || null,
    name: option.channel.name
  })) || [];

export const createChannelsDataFromProduct = (
  productData?: ProductDetails_product
) =>
  productData?.channelListing?.map(option => {
    const price = productData.variants[0]?.channelListing.find(
      listing => listing.channel.id === option.channel.id
    )?.price;
    return {
      currency: price ? price.currency : "",
      id: option.channel.id,
      isPublished: option.isPublished,
      name: option.channel.name,
      price: price ? price.amount : null,
      publicationDate: option.publicationDate
    };
  }) || [];

export const createSortedChannelsDataFromProduct = (
  productData?: ProductDetails_product
) =>
  createChannelsDataFromProduct(productData).sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedChannelsData = (data?: Channels_channels[]) =>
  createChannelsData(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedShippingChannels = (data?: Channels_channels[]) =>
  createShippingChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedShippingChannelsFromRate = (
  data?: ShippingZone_shippingZone_shippingMethods_channelListing[]
) =>
  createShippingChannelsFromRate(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedChannelsDataFromVoucher = (
  data?: VoucherDetails_voucher
) =>
  createChannelsDataFromVoucher(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );
