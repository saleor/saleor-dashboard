import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class MetadataDefinition
  implements BothApiFilterDefinition<{ metadata?: Array<{ key: string; value: string }> }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "metadata";
  }

  createOptionFetcher(): Handler {
    // Metadata values are free-form text inputs, so there are no options to show.
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(
    query: Readonly<{ metadata?: Array<{ key: string; value: string }> }>,
    element: FilterElement,
  ): { metadata?: Array<{ key: string; value: string }> } {
    const { value: selectedValue } = element.condition.selected;
    const existing = query.metadata || [];

    if (isTuple(selectedValue)) {
      const [key, value] = selectedValue;

      return {
        ...query,
        metadata: [...existing, { key, value }],
      };
    }

    // Fallback: use the label as key and value as value
    const metadataKey = element.value.label;
    const metadataValue = String(selectedValue);

    return {
      ...query,
      metadata: [...existing, { key: metadataKey, value: metadataValue }],
    };
  }

  updateFilterQuery(
    query: Readonly<{ metadata?: Array<{ key: string; value: string }> }>,
    element: FilterElement,
  ): { metadata?: Array<{ key: string; value: string }> } {
    // For metadata, both WHERE and FILTER APIs use the same format
    return this.updateWhereQuery(query, element);
  }
}
