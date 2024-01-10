import { Option } from "@saleor/macaw-ui-next";

import { Condition, ConditionType } from "../Condition";

export type CatalogConditionName =
  | "category"
  | "collection"
  | "product"
  | "variant";

export class CatalogCondition extends Condition {
  constructor(
    public name: CatalogConditionName | null,
    public type: ConditionType,
    public values: Option[],
  ) {
    super(name, type, values);
  }
}
