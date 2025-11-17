import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { WhereOnlyQueryVarsBuilder } from "./types";

type MetadataFilterInput = {
  key: string;
  value?: { eq?: string; oneOf?: string[] };
};

type QueryWithAnd = {
  AND?: Array<{ metadata?: MetadataFilterInput }>;
};

/** Builds query for MetadataFilterInput fields
 * This is different field from MetadataInput, for these use MetadataInputQueryVarsBuilder
 *
 * Each metadata filter creates a separate entry in the AND array to properly
 * support multiple filters with AND logic between them.
 *
 * @example {AND: [{metadata: {key: "color", value: {eq: "red"}}}, {metadata: {key: "size", value: {eq: "M"}}}]}
 * @important When using this builder, make sure to enable `useAndWrapper` option in FiltersQueryBuilder
 * */
export class MetadataFilterInputQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<QueryWithAnd>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "metadata";
  }

  createOptionFetcher(): Handler {
    // Metadata values are free-form text inputs, so there are no options to show.
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(query: Readonly<QueryWithAnd>, element: FilterElement): QueryWithAnd {
    const { value: selectedValue } = element.condition.selected;

    if (!isTuple(selectedValue)) {
      // Metadata input is malformed, return original query without filter
      return query;
    }

    const [key, value] = selectedValue;

    // If value is empty, omit the value field from the query
    const newMetadataEntry = {
      metadata: value
        ? {
            key,
            value: { eq: value },
          }
        : {
            key,
          },
    };

    const existingAnd = query.AND || [];

    return {
      ...query,
      AND: [...existingAnd, newMetadataEntry],
    };
  }
}
