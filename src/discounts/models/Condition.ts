import { Option } from "@saleor/macaw-ui-next";

export type ConditionType = "is" | "between" | "lower" | "greater";

export type ConditionValue = Option[] | string | [string, string] | null;

export class Condition {
  constructor(
    public id: string | null,
    public type: ConditionType,
    public values: ConditionValue,
  ) {}

  public static empty(): Condition {
    return new Condition(null, "is", null);
  }
}
