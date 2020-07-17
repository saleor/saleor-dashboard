import { Channels_channels } from "@saleor/channels/types/Channels";
import { ProductDetails_product_channelListing } from "@saleor/products/types/ProductDetails";

export interface ChannelData {
  id: string;
  name: string;
  publicationDate: string | null;
  isPublished: boolean;
}

export const createChannelsData = (data?: Channels_channels[]) =>
  data?.map(channel => ({
    id: channel.id,
    isPublished: false,
    name: channel.name,
    publicationDate: null
  })) || [];

export const createChannelsDataFromProduct = (
  productData?: ProductDetails_product_channelListing[]
) =>
  productData?.map(option => ({
    id: option.channel.id,
    isPublished: option.isPublished,
    name: option.channel.name,
    publicationDate: option.publicationDate
  })) || [];
