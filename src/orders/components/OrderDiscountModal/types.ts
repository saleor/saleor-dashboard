import { type DiscountValueTypeEnum } from "@dashboard/graphql";

export interface OrderDiscountCommonInput {
  value: number;
  reason: string;
  calculationMode: DiscountValueTypeEnum;
}
