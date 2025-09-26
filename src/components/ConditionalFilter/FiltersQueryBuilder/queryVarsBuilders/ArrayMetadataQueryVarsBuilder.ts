import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { WhereOnlyQueryVarsBuilder } from "./types";

type MetadataInput = { metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } };

type ArrayMetadataFilterQueryPart = {
  lines?: Array<MetadataInput>;
  transactions?: Array<MetadataInput>;
  fulfillments?: Array<MetadataInput>;
};

/** Builds query for metadata fields nested in array structures (lines, transactions, fulfillments)
 * Each filter creates a new array element, with same-key merging using oneOf
 *
 * Example:
 * [{metadata: {key: "key", value: {eq: "a"}}}, {metadata: {key: "key2", value: {eq: "c"}}}]
 * For input values: key - a; key2 - c
 *
 * Example duplicate keys:
 * [{metadata: {key: "key", value: {oneOf: ["b", c]}}}]
 * For input values: key - b; key - c
 * */
export class ArrayMetadataQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<ArrayMetadataFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    const type = element.value.type;

    return (
      type === "linesMetadata" || type === "transactionsMetadata" || type === "fulfillmentsMetadata"
    );
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<ArrayMetadataFilterQueryPart>,
    element: FilterElement,
  ): ArrayMetadataFilterQueryPart {
    const type = element.value.type;
    const { value: selectedValue } = element.condition.selected;

    let key: string;
    let value: string;

    if (isTuple(selectedValue)) {
      [key, value] = selectedValue;
    } else {
      // Metadata is malformed, we cannot build query, abort
      return query;
    }

    const metadataFilter = { key, value: { eq: value } };
    const newQuery = { ...query };

    if (type === "linesMetadata") {
      const existingArray = newQuery.lines || [];
      const mergedArray = this.mergeMetadataIntoArray(existingArray, metadataFilter);

      newQuery.lines = mergedArray;
    } else if (type === "transactionsMetadata") {
      const existingArray = newQuery.transactions || [];
      const mergedArray = this.mergeMetadataIntoArray(existingArray, metadataFilter);

      newQuery.transactions = mergedArray;
    } else if (type === "fulfillmentsMetadata") {
      const existingArray = newQuery.fulfillments || [];
      const mergedArray = this.mergeMetadataIntoArray(existingArray, metadataFilter);

      newQuery.fulfillments = mergedArray;
    }

    return newQuery;
  }

  private mergeMetadataIntoArray(
    existingArray: Array<{ metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } }>,
    newFilter: { key: string; value: { eq: string } },
  ): Array<{ metadata?: { key: string; value?: { eq?: string; oneOf?: string[] } } }> {
    // Find existing element with the same key
    const existingIndex = existingArray.findIndex(item => item.metadata?.key === newFilter.key);

    if (existingIndex !== -1) {
      // Merge with existing element
      const existingElement = existingArray[existingIndex];
      const existingValue = existingElement.metadata?.value;

      let mergedValue: { eq?: string; oneOf?: string[] };

      if (existingValue?.oneOf) {
        // Already has oneOf, add to it
        mergedValue = { oneOf: [...existingValue.oneOf, newFilter.value.eq] };
      } else if (existingValue?.eq) {
        // Has single eq value, convert to oneOf
        mergedValue = { oneOf: [existingValue.eq, newFilter.value.eq] };
      } else {
        // Fallback
        mergedValue = newFilter.value;
      }

      const updatedArray = [...existingArray];

      updatedArray[existingIndex] = {
        ...existingElement,
        metadata: { key: newFilter.key, value: mergedValue },
      };

      return updatedArray;
    } else {
      // Add new element
      return [...existingArray, { metadata: newFilter }];
    }
  }
}
