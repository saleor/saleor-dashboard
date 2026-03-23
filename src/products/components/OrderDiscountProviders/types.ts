import {
  type MoneyFragment,
  type OrderDiscountType,
  type TaxedMoneyFragment,
} from "@dashboard/graphql";
import { type OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountModal/types";

import { type OrderLineDiscountContextConsumerProps } from "./OrderLineDiscountProvider";

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

export interface AutomaticDiscountInfo {
  type: OrderDiscountType;
  name: string | null;
}

export interface OrderDiscountConsumerCommonProps {
  openDialog: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
}
