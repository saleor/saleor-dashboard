import { MoneyFragment, TaxedMoneyFragment } from "@saleor/graphql";
import { OrderDiscountCommonInput } from "@saleor/orders/components/OrderDiscountCommonModal/types";

import { OrderLineDiscountContextConsumerProps } from "./OrderLineDiscountProvider";

export interface OrderDiscountData extends OrderDiscountCommonInput {
  amount: MoneyFragment;
}

export type GetOrderLineDiscountContextConsumerProps = (
  orderLineId: string,
) => OrderLineDiscountContextConsumerProps;

export interface OrderLineDiscountData extends OrderDiscountCommonInput {
  moneyValue: MoneyFragment;
  undiscountedPrice: TaxedMoneyFragment;
}

export interface OrderDiscountConsumerCommonProps {
  openDialog: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  undiscountedPrice: MoneyFragment;
  discountedPrice: MoneyFragment;
}

export interface OrderLineDiscountConsumerProps {
  children: (values: OrderLineDiscountContextConsumerProps) => React.ReactNode;
  orderLineId: string;
}
