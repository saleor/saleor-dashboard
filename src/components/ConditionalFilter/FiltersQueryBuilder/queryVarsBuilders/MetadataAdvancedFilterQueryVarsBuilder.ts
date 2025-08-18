import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { WhereOnlyQueryVarsBuilder } from "./types";

/** Builds query for MetadataFilterInput fields
 * This is different field from MetadataInput, for these use MetadataFilterQueryVarsBuilder */
export class MetadataAdvancedFilterQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<{ metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } }> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "metadata";
  }

  createOptionFetcher(): Handler {
    // Metadata values are free-form text inputs, so there are no options to show.
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<{ metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } }>,
    element: FilterElement,
  ): { metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } } {
    const { value: selectedValue } = element.condition.selected;

    if (isTuple(selectedValue)) {
      const [key, value] = selectedValue;

      return {
        ...query,
        metadata: { key, value: { eq: value } },
      };
    }

    // Fallback: use the label as key and value as value
    const metadataKey = element.value.label;
    const metadataValue = String(selectedValue);

    return {
      ...query,
      metadata: { key: metadataKey, value: { eq: metadataValue } },
    };
  }

}
