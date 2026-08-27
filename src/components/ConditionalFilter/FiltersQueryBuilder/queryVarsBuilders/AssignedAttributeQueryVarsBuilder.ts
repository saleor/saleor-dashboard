import { type ApolloClient } from "@apollo/client";
import {
  type AssignedAttributeValueInput,
  type AssignedAttributeWhereInput,
  AttributeInputTypeEnum,
} from "@dashboard/graphql";

import { type Handler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { AttributeQueryVarsBuilder } from "./AttributeQueryVarsBuilder";
import { type WhereOnlyQueryVarsBuilder } from "./types";

type AssignedAttributeFilterQueryPart = { attributes?: AssignedAttributeWhereInput[] };

/**
 * Maps attribute filters to `AssignedAttributeWhereInput` (`{ slug, value }`).
 * Customer (and page/variant) where APIs use this shape; products still use
 * the legacy `AttributeInput` fields via `AttributeQueryVarsBuilder`.
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
    const attribute = this.buildAssignedAttribute(element);

    if (!attribute.slug) {
      return query;
    }

    const existingAttributes = query.attributes || [];

    return {
      ...query,
      attributes: [...existingAttributes, attribute],
    };
  }

  private buildAssignedAttribute(element: FilterElement): AssignedAttributeWhereInput {
    const slug = element.selectedAttribute?.value;

    if (!slug) {
      return { slug: "" };
    }

    const inputType = element.selectedAttribute?.type as AttributeInputTypeEnum;
    const { conditionValue } = element.condition.selected;

    if (!conditionValue) {
      return { slug };
    }

    if (
      inputType === AttributeInputTypeEnum.REFERENCE ||
      inputType === AttributeInputTypeEnum.SINGLE_REFERENCE
    ) {
      return this.buildReferenceAttribute(slug, element);
    }

    if (inputType === AttributeInputTypeEnum.BOOLEAN) {
      return {
        slug,
        value: { boolean: QueryVarsBuilderUtils.getBooleanValueFromElement(element) },
      };
    }

    const value = this.buildValueInput(element, inputType, conditionValue.type);

    return value ? { slug, value } : { slug };
  }

  private buildReferenceAttribute(
    slug: string,
    element: FilterElement,
  ): AssignedAttributeWhereInput {
    const legacy = this.optionFetcher.updateWhereQueryVariables({}, element);
    const legacyAttribute = legacy.attributes?.[0];

    if (legacyAttribute?.value?.reference) {
      return {
        slug,
        value: { reference: legacyAttribute.value.reference },
      };
    }

    return { slug };
  }

  private buildValueInput(
    element: FilterElement,
    inputType: AttributeInputTypeEnum,
    conditionType: string,
  ): AssignedAttributeValueInput | undefined {
    const processedValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);

    if (typeof processedValue === "object" && processedValue && "range" in processedValue) {
      const range = processedValue.range as { gte?: string; lte?: string };

      return this.buildRangeValue(range, inputType, conditionType);
    }

    if (typeof processedValue === "object" && processedValue && "eq" in processedValue) {
      return this.buildEqValue(processedValue.eq, inputType);
    }

    if (typeof processedValue === "object" && processedValue && "oneOf" in processedValue) {
      return this.buildOneOfValue(processedValue.oneOf as unknown[], inputType);
    }

    return undefined;
  }

  private buildEqValue(
    raw: unknown,
    inputType: AttributeInputTypeEnum,
  ): AssignedAttributeValueInput {
    if (inputType === AttributeInputTypeEnum.NUMERIC) {
      return { numeric: { eq: Number(raw) } };
    }

    return { slug: { eq: String(raw) } };
  }

  private buildOneOfValue(
    raw: unknown[],
    inputType: AttributeInputTypeEnum,
  ): AssignedAttributeValueInput {
    if (inputType === AttributeInputTypeEnum.NUMERIC) {
      return { numeric: { oneOf: raw.map(value => Number(value)) } };
    }

    return { slug: { oneOf: raw.map(value => String(value)) } };
  }

  private buildRangeValue(
    range: { gte?: string; lte?: string },
    inputType: AttributeInputTypeEnum,
    conditionType: string,
  ): AssignedAttributeValueInput | undefined {
    const { gte, lte } = range;
    const isDateTimeType = conditionType === "datetime" || conditionType === "datetime.range";
    const isDateType = conditionType === "date" || conditionType === "date.range";

    if (isDateTimeType) {
      return { dateTime: { gte, lte } };
    }

    if (isDateType || inputType === AttributeInputTypeEnum.DATE) {
      return { date: { gte, lte } };
    }

    if (inputType === AttributeInputTypeEnum.NUMERIC) {
      return {
        numeric: {
          range: {
            gte: gte === undefined ? undefined : Number(gte),
            lte: lte === undefined ? undefined : Number(lte),
          },
        },
      };
    }

    return undefined;
  }
}
