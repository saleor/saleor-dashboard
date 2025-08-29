import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { WhereOnlyQueryVarsBuilder } from "./types";

/** Builds query for MetadataFilterInput fields
 * This is different field from MetadataInput, for these use MetadataFilterQueryVarsBuilder
 *
 * It supports making a query for single `key` with multiple `values`
 * E.g. {metadata: {key: "key", value: {oneOf: ["a", "b"]}}}
 * if user created multiple input entries: key - a; key - b
 * */
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

    let key: string;
    let value: string;

    if (isTuple(selectedValue)) {
      [key, value] = selectedValue;
    } else {
      // Metadata input is malformed, return original query without filter
      return query
    }

    // Check if we already have a metadata filter for this key
    const existingMetadata = query.metadata;

    if (existingMetadata && existingMetadata.key === key) {
      // Same key: merge values using oneOf
      const existingValue = existingMetadata.value;

      if (existingValue?.oneOf) {
        // Already has oneOf, add to it
        return {
          ...query,
          metadata: {
            key,
            value: { oneOf: [...existingValue.oneOf, value] },
          },
        };
      } else if (existingValue?.eq) {
        // Has single eq value, convert to oneOf
        return {
          ...query,
          metadata: {
            key,
            value: { oneOf: [existingValue.eq, value] },
          },
        };
      }
    }

    // New key or no existing metadata
    return {
      ...query,
      metadata: { key, value: { eq: value } },
    };
  }

}
