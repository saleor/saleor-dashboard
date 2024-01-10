import { Condition, ConditionType } from "../Condition";

export type OrderConditionName = "subtotalPrice" | "totalPrice";

export class OrderCondition extends Condition {
  constructor(
    public name: OrderConditionName | null,
    public type: ConditionType,
    public values: string,
  ) {
    super(name, type, values);
  }
}
