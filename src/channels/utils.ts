import { Channels_channels } from "@saleor/channels/types/Channels";
import { SaleDetails_sale } from "@saleor/discounts/types/SaleDetails";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ProductVariantDetails_productVariant } from "@saleor/products/types/ProductVariantDetails";
import { ShippingZone_shippingZone_shippingMethods_channelListing } from "@saleor/shipping/types/ShippingZone";
import { uniqBy } from "lodash";

export interface Channel {
  id: string;
  name: string;
}

export interface ChannelData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
  currency: string;
  price: number;
  availableForPurchase: string;
  isAvailableForPurchase: boolean;
  visibleInListings: boolean;
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

export interface ChannelSaleData {
  id: string;
  name: string;
  discountValue: number | null;
  currency: string;
}

export const createVoucherChannels = (data?: Channels_channels[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: null,
    id: channel.id,
    minSpent: null,
    name: channel.name
  }));

export const createSaleChannels = (data?: Channels_channels[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: null,
    id: channel.id,
    name: channel.name
  }));

export const createVariantChannels = (
  data?: ProductVariantDetails_productVariant
): ChannelPriceData[] => {
  if (data) {
    const productChannels = data?.product.channelListing.map(listing => ({
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: null
    }));
    const variantChannels = data?.channelListing.map(listing => ({
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: listing.price.amount
    }));
    return uniqBy([...variantChannels, ...productChannels], obj => obj.id);
  }
  return [];
};

export const createChannelsDataWithSaleDiscountPrice = (
  saleData?: SaleDetails_sale,
  data?: Channels_channels[]
): ChannelSaleData[] => {
  if (data && saleData?.channelListing) {
    const dataArr = createSaleChannels(data);

    const saleDataArr = createChannelsDataFromSale(saleData);
    return uniqBy([...saleDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsDataWithDiscountPrice = (
  voucherData?: VoucherDetails_voucher,
  data?: Channels_channels[]
): ChannelVoucherData[] => {
  if (data && voucherData?.channelListing) {
    const dataArr = createVoucherChannels(data);

    const voucherDataArr = createChannelsDataFromVoucher(voucherData);
    return uniqBy([...voucherDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsData = (data?: Channels_channels[]): ChannelData[] =>
  data?.map(channel => ({
    availableForPurchase: null,
    currency: channel.currencyCode,
    id: channel.id,
    isAvailableForPurchase: false,
    isPublished: false,
    name: channel.name,
    price: null,
    publicationDate: null,
    visibleInListings: false
  })) || [];

export const createChannelsDataWithPrice = (
  productData?: ProductDetails_product,
  data?: Channels_channels[]
): ChannelData[] => {
  if (data && productData?.channelListing) {
    const dataArr = createChannelsData(data);

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

export const createChannelsDataFromSale = (saleData?: SaleDetails_sale) =>
  saleData?.channelListing?.map(option => ({
    currency: option.channel.currencyCode || "",
    discountValue: option.discountValue,
    id: option.channel.id,
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
      availableForPurchase: option?.availableForPurchase,
      currency: price ? price.currency : "",
      id: option.channel.id,
      isAvailableForPurchase: !!option?.isAvailableForPurchase,
      isPublished: option.isPublished,
      name: option.channel.name,
      price: price ? price.amount : null,
      publicationDate: option.publicationDate,
      visibleInListings: !!option.visibleInListings
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

export const createSortedVoucherData = (data?: Channels_channels[]) =>
  createVoucherChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

export const createSortedSaleData = (data?: Channels_channels[]) =>
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
