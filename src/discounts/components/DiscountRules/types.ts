import { Option } from "@saleor/macaw-ui-next";

export interface DiscountRule {
  id: string;
  name: string;
  description: string;
}

export interface DiscountCondition {
  type: string;
  values: Option[];
}

export type DiscountType = "fixed" | "percentage";
