import {
  ChannelSaleFormData,
  SaleDetailsPageFormData,
} from "@saleor/discounts/components/SaleDetailsPage";
import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { RequirementsPicker } from "@saleor/discounts/types";
import {
  ChannelDetailsFragment,
  ChannelFragment,
  CollectionDetailsFragment,
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductVariantDetailsQuery,
  SaleDetailsFragment,
  SaleType,
  ShippingZoneQuery,
  VoucherDetailsFragment,
} from "@saleor/graphql";
import { RequireOnlyOne } from "@saleor/misc";
import { validatePrice } from "@saleor/products/utils/validation";
import { mapNodeToChoice } from "@saleor/utils/maps";
import uniqBy from "lodash/uniqBy";

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
  preorderThreshold?: number;
  unitsSold?: number;
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

export interface ChannelPreorderArgs {
  preorderThreshold: number;
  unitsSold: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export interface ChannelPriceAndPreorderData {
  id: string;
  name: string;
  currency: string;
  price: string;
  costPrice?: string;
  preorderThreshold?: number | null;
  unitsSold?: number;
}

export interface IChannelPriceAndPreorderArgs {
  price: string;
  costPrice: string;
  preorderThreshold?: number | null;
  unitsSold?: number;
}
export type ChannelPriceAndPreorderArgs = IChannelPriceArgs & {
  preorderThreshold: number | null;
  unitsSold?: number;
};

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

export const createCollectionChannels = (data?: ChannelFragment[]) =>
  data?.map(channel => ({
    id: channel.id,
    isPublished: false,
    name: channel.name,
    publicationDate: null,
  }));

export const createVoucherChannels = (data?: ChannelFragment[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: "",
    id: channel.id,
    minSpent: "",
    name: channel.name,
  }));

export const createSaleChannels = (data?: ChannelFragment[]) =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    discountValue: "",
    id: channel.id,
    name: channel.name,
    percentageValue: "",
    fixedValue: "",
  }));

export const createVariantChannels = (
  data?: ProductVariantDetailsQuery["productVariant"],
): ChannelPriceData[] => {
  if (data) {
    return data?.channelListings.map(listing => ({
      costPrice: listing.costPrice?.amount.toString() || "",
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: listing.price?.amount?.toString(),
    }));
  }
  return [];
};

