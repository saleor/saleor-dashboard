import { Channels_channels } from "@saleor/channels/types/Channels";
import { ProductDetails_product_channelListing } from "@saleor/products/types/ProductDetails";
import { ShippingZone_shippingZone_shippingMethods_channels } from "@saleor/shipping/types/ShippingZone";

export interface ChannelData {
  id: string;
  isPublished: boolean;
  name: string;
  publicationDate: string | null;
}

export const createChannelsData = (
  data?: Channels_channels[]
): ChannelData[] | [] =>
  data?.map(channel => ({
    id: channel.id,
    isPublished: false,
    name: channel.name,
    publicationDate: null
  })) || [];

export const createShippingChannels = (
  data?: Channels_channels[]
): ChannelShippingData[] | [] =>
  data?.map(channel => ({
    id: channel.id,
    maxValue: "",
    minValue: "",
    name: channel.name,
    price: ""
  })) || [];

export const createShippingChannelsFromRate = (
  data?: ShippingZone_shippingZone_shippingMethods_channels[]
): ChannelShippingData[] | [] =>
  data?.map(channelData => ({
    id: channelData.channel.id,
    maxValue: channelData.maxValue ? channelData.maxValue.toString() : "",
    minValue: channelData.minValue ? channelData.minValue.toString() : "",
    name: channelData.channel.name,
    price: channelData.price ? channelData.price.toString() : ""
  })) || [];
export interface ChannelShippingData {
  id: string;
  minValue: string;
  name: string;
  maxValue: string;
  price: string;
}

export const createChannelsDataFromProduct = (
  productData?: ProductDetails_product_channelListing[]
) =>
  productData?.map(option => ({
    id: option.channel.id,
    isPublished: option.isPublished,
    name: option.channel.name,
    publicationDate: option.publicationDate
  })) || [];
