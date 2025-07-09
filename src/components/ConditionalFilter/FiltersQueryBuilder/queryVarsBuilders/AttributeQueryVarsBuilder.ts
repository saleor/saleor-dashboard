import { ApolloClient } from "@apollo/client";
import { AttributeInput, AttributeInputTypeEnum } from "@dashboard/graphql";

import { AttributeChoicesHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { WhereOnlyQueryVarsBuilder } from "./types";

export type AttributeFilterQueryPart = { attributes?: AttributeInput[] };

export class AttributeQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<AttributeFilterQueryPart>
{
  public canHandle(element: FilterElement): boolean {
    return element.rowType() === "attribute";
  }

  public createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    const { value: id } = element.selectedAttribute || element.value;

    return new AttributeChoicesHandler(client, id, inputValue);
  }

  public updateWhereQueryVariables(
    query: Readonly<{ attributes?: AttributeInput[] }>,
    element: FilterElement,
  ): { attributes?: AttributeInput[] } {
    const attribute = this.buildAttributeInput(element);

    if (!attribute.slug) {
      return query;
    }

    const existingAttributes = query.attributes || [];

    return {
      ...query,
      attributes: [...existingAttributes, attribute],
    };
  }

  private buildAttributeInput(element: FilterElement): AttributeInput {
    const attributeSlug = element.selectedAttribute?.value;

    if (!attributeSlug) {
      return { slug: "" };
    }

    const baseAttribute = { slug: attributeSlug };
    const { conditionValue } = element.condition.selected;
    const inputType = element.selectedAttribute?.type as AttributeInputTypeEnum;

    if (!conditionValue) {
      return baseAttribute;
    }

    // Handle boolean type attributes
    if (inputType === AttributeInputTypeEnum.BOOLEAN) {
      return {
        ...baseAttribute,
        boolean: QueryVarsBuilderUtils.getBooleanValueFromElement(element),
      };
    }

    // Handle other types with condition values
    return this.buildConditionAttribute(baseAttribute, element, conditionValue.type);
  }

  private buildConditionAttribute(
    baseAttribute: AttributeInput,
    element: FilterElement,
    type: string,
  ): AttributeInput {
    const processedValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);

    if (typeof processedValue === "object" && processedValue && "range" in processedValue) {
      return this.buildRangeCondition(baseAttribute, processedValue.range, type);
    }

    if (typeof processedValue === "object" && processedValue && "eq" in processedValue) {
      return { ...baseAttribute, values: [processedValue.eq] };
    }

    if (typeof processedValue === "object" && processedValue && "oneOf" in processedValue) {
      return { ...baseAttribute, values: processedValue.oneOf };
    }

    return baseAttribute;
  }

  private buildRangeCondition(
    baseAttribute: AttributeInput,
    range: { gte?: string; lte?: string },
    type: string,
  ): AttributeInput {
    const { gte, lte } = range;

    if (gte && lte) {
      return {
        ...baseAttribute,
        ...this.getRangeQueryPart([gte, lte], type, "range"),
      };
    }

    if (gte) {
      return {
        ...baseAttribute,
        ...this.getRangeQueryPart(gte, type, "gte"),
      };
    }

    if (lte) {
      return {
        ...baseAttribute,
        ...this.getRangeQueryPart(lte, type, "lte"),
      };
    }

    return baseAttribute;
  }

  private getRangeQueryPart(
    value: string | [string, string],
    type: string,
    operation: "gte" | "lte" | "range",
  ) {
    const isDateTimeType = type === "datetime" || type === "datetime.range";
    const isDateType = type === "date" || type === "date.range";

    if (operation === "range" && Array.isArray(value)) {
      const [gte, lte] = value;

      if (isDateTimeType) {
        return { dateTime: { gte, lte } };
      }

      if (isDateType) {
        return { date: { gte, lte } };
      }

      return { valuesRange: { gte: parseFloat(gte), lte: parseFloat(lte) } };
    }

    if (typeof value === "string") {
      if (isDateTimeType) {
        return { dateTime: { [operation]: value } };
      }

      if (isDateType) {
        return { date: { [operation]: value } };
      }

      return { valuesRange: { [operation]: parseFloat(value) } };
    }

    return {};
  }
}
