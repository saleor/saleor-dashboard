import { Channels_channels } from "@saleor/channels/types/Channels";
import { CollectionDetails_collection } from "@saleor/collections/types/CollectionDetails";
import { SaleDetails_sale } from "@saleor/discounts/types/SaleDetails";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import { RequireOnlyOne } from "@saleor/misc";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ProductVariantDetails_productVariant } from "@saleor/products/types/ProductVariantDetails";
import { ShippingZone_shippingZone_shippingMethods_channelListings } from "@saleor/shipping/types/ShippingZone";
import uniqBy from "lodash-es/uniqBy";

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
  price: string;
  costPrice: string;
  availableForPurchase: string;
  isAvailableForPurchase: boolean;
  visibleInListings: boolean;
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

export const createCollectionChannels = (data?: Channels_channels[]) =>
  data?.map(channel => ({
    id: channel.id,
    isPublished: false,
    name: channel.name,
    publicationDate: null
  }));

export const createVoucherChannels = (data?: Channels_channels[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: "",
    id: channel.id,
    minSpent: "",
    name: channel.name
  }));

export const createSaleChannels = (data?: Channels_channels[]) =>
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
    const productChannels = data?.product.channelListings.map(listing => ({
      costPrice: "",
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: ""
    }));
    const variantChannels = data?.channelListings.map(listing => ({
      costPrice: listing.costPrice?.amount.toString() || "",
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: listing.price.amount.toString()
    }));
    return uniqBy([...variantChannels, ...productChannels], obj => obj.id);
  }
  return [];
};

export const createChannelsDataWithSaleDiscountPrice = (
  saleData?: SaleDetails_sale,
  data?: Channels_channels[]
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
  data?: Channels_channels[]
): ChannelVoucherData[] => {
  if (data && voucherData?.channelListings) {
    const dataArr = createVoucherChannels(data);

    const voucherDataArr = createChannelsDataFromVoucher(voucherData);
    return uniqBy([...voucherDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsData = (data?: Channels_channels[]): ChannelData[] =>
  data?.map(channel => ({
    availableForPurchase: null,
    costPrice: "",
    currency: channel.currencyCode,
    id: channel.id,
    isAvailableForPurchase: false,
    isPublished: false,
    name: channel.name,
    price: "",
    publicationDate: null,
    visibleInListings: false
  })) || [];

export const createChannelsDataWithPrice = (
  productData?: ProductDetails_product,
  data?: Channels_channels[]
): ChannelData[] => {
  if (data && productData?.channelListings) {
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
  productData?.channelListings?.map(option => {
    const variantChannel = productData.variants[0]?.channelListings.find(
      listing => listing.channel.id === option.channel.id
    );
    const price = variantChannel?.price;
    const costPrice = variantChannel?.costPrice;
    return {
      availableForPurchase: option?.availableForPurchase,
      costPrice: costPrice ? costPrice.amount.toString() : "",
      currency: price ? price.currency : "",
      id: option.channel.id,
      isAvailableForPurchase: !!option?.isAvailableForPurchase,
      isPublished: option.isPublished,
      name: option.channel.name,
      price: price ? price.amount.toString() : "",
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
  data?: ShippingZone_shippingZone_shippingMethods_channelListings[]
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
