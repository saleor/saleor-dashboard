import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
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

export function createChannelsChangeHandler(
  data: ProductUpdatePageFormData,
  updateChannels: (data: ProductUpdatePageFormData) => void,
  triggerChange: () => void
) {
  return (index: number) => (channelData: {
    isPublished: boolean;
    publicationDate: string | null;
  }) => {
    const channels = data.channelListing;
    const newChannels = [...channels];
    newChannels[index] = {
      ...channels[index],
      isPublished: channelData.isPublished,
      publicationDate: channelData.publicationDate
    };
    updateChannels({ ...data, channelListing: newChannels });
    triggerChange();
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<ProductAttributeInputData>,
  triggerChange: () => void
): FormsetChange {
  return (attributeId: string, value: string) => {
    const attributeValue = attributes
      .find(attribute => attribute.id === attributeId)
      .data.values.find(attributeValue => attributeValue.slug === value);

    const valueChoice = {
      label: attributeValue ? attributeValue.name : value,
      value
    };

    const itemIndex = attributes.findIndex(item => item.id === attributeId);
    const attributeValues: MultiAutocompleteChoiceType[] = attributes[
      itemIndex
    ].data.values.map(value => ({
      label: value.name,
      value: value.id
    }));

    const newAttributeValues = toggle(
      valueChoice,
      attributeValues,
      (a, b) => a.value === b.value
    );

    triggerChange();
    changeAttributeData(
      attributeId,
      newAttributeValues.map(({ value }) => value)
    );
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

export function getProductAvailabilityVariables({
  isAvailableForPurchase,
  availableForPurchase,
  productId
}: ProductAvailabilityArgs) {
  const isAvailable =
    availableForPurchase && !isAvailableForPurchase
      ? true
      : isAvailableForPurchase;

  return {
    isAvailable,
    productId,
    startDate: isAvailableForPurchase
      ? null
      : availableForPurchase !== ""
      ? availableForPurchase
      : null
  };
}
