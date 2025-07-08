import { AttributeInput } from "../../../graphql";
import { FilterElement } from "../FilterElement";
import {
  ConditionValue,
  isItemOption,
  isItemOptionArray,
  isTuple,
} from "../FilterElement/ConditionValue";
import { StaticQueryPart } from "./types";

export type ProcessedConditionValue =
  | string
  | boolean
  | string[]
  | { range: { gte?: string; lte?: string } }
  | { eq: string }
  | { oneOf: string[] };

/**
 * Helper function to extract boolean value from different value types.
 */
function extractBooleanValue(value: ConditionValue): boolean {
  if (isItemOption(value)) {
    return value.value === "true";
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value) === "true";
}

/**
 * Extracts the actual value from ItemOption or returns the value as-is.
 */
function extractValueFromOption(value: ConditionValue): string {
  return isItemOption(value) ? value.value : (value as string);
}

/**
 * Extracts values from ItemOption array using originalSlug if available.
 */
function extractValuesFromOptionArray(value: ConditionValue): string[] {
  if (isItemOptionArray(value)) {
    return value.map(x => x.originalSlug || x.value);
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value;
  }

  return [];
}

/**
 * Extracts a boolean value from various input formats.
 * Handles ItemOption with string values, direct boolean, or stringified values.
 */
export function getBooleanValueFromElement(element: FilterElement): boolean {
  const { value: selectedValue } = element.condition.selected;

  return extractBooleanValue(selectedValue);
}

/**
 * Processes condition values for different condition types.
 */
export const extractConditionValueFromFilterElement = (
  element: FilterElement,
): ProcessedConditionValue => {
  const { value: selectedValue, conditionValue } = element.condition.selected;

  if (!conditionValue) {
    return "";
  }

  const { label } = conditionValue;

  // Handle range conditions
  if (label === "lower") {
    const value = extractValueFromOption(selectedValue);
    const range = { lte: value };

    return { range };
  }

  if (label === "greater") {
    const value = extractValueFromOption(selectedValue);
    const range = { gte: value };

    return { range };
  }

  if (isTuple(selectedValue) && label === "between") {
    const [gte, lte] = selectedValue;
    const range = { gte, lte };

    return { range };
  }

  // Handle boolean values
  if (isItemOption(selectedValue) && ["true", "false"].includes(selectedValue.value)) {
    return extractBooleanValue(selectedValue);
  }

  if (typeof selectedValue === "string" && ["true", "false"].includes(selectedValue)) {
    return extractBooleanValue(selectedValue);
  }

  // Handle single option values
  if (isItemOption(selectedValue)) {
    const eq = selectedValue.originalSlug || selectedValue.value;

    return { eq };
  }

  // Handle multiple option values
  if (isItemOptionArray(selectedValue)) {
    const oneOf = extractValuesFromOptionArray(selectedValue);

    return { oneOf };
  }

  // Handle string values
  if (typeof selectedValue === "string") {
    const eq = selectedValue;

    return { eq };
  }

  // Handle string arrays
  if (Array.isArray(selectedValue) && typeof selectedValue[0] === "string") {
    const oneOf = selectedValue;

    return { oneOf };
  }

  return selectedValue;
};

const mapStaticQueryPartToLegacyVariables = (queryPart: StaticQueryPart | AttributeInput) => {
  if (typeof queryPart !== "object" || queryPart === null) {
    return queryPart;
  }

  if ("range" in queryPart && queryPart.range) {
    return queryPart.range;
  }

  if ("eq" in queryPart && queryPart.eq) {
    return queryPart.eq;
  }

  if ("oneOf" in queryPart && queryPart.oneOf) {
    return queryPart.oneOf;
  }

  return queryPart;
};

export const QueryVarsBuilderUtils = {
  getBooleanValueFromElement,
  extractConditionValueFromFilterElement,
  mapStaticQueryPartToLegacyVariables,
};
