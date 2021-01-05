import { AttributeInput } from "@saleor/components/Attributes";
import { FormsetData } from "@saleor/hooks/useFormset";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";

import {
  PageDetails_page,
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
  attributesWithNewFileValue: FormsetData<null, File>,
  referencePages: SearchPages_search_edges_node[]
) =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.REFERENCE) {
      return {
        ...attribute,
        data: {
          ...attribute.data,
          references: attribute.value.map(value =>
            referencePages.find(reference => reference.id === value)
          )
        }
      };
    }

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

export const getAttributeValuesFromReferences = (
  attributeId: string,
  attributes: AttributeInput[],
  referencePages: SearchPages_search_edges_node[]
) => {
  const attribute = attributes?.find(attribute => attribute.id === attributeId);

  return (
    referencePages?.filter(
      value =>
        !attribute?.value?.some(selectedValue => selectedValue === value.id)
    ) || []
  );
};
