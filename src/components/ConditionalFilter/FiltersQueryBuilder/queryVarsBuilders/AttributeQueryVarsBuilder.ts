import { type ApolloClient } from "@apollo/client";
import {
  type AssignedAttributeValueInput,
  AttributeEntityTypeEnum,
  type AttributeInput,
  AttributeInputTypeEnum,
} from "@dashboard/graphql";

import {
  AttributeChoicesHandler,
  CategoryHandler,
  CollectionHandler,
  type Handler,
  PageHandler,
  ProductsHandler,
  ProductVariantHandler,
} from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import {
  type ConditionValue,
  isItemOption,
  isItemOptionArray,
} from "../../FilterElement/ConditionValue";
import { QueryVarsBuilderUtils } from "../utils";
import { type BothApiQueryVarsBuilder } from "./types";

type AttributeFilterQueryPart = { attributes?: AttributeInput[] };

/**
 * Builds `AttributeInput` for product list (WHERE) and product export (FILTER).
 * Every item uses `value` only — mixing deprecated `values`/`boolean`/`date`
 * with reference `value` makes Saleor reject the whole `attributes` list.
 */
export class AttributeQueryVarsBuilder
  implements BothApiQueryVarsBuilder<AttributeFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    return element.rowType() === "attribute";
  }

  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    const { entityType, value: id, type } = element.selectedAttribute || element.value;

    switch (entityType) {
      case AttributeEntityTypeEnum.PAGE:
        return new PageHandler(client, inputValue);
      case AttributeEntityTypeEnum.PRODUCT:
        return new ProductsHandler(client, inputValue);
      case AttributeEntityTypeEnum.PRODUCT_VARIANT:
        return new ProductVariantHandler(client, inputValue);
      case AttributeEntityTypeEnum.CATEGORY:
        return new CategoryHandler(client, inputValue);
      case AttributeEntityTypeEnum.COLLECTION:
        return new CollectionHandler(client, inputValue);
      default:
        return new AttributeChoicesHandler(client, id, inputValue, type);
    }
  }

  updateWhereQueryVariables(
    query: Readonly<AttributeFilterQueryPart>,
    element: FilterElement,
  ): AttributeFilterQueryPart {
    return this.appendAttribute(query, element);
  }

  updateFilterQueryVariables(
    query: Readonly<AttributeFilterQueryPart>,
    element: FilterElement,
  ): AttributeFilterQueryPart {
    return this.appendAttribute(query, element);
  }

  private appendAttribute(
    query: Readonly<AttributeFilterQueryPart>,
    element: FilterElement,
  ): AttributeFilterQueryPart {
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

    const baseAttribute: AttributeInput = { slug: attributeSlug };
    const { value, conditionValue } = element.condition.selected;
    const inputType = element.selectedAttribute?.type as AttributeInputTypeEnum;

    if (!conditionValue) {
      return baseAttribute;
    }

    if (
      inputType === AttributeInputTypeEnum.REFERENCE ||
      inputType === AttributeInputTypeEnum.SINGLE_REFERENCE
    ) {
      return this.buildReferenceAttribute(baseAttribute, value);
    }

    if (inputType === AttributeInputTypeEnum.BOOLEAN) {
      return {
        ...baseAttribute,
        value: { boolean: QueryVarsBuilderUtils.getBooleanValueFromElement(element) },
      };
    }

    const assignedValue = this.buildValueInput(element, inputType, conditionValue.type);

    return assignedValue ? { ...baseAttribute, value: assignedValue } : baseAttribute;
  }

  private buildReferenceAttribute(
    baseAttribute: AttributeInput,
    value: ConditionValue,
  ): AttributeInput {
    if (isItemOption(value)) {
      return {
        ...baseAttribute,
        value: {
          reference: this.buildReferenceFilter([value.value]),
        },
      };
    }

    if (isItemOptionArray(value)) {
      if (value.length === 0) {
        return baseAttribute;
      }

      const referencedObjectIds = value.map(item => item.value);

      return {
        ...baseAttribute,
        value: {
          reference: this.buildReferenceFilter(referencedObjectIds),
        },
      };
    }

    return baseAttribute;
  }

  private buildReferenceFilter(referencedObjectIds: string[]): {
    referencedIds: { containsAny: string[] };
  } {
    const filterValue = {
      // Sort list to ensure we don't make the same query with different order of IDs
      containsAny: [...referencedObjectIds].sort((a, b) => a.localeCompare(b)),
    };

    return { referencedIds: filterValue };
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
