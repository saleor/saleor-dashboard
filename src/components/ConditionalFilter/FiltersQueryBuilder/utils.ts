import { AttributeInput } from "../../../graphql";
import { FilterElement } from "../FilterElement";
import {
  ConditionValue,
  isItemOption,
  isItemOptionArray,
  ItemOption,
} from "../FilterElement/ConditionValue";
import { StaticQueryPart } from "./types";

type ProcessedConditionValue =
  | string
  | boolean
  | string[]
  | { range: { gte?: unknown; lte?: unknown } }
  | { eq: unknown }
  | { oneOf: unknown[] };

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
 * Uses originalSlug if available, falls back to value.
 */
function extractValueFromOption(value: unknown): string {
  return isItemOption(value) ? value.originalSlug || value.value : (value as string);
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
function getBooleanValueFromElement(element: FilterElement): boolean {
  const { value: selectedValue } = element.condition.selected;

  return extractBooleanValue(selectedValue);
}

function getIntegerValueFromElement(element: FilterElement): number | number[] | null {
  const { value: selectedValue } = element.condition.selected;

  if (Array.isArray(selectedValue) && selectedValue.length > 0) {
    const parsed = selectedValue
      .map((x: string | ItemOption) => {
        if (isItemOption(x)) {
          return parseInt(x.value, 10);
        }

        return parseInt(x, 10);
      })
      .filter(x => !Number.isNaN(x));

    return parsed.length > 0 ? parsed : null;
  }

  if (typeof selectedValue === "number") {
    return selectedValue;
  }

  const rawValue = extractValueFromOption(selectedValue);
  const parsed = parseInt(rawValue, 10);

  return isNaN(parsed) ? null : parsed;
}

function getFloatValueFromElement(element: FilterElement): number | number[] | null {
  const { value: selectedValue } = element.condition.selected;

  if (Array.isArray(selectedValue) && selectedValue.length > 0) {
    const parsed = selectedValue
      .map((x: string | ItemOption) => {
        if (isItemOption(x)) {
          return parseFloat(x.value);
        }

        return parseFloat(x);
      })
      .filter(x => !Number.isNaN(x));

    return parsed.length > 0 ? parsed : null;
  }

  if (typeof selectedValue === "number") {
    return selectedValue;
  }

  const rawValue = extractValueFromOption(selectedValue);
  const parsed = parseFloat(rawValue);

  return isNaN(parsed) ? null : parsed;
}

function isAnyTuple(value: unknown): value is [unknown, unknown] {
  return Array.isArray(value) && value.length === 2;
}

/**
 * Handle range conditions for input types
 * and builds the inner range object with gte/lte properties
 */
function buildRangeObject(
  selectedValue: unknown,
  label: string,
): { gte?: unknown; lte?: unknown } | null {
  if (label === "lower") {
    const value = extractValueFromOption(selectedValue);

    return { lte: value };
  }

  if (label === "greater") {
    const value = extractValueFromOption(selectedValue);

    return { gte: value };
  }

  if (isAnyTuple(selectedValue) && label === "between") {
    const [gte, lte] = selectedValue;

    return { gte, lte };
  }

  return null;
}

/**
 * Handle range conditions for input types:
 * - IntFilterInput
 * - DateTimeFilterInput (not DateTimeRangeInput) (this should probably be separate queryVarBuilder)
 * - DecimalFilterInput
 */
function handleRangeCondition(
  selectedValue: unknown,
  label: string,
): ProcessedConditionValue | null {
  if (selectedValue === null || selectedValue === undefined || selectedValue === "") {
    return null;
  }

  if (label === "is") {
    if (Array.isArray(selectedValue) && selectedValue.length > 0) {
      return {
        oneOf: selectedValue.map(extractValueFromOption),
      };
    }

    return {
      eq: extractValueFromOption(selectedValue),
    };
  }

  const range = buildRangeObject(selectedValue, label);

  if (range) {
    return { range };
  }

  return null;
}

function handleBooleanCondition(selectedValue: ConditionValue): ProcessedConditionValue | null {
  if (isItemOption(selectedValue) && ["true", "false"].includes(selectedValue.value)) {
    return extractBooleanValue(selectedValue);
  }

  if (typeof selectedValue === "string" && ["true", "false"].includes(selectedValue)) {
    return extractBooleanValue(selectedValue);
  }

  return null;
}

function handleSingleOption(selectedValue: unknown): ProcessedConditionValue | null {
  if (isItemOption(selectedValue)) {
    const eq = selectedValue.originalSlug || selectedValue.value;

    return { eq };
  }

  return null;
}

function handleMultipleOption(selectedValue: ConditionValue): ProcessedConditionValue | null {
  if (isItemOptionArray(selectedValue)) {
    const oneOf = extractValuesFromOptionArray(selectedValue);

    return { oneOf };
  }

  return null;
}

/**
 * Handle string values
 */
function handleStringCondition(selectedValue: ConditionValue): ProcessedConditionValue | null {
  if (typeof selectedValue === "string") {
    const eq = selectedValue;

    return { eq };
  }

  return null;
}

/**
 * Handle string arrays
 */
function handleArrayCondition(selectedValue: ConditionValue): ProcessedConditionValue | null {
  if (Array.isArray(selectedValue) && typeof selectedValue[0] === "string") {
    const oneOf = selectedValue as string[];

    return { oneOf };
  }

  return null;
}

/**
 * Processes condition values for different condition types.
 */
const extractConditionValueFromFilterElement = (
  element: FilterElement,
): ProcessedConditionValue => {
  const { value: selectedValue, conditionValue } = element.condition.selected;

  if (!conditionValue) {
    return "";
  }

  const { label } = conditionValue;

  const handlers = [
    () => handleBooleanCondition(selectedValue),
    () => handleRangeCondition(selectedValue, label),
    () => handleSingleOption(selectedValue),
    () => handleMultipleOption(selectedValue),
    () => handleStringCondition(selectedValue),
    () => handleArrayCondition(selectedValue),
  ];

  for (const handler of handlers) {
    const result = handler();

    if (result !== null) {
      return result;
    }
  }

  // Fallback case - return as-is with proper type casting
  return selectedValue as ProcessedConditionValue;
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
  getIntegerValueFromElement,
  getFloatValueFromElement,
  extractValueFromOption,
  buildRangeObject,
  handleRangeCondition,
  handleBooleanCondition,
  handleSingleOption,
  handleMultipleOption,
  handleStringCondition,
  handleArrayCondition,
};
