import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { ProductVariantPageFormData } from "@saleor/products/components/ProductVariantPage";
import { ProductUpdatePageFormData } from "@saleor/products/utils/data";
import { toggle } from "@saleor/utils/lists";

import { ProductAttributeInputData } from "../components/ProductAttributes";
import { getAttributeInputFromProductType, ProductType } from "./data";

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
  data: ProductUpdatePageFormData,
  updateChannels: (data: ProductUpdatePageFormData) => void,
  triggerChange: () => void
) {
  return (id: string, price: number) => {
    const { channelListing } = data;

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
    updateChannels({ ...data, channelListing: updatedChannels });
    triggerChange();
  };
}

export function createChannelsChangeHandler(
  data: ProductUpdatePageFormData,
  updateChannels: (data: ProductUpdatePageFormData) => void,
  triggerChange: () => void
) {
  return (
    id: string,
    {
      isPublished,
      publicationDate
    }: { isPublished: boolean; publicationDate: string | null }
  ) => {
    const { channelListing } = data;

    const channelIndex = channelListing.findIndex(channel => channel.id === id);
    const channel = channelListing[channelIndex];

    const updatedChannels = [
      ...channelListing.slice(0, channelIndex),
      {
        ...channel,
        isPublished: isPublished || channel.isPublished,
        publicationDate: publicationDate || channel.publicationDate
      },
      ...channelListing.slice(channelIndex + 1)
    ];
    updateChannels({ ...data, channelListing: updatedChannels });
    triggerChange();
  };
}

export function createVariantChannelsChangeHandler(
  data: ProductVariantPageFormData,
  setData: (data: ProductVariantPageFormData) => void,
  triggerChange: () => void
) {
  return (id: string, price: number) => {
    const { channelListing } = data;
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

interface ProductAvailabilityArgs {
  availableForPurchase: string | null;
  isAvailableForPurchase: boolean;
  productId: string;
}

export const getProductAvailabilityVariables = ({
  isAvailableForPurchase,
  availableForPurchase,
  productId
}: ProductAvailabilityArgs) => ({
  isAvailable: isAvailableForPurchase,
  productId,
  startDate: availableForPurchase || null
});
