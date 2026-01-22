import {
  getSelectedAttributeValues,
  mergeChoicesWithValues,
} from "@dashboard/attributes/utils/data";
import { AttributeInput } from "@dashboard/components/Attributes";
import { PageDetailsFragment } from "@dashboard/graphql";
import { AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export function getAttributeInputFromPage(page: PageDetailsFragment): AttributeInput[] {
  return page?.attributes
    .filter(attribute => attribute.attribute.inputType !== null)
    .map(attribute => {
      const metadata: AttributeValuesMetadata[] = attribute.values
        .filter(value => value.reference !== null)
        .map(value => ({
          label: value.name ?? "",
          value: value.reference!,
        }));

      return {
        data: {
          inputType: attribute.attribute.inputType!,
          entityType: attribute.attribute.entityType ?? undefined,
          isRequired: attribute.attribute.valueRequired,
          selectedValues: attribute.values,
          values: mergeChoicesWithValues(attribute),
          unit: attribute.attribute.unit,
        },
        id: attribute.attribute.id,
        label: attribute.attribute.name ?? "",
        value: getSelectedAttributeValues(attribute),
        /** Load selected options in this attribute to useFormset metadata
         * in order to display labels for selection correctly in the UI
         * see: src/attributes/utils/data.ts */
        additionalData: metadata,
      };
    });
}

export function getAttributeInputFromPageType(
  pageType: PageDetailsFragment["pageType"],
): AttributeInput[] {
  if (!pageType?.attributes) {
    return [];
  }

  return pageType.attributes
    .filter(attribute => attribute.inputType !== null)
    .map(attribute => ({
      data: {
        inputType: attribute.inputType!,
        entityType: attribute.entityType ?? undefined,
        isRequired: attribute.valueRequired,
        values: mapEdgesToItems(attribute.choices) || [],
      },
      id: attribute.id,
      label: attribute.name ?? "",
      value: [],
    }));
}
