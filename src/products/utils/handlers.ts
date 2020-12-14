import {
  ChannelData,
  ChannelPriceArgs,
  ChannelPriceData
} from "@saleor/channels/utils";
import { AttributeInputData } from "@saleor/components/Attributes";
import { FormChange } from "@saleor/hooks/useForm";
import {
  FormsetAtomicData,
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { toggle } from "@saleor/utils/lists";

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
  channelListings: ChannelPriceData[],
  updateChannels: (data: ChannelPriceData[]) => void,
  triggerChange: () => void
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id
    );
    const channel = channelListings[channelIndex];

    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        costPrice,
        price
      },
      ...channelListings.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createChannelsChangeHandler(
  channelListings: ChannelData[],
  updateChannels: (data: ChannelData[]) => void,
  triggerChange: () => void
) {
  return (
    id: string,
    data: Omit<ChannelData, "name" | "price" | "currency" | "id">
  ) => {
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id
    );
    const channel = channelListings[channelIndex];

    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        ...data
      },
      ...channelListings.slice(channelIndex + 1)
    ];
    updateChannels(updatedChannels);
    triggerChange();
  };
}

export function createVariantChannelsChangeHandler(
  channelListings: ChannelPriceData[],
  setData: (data: ChannelPriceData[]) => void,
  triggerChange: () => void
) {
  return (id: string, priceData: ChannelPriceArgs) => {
    const { costPrice, price } = priceData;
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id
    );
    const channel = channelListings[channelIndex];

    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        costPrice,
        price
      },
      ...channelListings.slice(channelIndex + 1)
    ];
    setData(updatedChannels);
    triggerChange();
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
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

export function createAttributeFileChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributesWithNewFileValue: FormsetData<FormsetData<null, File>>,
  addAttributeNewFileValue: (data: FormsetAtomicData<null, File>) => void,
  changeAttributeNewFileValue: FormsetChange<File>,
  triggerChange: () => void
): FormsetChange<File> {
  return (attributeId: string, value: File) => {
    triggerChange();

    const newFileValueAssigned = attributesWithNewFileValue.find(
      attribute => attribute.id === attributeId
    );

    if (newFileValueAssigned) {
      changeAttributeNewFileValue(attributeId, value);
    } else {
      addAttributeNewFileValue({
        data: null,
        id: attributeId,
        label: null,
        value
      });
    }

    changeAttributeData(attributeId, value ? [value.name] : []);
  };
}

export function createProductTypeSelectHandler(
  setAttributes: (data: FormsetData<AttributeInputData>) => void,
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
      costPrice: channel.costPrice || "",
      price: channel.price || ""
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
