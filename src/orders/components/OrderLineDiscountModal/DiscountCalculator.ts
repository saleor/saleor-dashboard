/* eslint-disable @typescript-eslint/member-ordering */
import { IMoney } from "@saleor/components/Money";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import { OrderDiscountCalculationMode, OrderDiscountData } from "./types";

const PERMIL = 0.01;
const DEFAULT_AMOUNT = 0;

class DiscountCalculator {
  order: OrderDetails_order;
  discount: OrderDiscountData;

  constructor(order, orderDiscount) {
    this.order = order;
    this.discount = orderDiscount;
  }

  private getOrderTotalMoney = () => this.order.total.gross;

  getCalculatedDiscountAmount = (): number => {
    if (!this.discount) {
      return DEFAULT_AMOUNT;
    }

    const { type, value } = this.discount;

    if (type === OrderDiscountCalculationMode.PERCENTAGE) {
      return value * PERMIL * this.getOrderTotalMoney().amount;
    }

    return value;
  };

  getDiscountedMoney = () => ({
    amount: this.getCalculatedDiscountAmount(),
    currency: this.getOrderTotalMoney().currency
  });

  getTotalMoneyIncludingDiscount = (): IMoney => {
    const { amount: totalAmount, currency } = this.getOrderTotalMoney();

    return this.discount
      ? {
          amount: totalAmount - this.getCalculatedDiscountAmount(),
          currency
        }
      : this.getOrderTotalMoney();
  };
}

const useDiscountCalculator = (
  order: OrderDetails_order,
  discount: OrderDiscountData
) => new DiscountCalculator(order, discount);

export default useDiscountCalculator;
