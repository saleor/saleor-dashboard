import { AttributeInput, AttributeInputTypeEnum } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray, isTuple } from "../../FilterElement/ConditionValue";

export class AttributeQueryBuilder {
  static build(element: FilterElement): AttributeInput {
    const attributeSlug = element.selectedAttribute?.value;

    if (!attributeSlug) {
      return { slug: "" };
    }

    const selected = element.condition.selected;
    const inputType = element.selectedAttribute?.type as AttributeInputTypeEnum;

    if (!selected.conditionValue) {
      return { slug: attributeSlug };
    }

    const { label, type } = selected.conditionValue;
    const { value } = selected;

    if (inputType === AttributeInputTypeEnum.REFERENCE) {
      if (isItemOption(value)) {
        return { slug: attributeSlug, valueNames: [value.label] };
      }

      if (isItemOptionArray(value)) {
        if (value.length === 0) {
          return { slug: attributeSlug };
        }

        return {
          slug: attributeSlug,
          valueNames: value.map(item => item.label),
        };
      }

      return { slug: attributeSlug };
    }

    if (inputType === AttributeInputTypeEnum.BOOLEAN) {
      return {
        slug: attributeSlug,
        boolean: isItemOption(value) ? value.value === "true" : value === "true",
      };
    }

    if (label === "lower" && typeof value === "string") {
      return { slug: attributeSlug, ...this.getQueryPartByType(value, type, "lte") };
    }

    if (label === "greater" && typeof value === "string") {
      return { slug: attributeSlug, ...this.getQueryPartByType(value, type, "gte") };
    }

    if (isTuple(value) && label === "between") {
      return { slug: attributeSlug, ...this.getRangeQueryPartByType(value, type) };
    }

    if (isItemOption(value)) {
      return { slug: attributeSlug, values: [value.originalSlug || value.value] };
    }

    if (isItemOptionArray(value)) {
      return { slug: attributeSlug, values: value.map(x => x.originalSlug || x.value) };
    }

    if (typeof value === "string") {
      return { slug: attributeSlug, values: [value] };
    }

    if (Array.isArray(value) && typeof value[0] === "string") {
      return { slug: attributeSlug, values: value as string[] };
    }

    return { slug: attributeSlug };
  }

  private static getQueryPartByType(value: string, type: string, what: "lte" | "gte") {
    switch (type) {
      case "datetime":
        return { dateTime: { [what]: value } };
      case "date":
        return { date: { [what]: value } };
      default:
        return { valuesRange: { [what]: parseFloat(value) } };
    }
  }

  private static getRangeQueryPartByType(value: [string, string], type: string) {
    const [gte, lte] = value;

    switch (type) {
      case "datetime.range":
        return { dateTime: { lte, gte } };
      case "date.range":
        return { date: { lte, gte } };
      default:
        return { valuesRange: { lte: parseFloat(lte), gte: parseFloat(gte) } };
    }
  }
}
