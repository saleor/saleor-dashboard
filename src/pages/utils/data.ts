import { PageAttributeInput } from "../components/PageAttributes";
import { PageDetails_page_pageType } from "../types/PageDetails";

export function getAttributeInputFromPageType(
  pageType: PageDetails_page_pageType
): PageAttributeInput[] {
  return pageType.attributes.map(attribute => ({
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
