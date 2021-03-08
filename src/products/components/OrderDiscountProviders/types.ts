import { Money } from "@saleor/fragments/types/Money";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";
import { OrderDetails_order_lines_undiscountedUnitPrice } from "@saleor/orders/types/OrderDetails";

import { OrderLineDiscountContextConsumerProps } from "./OrderLineDiscountProvider";

export interface OrderDiscountData extends OrderDiscountCommonInput {
  amount: Money;
}

export type GetOrderLineDiscountContextConsumerProps = (
  orderLineId: string
) => OrderLineDiscountContextConsumerProps;

export interface OrderLineDiscountData extends OrderDiscountCommonInput {
  moneyValue: Money;
  undiscountedPrice: OrderDetails_order_lines_undiscountedUnitPrice;
}

export interface OrderDiscountConsumerCommonProps {
  openDialog: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  undiscountedPrice: Money;
  discountedPrice: Money;
}

export interface OrderLineDiscountConsumerProps {
  children: (values: OrderLineDiscountContextConsumerProps) => React.ReactNode;
  orderLineId: string;
}
