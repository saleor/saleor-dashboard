import { Option } from "@saleor/macaw-ui-next";

export type ConditionType =
  | "is"
  | "equals"
  | "in"
  | "between"
  | "lower"
  | "greater";

export type ConditionValue = Option[] | string | null;

export class Condition {
  constructor(
    public name: string | null,
    public type: ConditionType,
    public values: ConditionValue,
  ) {}

  public static empty(): Condition {
    return new Condition(null, "is", null);
  }

  public static fromFormValues(data: Condition): Condition {
    return new Condition(data.name, data.type, data.values);
  }
}
