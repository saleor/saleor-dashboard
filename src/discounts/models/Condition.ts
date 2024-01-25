import { Option } from "@saleor/macaw-ui-next";

export type ConditionType = "is" | "between" | "lower" | "greater";

export type ConditionValue = Option[] | string | [string, string] | null;

export interface Condition {
  id: string | null;
  type: ConditionType;
  values: ConditionValue;
}

export const createEmptyCodition = (): Condition => ({
  id: null,
  type: "is",
  values: null,
});
