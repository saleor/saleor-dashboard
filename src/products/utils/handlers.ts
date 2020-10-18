import { ChannelData, ChannelPriceArgs } from "@saleor/channels/utils";
import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { ProductVariantPageFormData } from "@saleor/products/components/ProductVariantPage";
import { toggle } from "@saleor/utils/lists";

import { ProductAttributeInputData } from "../components/ProductAttributes";
import { getAttributeInputFromProductType, ProductType } from "./data";

const setPrice = (price: string, initialPrice: number) =>
  typeof price === "string"
    ? price
      ? parseInt(price, 10)
      : null
    : initialPrice;

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange {
  return (attributeId: string, value: string) => {
    triggerChange();
    changeAttributeData(attributeId, value === "" ? [] : [value]);
  };
}

export function createChannelsPriceChangeHandler(
  channelListing: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        costPrice: setPrice(costPrice, channel.costPrice),
        price: setPrice(price, channel.price)
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createChannelsChangeHandler(
  channelListing: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void
) {
  return (
    id: string,
    data: Omit<ChannelData, "name" | "price" | "currency" | "id">
  ) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        ...data
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createVariantChannelsChangeHandler(
  data: ProductVariantPageFormData,
  setData: (data: ProductVariantPageFormData) => void,
  triggerChange: () => void
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const { channelListing } = data;
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        costPrice: setPrice(costPrice, channel.costPrice),
        price: setPrice(price, channel.price)
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    setData({ ...data, channelListing: updatedChannels });
    triggerChange();
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<ProductAttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange {
  return (attributeId: string, value: string) => {
    const attribute = attributes.find(
      attribute => attribute.id === attributeId
    );

    const newAttributeValues = toggle(
      value,
      attribute.value,
      (a, b) => a === b
    );

    triggerChange();
    changeAttributeData(attributeId, newAttributeValues);
  };
}

export function createProductTypeSelectHandler(
  change: FormChange,
  setAttributes: (data: FormsetData<ProductAttributeInputData>) => void,
  setProductType: (productType: ProductType) => void,
  productTypeChoiceList: ProductType[]
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    const selectedProductType = productTypeChoiceList.find(
      productType => productType.id === id
    );
    setProductType(selectedProductType);
    change(event);

    setAttributes(getAttributeInputFromProductType(selectedProductType));
  };
}

export const getAvailabilityVariables = (channels: ChannelData[]) =>
  channels.map(channel => {
    const { isAvailableForPurchase, availableForPurchase } = channel;
    const isAvailable =
      availableForPurchase && !isAvailableForPurchase
        ? true
        : isAvailableForPurchase;

    return {
      availableForPurchaseDate:
        isAvailableForPurchase || availableForPurchase === ""
          ? null
          : availableForPurchase,
      channelId: channel.id,
      isAvailableForPurchase: isAvailable,
      isPublished: channel.isPublished,
      publicationDate: channel.publicationDate,
      visibleInListings: channel.visibleInListings
    };
  });
