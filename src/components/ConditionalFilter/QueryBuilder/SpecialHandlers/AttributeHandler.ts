import { AttributeInput, AttributeInputTypeEnum } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray, isTuple } from "../../FilterElement/ConditionValue";
import { SpecialHandler } from "../types";

export class AttributeHandler implements SpecialHandler<{ attributes?: AttributeInput[] | null }> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "attribute";
  }

  handle(result: { attributes?: AttributeInput[] | null }, element: FilterElement): void {
    if (!result.attributes) {
      result.attributes = [];
    }

    const attributeSlug = element.selectedAttribute?.value;

    if (!attributeSlug) {
      return;
    }

    const selected = element.condition.selected;
    const inputType = element.selectedAttribute?.type as AttributeInputTypeEnum;

    if (!selected.conditionValue) {
      result.attributes.push({ slug: attributeSlug });

      return;
    }

    const { label, type } = selected.conditionValue;
    const { value } = selected;

    // Handle REFERENCE type attributes (use valueNames)
    if (inputType === "REFERENCE") {
      if (isItemOption(value)) {
        result.attributes.push({ slug: attributeSlug, valueNames: [value.label] });

        return;
      }

      if (isItemOptionArray(value)) {
        result.attributes.push({
          slug: attributeSlug,
          valueNames: value.map(item => item.label),
        });

        return;
      }
    }

    // Handle range queries
    if (label === "lower" && typeof value === "string") {
      result.attributes.push({
        slug: attributeSlug,
        ...this.getQueryPartByType(value, type, "lte"),
      });

      return;
    }

    if (label === "greater" && typeof value === "string") {
      result.attributes.push({
        slug: attributeSlug,
        ...this.getQueryPartByType(value, type, "gte"),
      });

      return;
    }

    if (isTuple(value) && label === "between") {
      result.attributes.push({
        slug: attributeSlug,
        ...this.getRangeQueryPartByType(value, type),
      });

      return;
    }

    // Handle item options (use originalSlug if available)
    if (isItemOption(value)) {
      result.attributes.push({
        slug: attributeSlug,
        values: [value.originalSlug || value.value],
      });

      return;
    }

    if (isItemOptionArray(value)) {
      result.attributes.push({
        slug: attributeSlug,
        values: value.map(x => x.originalSlug || x.value),
      });

      return;
    }

    if (typeof value === "string") {
      result.attributes.push({ slug: attributeSlug, values: [value] });

      return;
    }

    if (Array.isArray(value)) {
      result.attributes.push({ slug: attributeSlug, values: value });

      return;
    }

    if (value === "true" || value === "false") {
      result.attributes.push({ slug: attributeSlug, boolean: value });

      return;
    }

    // Fallback
    result.attributes.push(value as any);
  }

  private getQueryPartByType(value: string, type: string, what: "lte" | "gte") {
    switch (type) {
      case "datetime":
        return { dateTime: { [what]: value } };
      case "date":
        return { date: { [what]: value } };
      default:
        return { valuesRange: { [what]: parseFloat(value) } };
    }
  }

  private getRangeQueryPartByType(value: [string, string], type: string) {
    const [gte, lte] = value;

    switch (type) {
      case "datetime.range":
        return { dateTime: { lte, gte } };
      case "date.range":
        return { date: { lte, gte } };
      case "number.range":
      default:
        return { valuesRange: { lte: parseFloat(lte), gte: parseFloat(gte) } };
    }
  }
}
