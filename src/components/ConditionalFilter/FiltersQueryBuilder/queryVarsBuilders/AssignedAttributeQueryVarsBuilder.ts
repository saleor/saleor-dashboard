import { type ApolloClient } from "@apollo/client";
import { type AssignedAttributeWhereInput } from "@dashboard/graphql";

import { type Handler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement/FilterElement";
import { AttributeQueryVarsBuilder } from "./AttributeQueryVarsBuilder";
import { type WhereOnlyQueryVarsBuilder } from "./types";

type AssignedAttributeFilterQueryPart = { attributes?: AssignedAttributeWhereInput[] };

/**
 * Maps attribute filters to `AssignedAttributeWhereInput` (`{ slug, value }`).
 * Product list/export use the same `value` shape via `AttributeQueryVarsBuilder`.
 */
export class AssignedAttributeQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<AssignedAttributeFilterQueryPart>
{
  private readonly optionFetcher = new AttributeQueryVarsBuilder();

  canHandle(element: FilterElement): boolean {
    return this.optionFetcher.canHandle(element);
  }

  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    return this.optionFetcher.createOptionFetcher(client, inputValue, element);
  }

  updateWhereQueryVariables(
    query: Readonly<AssignedAttributeFilterQueryPart>,
    element: FilterElement,
  ): AssignedAttributeFilterQueryPart {
    const built = this.optionFetcher.updateWhereQueryVariables({}, element);
    const attribute = built.attributes?.[0];

    if (!attribute?.slug) {
      return query;
    }

    const mapped: AssignedAttributeWhereInput = {
      slug: attribute.slug,
      value: attribute.value,
    };

    return {
      ...query,
      attributes: [...(query.attributes || []), mapped],
    };
  }
}
