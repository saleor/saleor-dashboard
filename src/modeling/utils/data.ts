// @ts-strict-ignore
import {
  getSelectedAttributeValues,
  mergeChoicesWithValues,
} from "@dashboard/attributes/utils/data";
import { AttributeInput } from "@dashboard/components/Attributes";
import { PageDetailsFragment } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export function getAttributeInputFromPage(page: PageDetailsFragment): AttributeInput[] {
  return page?.attributes.map(attribute => ({
    data: {
      entityType: attribute.attribute.entityType,
      inputType: attribute.attribute.inputType,
      isRequired: attribute.attribute.valueRequired,
      selectedValues: attribute.values,
      values: mergeChoicesWithValues(attribute),
      unit: attribute.attribute.unit,
    },
    id: attribute.attribute.id,
    label: attribute.attribute.name,
    value: getSelectedAttributeValues(attribute),
  }));
}

export function getAttributeInputFromPageType(
  pageType: PageDetailsFragment["pageType"],
): AttributeInput[] {
  return pageType?.attributes.map(attribute => ({
    data: {
      entityType: attribute.entityType,
      inputType: attribute.inputType,
      isRequired: attribute.valueRequired,
      values: mapEdgesToItems(attribute.choices) || [],
    },
    id: attribute.id,
    label: attribute.name,
    value: [],
  }));
}