export const createChannelsDataWithSaleDiscountPrice = (
  saleData?: SaleDetailsFragment,
  data?: ChannelFragment[],
): ChannelSaleData[] => {
  if (data && saleData?.channelListings) {
    const dataArr = createSaleChannels(data);

    const saleDataArr = createChannelsDataFromSale(saleData);
    return uniqBy([...saleDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsDataWithDiscountPrice = (
  voucherData?: VoucherDetailsFragment,
  data?: ChannelFragment[],
): ChannelVoucherData[] => {
  if (data && voucherData?.channelListings) {
    const dataArr = createVoucherChannels(data);

    const voucherDataArr = createChannelsDataFromVoucher(voucherData);
    return uniqBy([...voucherDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createChannelsData = (data?: ChannelFragment[]): ChannelData[] =>
  data?.map(channel => ({
    availableForPurchase: null,
    costPrice: "",
    currency: channel.currencyCode,
    id: channel.id,
    isAvailableForPurchase: true,
    variantsIds: [],
    isPublished: true,
    name: channel.name,
    price: "",
    publicationDate: null,
    visibleInListings: true,
  })) || [];

export const createChannelsDataWithPrice = (
  productData?: ProductFragment,
  data?: ChannelFragment[],
): ChannelData[] => {
  if (data && productData?.channelListings) {
    const dataArr = createChannelsData(data);
    const productDataArr = createChannelsDataFromProduct(productData);

    return uniqBy([...productDataArr, ...dataArr], obj => obj.id);
  }
  return [];
};

export const createShippingChannels = (
  data?: ShippingZoneQuery["shippingZone"]["channels"],
): ChannelShippingData[] =>
  data?.map(channel => ({
    currency: channel.currencyCode,
    id: channel.id,
    maxValue: "",
    minValue: "",
    name: channel.name,
    price: "",
  })) || [];

export const createShippingChannelsFromRate = (
  data?: ShippingZoneQuery["shippingZone"]["shippingMethods"][0]["channelListings"],
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
    price: channelData.price ? channelData.price.amount.toString() : "",
  })) || [];

export const createCollectionChannelsData = (
  collectionData?: CollectionDetailsFragment,
) => {
  if (collectionData?.channelListings) {
    const collectionDataArr = collectionData?.channelListings.map(listing => ({
      id: listing.channel.id,
      isPublished: listing.isPublished,
      name: listing.channel.name,
      publicationDate: listing.publicationDate,
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
  voucherData?: VoucherDetailsFragment,
) =>
  voucherData?.channelListings?.map(option => ({
    currency: option.channel.currencyCode || option?.minSpent?.currency || "",
    discountValue: option.discountValue.toString() || "",
    id: option.channel.id,
    minSpent: option?.minSpent?.amount.toString() || "",
    name: option.channel.name,
  })) || [];

export const createChannelsDataFromSale = (
  saleData?: SaleDetailsFragment,
): ChannelSaleFormData[] =>
  saleData?.channelListings?.map(option => ({
    currency: option.channel.currencyCode || "",
    discountValue: option.discountValue.toString() || "",
    id: option.channel.id,
    name: option.channel.name,
    percentageValue:
      saleData.type === SaleType.PERCENTAGE
        ? option.discountValue.toString()
        : "",
    fixedValue:
      saleData.type === SaleType.FIXED ? option.discountValue.toString() : "",
  })) || [];

export const createChannelsDataFromProduct = (productData?: ProductFragment) =>
  productData?.channelListings?.map(
    ({
      channel,
      availableForPurchase,
      isAvailableForPurchase,
      visibleInListings,
      publicationDate,
      isPublished,
    }) => {
      const variantChannel = productData.variants[0]?.channelListings.find(
        listing => listing.channel.id === channel.id,
      );
      // Comparing explicitly to false because `hasVariants` can be undefined
      const isSimpleProduct = productData.productType?.hasVariants === false;
      const haveVariantsChannelListings = productData.variants.some(variant =>
        variant.channelListings.some(
          listing => listing.channel.id === channel.id,
        ),
      );
      const price = variantChannel?.price;
      const costPrice = variantChannel?.costPrice;
      const variantsIds = extractVariantsIdsForChannel(
        productData.variants,
        channel.id,
      );
      const soldUnits = variantChannel?.preorderThreshold?.soldUnits;
      const preorderThreshold = variantChannel?.preorderThreshold?.quantity;
      // Published defaults to true if none of variants have set channel listing yet
      const isProductPublished =
        !isSimpleProduct && !haveVariantsChannelListings ? true : isPublished;

      return {
        availableForPurchase,
        isPublished: isProductPublished,
        publicationDate,
        variantsIds,
        costPrice: costPrice?.amount.toString() ?? "",
        currency: price ? price.currency : "",
        id: channel.id,
        isAvailableForPurchase: !!isAvailableForPurchase,
        name: channel.name,
        price: price ? price.amount.toString() : "",
        visibleInListings: !!visibleInListings,
        soldUnits,
        preorderThreshold,
      };
    },
  ) || [];

export const extractVariantsIdsForChannel = (
  productVariants: ProductDetailsVariantFragment[],
  channelId: string,
) =>
  productVariants
    ?.filter(({ channelListings }) =>
      channelListings.some(({ channel }) => channel.id === channelId),
    )
    .map(({ id }) => id) || [];

export const createSortedChannelsDataFromProduct = (
  productData?: ProductFragment,
): ChannelData[] =>
  createChannelsDataFromProduct(productData).sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedChannelsData = (data?: ChannelFragment[]) =>
  createChannelsData(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedShippingChannels = (
  data?: ShippingZoneQuery["shippingZone"]["channels"],
) =>
  createShippingChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedShippingChannelsFromRate = (
  data?: ShippingZoneQuery["shippingZone"]["shippingMethods"][0]["channelListings"],
) =>
  createShippingChannelsFromRate(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedVoucherData = (data?: ChannelFragment[]) =>
  createVoucherChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedSaleData = (data?: ChannelFragment[]) =>
  createSaleChannels(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedChannelsDataFromVoucher = (
  data?: VoucherDetailsFragment,
) =>
  createChannelsDataFromVoucher(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const createSortedChannelsDataFromSale = (
  data?: SaleDetailsFragment,
): ChannelSaleFormData[] =>
  createChannelsDataFromSale(data)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

export const getChannelsCurrencyChoices = (
  id: string,
  selectedChannel: ChannelDetailsFragment,
  channelsList: ChannelDetailsFragment[],
) =>
  id
    ? mapNodeToChoice(
        channelsList?.filter(
          channel =>
            channel.id !== id &&
            channel.currencyCode === selectedChannel?.currencyCode,
        ),
      )
    : [];

export const validateSalePrice = (
  data: SaleDetailsPageFormData,
  channel: ChannelSaleFormData,
) =>
  validatePrice(
    data.type === SaleType.PERCENTAGE
      ? channel.percentageValue
      : channel.fixedValue,
  );

export const validateVoucherPrice = (
  data: VoucherDetailsPageFormData,
  channel: ChannelVoucherData,
) =>
  validatePrice(channel.discountValue) ||
  (data.requirementsPicker === RequirementsPicker.ORDER &&
    validatePrice(channel.minSpent));
