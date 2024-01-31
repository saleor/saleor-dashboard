import { Option } from "@saleor/macaw-ui-next";

export type ConditionType = "is" | "between" | "lower" | "greater";

export type ConditionValue = Option[] | string | [string, string] | null;

export interface Condition {
  id: string | null;
  type: ConditionType;
  value: ConditionValue;
}

export const createEmptyCodition = (): Condition => ({
  id: null,
  type: "is",
  value: null,
});

export const isString = (
  conditionValue: ConditionValue,
): conditionValue is string => {
  return typeof conditionValue === "string";
};

export const isTuple = (
  conditionValue: ConditionValue,
): conditionValue is [string, string] => {
  return (
    Array.isArray(conditionValue) &&
    conditionValue.length === 2 &&
    typeof conditionValue[0] === "string" &&
    typeof conditionValue[1] === "string"
  );
};

export const isArrayOfOptions = (
  conditionValue: ConditionValue,
): conditionValue is Option[] => {
  return Array.isArray(conditionValue) && !isTuple(conditionValue);
};
