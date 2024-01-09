import { Option } from "@saleor/macaw-ui-next";

export class Condition {
  constructor(
    public type: string | null,
    public condition: "is",
    public values: Option[],
  ) {}

  public static empty(): Condition {
    return new Condition(null, "is", []);
  }

  public static fromFormValues(data: Condition): Condition {
    return new Condition(data.type, data.condition, data.values);
  }
}
