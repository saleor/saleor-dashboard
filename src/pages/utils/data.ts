import { AttributeInput } from "@saleor/components/Attributes";
import { FormsetData } from "@saleor/hooks/useFormset";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";

import { PageSubmitData } from "../components/PageDetailsPage/form";
import {
  PageDetails_page,
  PageDetails_page_attributes,
  PageDetails_page_pageType
} from "../types/PageDetails";

export function getAttributeInputFromPage(
  page: PageDetails_page
): AttributeInput[] {
  return page?.attributes.map(attribute => ({
    data: {
      inputType: attribute.attribute.inputType,
      isRequired: attribute.attribute.valueRequired,
      selectedValues: attribute.values,
      values: attribute.attribute.values
    },
    id: attribute.attribute.id,
    label: attribute.attribute.name,
    value: attribute.values.map(value => value.slug)
  }));
}

export function getAttributeInputFromPageType(
  pageType: PageDetails_page_pageType
): AttributeInput[] {
  return pageType?.attributes.map(attribute => ({
    data: {
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: attribute.values
    },
    id: attribute.id,
    label: attribute.name,
    value: []
  }));
}

export const getAttributesDisplayData = (
  attributes: AttributeInput[],
  attributesWithNewFileValue: FormsetData<null, File>
) =>
  attributes.map(attribute => {
    const attributeWithNewFileValue = attributesWithNewFileValue.find(
      attributeWithNewFile => attribute.id === attributeWithNewFile.id
    );

    if (attributeWithNewFileValue) {
      return {
        ...attribute,
        value: attributeWithNewFileValue?.value?.name
          ? [attributeWithNewFileValue.value.name]
          : []
      };
    }
    return attribute;
  });

export const isFileValueUnused = (
  data: PageSubmitData,
  existingAttribute: PageDetails_page_attributes
) => {
  if (existingAttribute.attribute.inputType !== AttributeInputTypeEnum.FILE) {
    return false;
  }
  if (existingAttribute.values.length === 0) {
    return false;
  }

  const modifiedAttribute = data.attributesWithNewFileValue.find(
    dataAttribute => dataAttribute.id === existingAttribute.attribute.id
  );

  return !!modifiedAttribute;
};
