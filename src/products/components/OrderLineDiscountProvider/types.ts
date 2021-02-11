import { Money } from "@saleor/fragments/types/Money";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import { OrderDetails_order_lines_undiscountedUnitPrice } from "@saleor/orders/types/OrderDetails";

import { OrderLineDiscountProviderValues } from "./OrderLineDiscountProvider";

export type GetOrderLineDiscountProviderValues = (
  orderLineId: string
) => OrderLineDiscountProviderValues;

export interface OrderLineDiscountData extends OrderDiscountCommonInput {
  moneyValue: Money;
  undiscountedPrice: OrderDetails_order_lines_undiscountedUnitPrice;
}
