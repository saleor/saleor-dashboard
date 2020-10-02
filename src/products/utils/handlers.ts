import { ChannelData, ChannelPriceData } from "@saleor/channels/utils";
import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { ProductVariantChannelData } from "@saleor/products/components/ProductVariantPage";
import { toggle } from "@saleor/utils/lists";

import { ProductAttributeInputData } from "../components/ProductAttributes";
import { getAttributeInputFromProductType, ProductType } from "./data";

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange<string> {
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
  return (id: string, price: number) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        price
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
    {
      isPublished,
      publicationDate
    }: { isPublished: boolean; publicationDate: string | null }
  ) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        isPublished:
          typeof isPublished === "boolean" ? isPublished : channel.isPublished,
        publicationDate:
          typeof publicationDate !== "undefined"
            ? publicationDate
            : channel.publicationDate
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createVariantChannelsChangeHandler(
  channelListing: ProductVariantChannelData[],
  setData: (data: ProductVariantChannelData[]) => void,
  triggerChange: () => void
) {
  return (id: string, price: number) => {
    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        price
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    setData(updatedChannels);
    triggerChange();
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<ProductAttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange<string> {
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
  setAttributes: (data: FormsetData<ProductAttributeInputData>) => void,
  setProductType: (productType: ProductType) => void,
  productTypeChoiceList: ProductType[],
  triggerChange: () => void
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    const selectedProductType = productTypeChoiceList.find(
      productType => productType.id === id
    );
    triggerChange();
    setProductType(selectedProductType);
    setAttributes(getAttributeInputFromProductType(selectedProductType));
  };
}

export const getChannelsInput = (channels: ChannelPriceData[]) =>
  channels?.map(channel => ({
    data: channel,
    id: channel.id,
    label: channel.name,
    value: {
      costPrice: channel.costPrice,
      price: channel.price
    }
  }));

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
