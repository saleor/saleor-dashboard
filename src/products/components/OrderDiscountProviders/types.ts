import { type MoneyFragment, type TaxedMoneyFragment } from "@dashboard/graphql";
import { type OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountCommonModal/types";

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

export interface OrderDiscountConsumerCommonProps {
  openDialog: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
}
