import { Money } from "@saleor/fragments/types/Money";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";

export interface OrderDiscountData extends OrderDiscountCommonInput {
  amount: Money;
}
