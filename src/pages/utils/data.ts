import {
  getSelectedAttributeValues,
  mergeChoicesWithValues
} from "@saleor/attributes/utils/data";
import { AttributeInput } from "@saleor/components/Attributes";
import { mapEdgesToItems } from "@saleor/utils/maps";

import {
  PageDetails_page,
  PageDetails_page_pageType
} from "../types/PageDetails";

export function getAttributeInputFromPage(
  page: PageDetails_page
): AttributeInput[] {
  return page?.attributes.map(attribute => ({
    data: {
      entityType: attribute.attribute.entityType,
      inputType: attribute.attribute.inputType,
      isRequired: attribute.attribute.valueRequired,
      selectedValues: attribute.values,
      values: mergeChoicesWithValues(attribute),
      unit: attribute.attribute.unit
    },
    id: attribute.attribute.id,
    label: attribute.attribute.name,
    value: getSelectedAttributeValues(attribute)
  }));
}

export function getAttributeInputFromPageType(
  pageType: PageDetails_page_pageType
): AttributeInput[] {
  return pageType?.attributes.map(attribute => ({
    data: {
      entityType: attribute.entityType,
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: mapEdgesToItems(attribute.choices) || []
    },
    id: attribute.id,
    label: attribute.name,
    value: []
  }));
}
